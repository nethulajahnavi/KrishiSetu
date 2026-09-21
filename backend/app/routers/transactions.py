from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.buyer import Buyer
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionStatusUpdate,
    PaymentStatusUpdate,
    DeliveryStatusUpdate,
    DisputeStatusUpdate,
)
from app.services.notification_service import create_notification

router = APIRouter(
    prefix="/api/transactions",
    tags=["Transactions"]
)


# ---------------------------------------------------------
# CREATE TRANSACTION
# Farmer/FPO creates an offer for a buyer
# ---------------------------------------------------------

@router.post(
    "",
    response_model=TransactionResponse,
    status_code=201
)
def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(
        require_role("FARMER", "FPO")
    ),
    db: Session = Depends(get_db)
):
    buyer = (
        db.query(Buyer)
        .filter(
            Buyer.id == data.buyer_id,
            Buyer.active == True
        )
        .first()
    )

    if buyer is None:
        raise HTTPException(
            status_code=404,
            detail="Buyer not found or inactive"
        )

    total_amount = (
        data.quantity_quintals
        * data.agreed_price_per_quintal
    )

    transaction = Transaction(
        farmer_id=current_user.id,
        buyer_id=data.buyer_id,
        commodity=data.commodity,
        quantity_quintals=data.quantity_quintals,
        agreed_price_per_quintal=data.agreed_price_per_quintal,
        total_amount=total_amount,
        status="OFFERED"
    )

    db.add(transaction)

    # Notify the buyer about the new transaction offer
    if buyer.user_id is not None:
        create_notification(
            db=db,
            user_id=buyer.user_id,
            title="New Transaction Offer",
            message=(
            f"You received a new offer for {data.commodity} "
            f"at \u20b9{data.agreed_price_per_quintal} per quintal "
            f"for {data.quantity_quintals} quintals."
            ),
            notification_type="TRANSACTION",
        )

    db.commit()
    db.refresh(transaction)

    return transaction


# ---------------------------------------------------------
# GET MY TRANSACTIONS
# Farmer/FPO sees transactions they created
# Buyer sees transactions assigned to their buyer profile
# ---------------------------------------------------------

@router.get(
    "/my-transactions",
    response_model=list[TransactionResponse]
)
def get_my_transactions(
    current_user: User = Depends(
        require_role("FARMER", "FPO", "BUYER")
    ),
    db: Session = Depends(get_db)
):
    if current_user.role.value in ["FARMER", "FPO"]:
        return (
            db.query(Transaction)
            .filter(
                Transaction.farmer_id == current_user.id
            )
            .order_by(Transaction.created_at.desc())
            .all()
        )

    buyer_profile = (
        db.query(Buyer)
        .filter(
            Buyer.user_id == current_user.id
        )
        .first()
    )

    if buyer_profile is None:
        return []

    return (
        db.query(Transaction)
        .filter(
            Transaction.buyer_id == buyer_profile.id
        )
        .order_by(Transaction.created_at.desc())
        .all()
    )


# ---------------------------------------------------------
# UPDATE TRANSACTION STATUS
# ---------------------------------------------------------

@router.patch(
    "/{transaction_id}/status",
    response_model=TransactionResponse
)
def update_transaction_status(
    transaction_id: int,
    data: TransactionStatusUpdate,
    current_user: User = Depends(
        require_role("FARMER", "FPO", "BUYER")
    ),
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id
        )
        .first()
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    new_status = data.status.upper().strip()
    current_status = transaction.status.upper().strip()

    allowed_statuses = {
        "OFFERED",
        "ACCEPTED",
        "REJECTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
    }

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid transaction status",
                "allowed_statuses": sorted(allowed_statuses)
            }
        )

    # -----------------------------------------------------
    # Determine ownership
    # -----------------------------------------------------

    is_farmer = (
        current_user.role.value in ["FARMER", "FPO"]
        and transaction.farmer_id == current_user.id
    )

    buyer_profile = None

    if current_user.role.value == "BUYER":
        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.user_id == current_user.id
            )
            .first()
        )

    is_buyer = (
        current_user.role.value == "BUYER"
        and buyer_profile is not None
        and transaction.buyer_id == buyer_profile.id
    )

    if not is_farmer and not is_buyer:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this transaction"
        )

    # -----------------------------------------------------
    # Prevent changing a completed/cancelled/rejected offer
    # -----------------------------------------------------

    if current_status in {
        "COMPLETED",
        "CANCELLED",
        "REJECTED"
    }:
        raise HTTPException(
            status_code=400,
            detail=f"Transaction is already {current_status}"
        )

    # -----------------------------------------------------
    # BUYER actions
    # OFFERED -> ACCEPTED
    # OFFERED -> REJECTED
    # -----------------------------------------------------

    if is_buyer:

        if current_status != "OFFERED":
            raise HTTPException(
                status_code=400,
                detail="Buyer can only accept or reject an offered transaction"
            )

        if new_status not in {
            "ACCEPTED",
            "REJECTED"
        }:
            raise HTTPException(
                status_code=403,
                detail={
                    "message": "Buyer can only ACCEPT or REJECT an offer",
                    "allowed_statuses": [
                        "ACCEPTED",
                        "REJECTED"
                    ]
                }
            )

    # -----------------------------------------------------
    # FARMER/FPO actions
    # ACCEPTED -> IN_PROGRESS
    # IN_PROGRESS -> COMPLETED
    # OFFERED/ACCEPTED/IN_PROGRESS -> CANCELLED
    # -----------------------------------------------------

    if is_farmer:

        valid_farmer_transition = False

        if current_status == "OFFERED":
            valid_farmer_transition = (
                new_status == "CANCELLED"
            )

        elif current_status == "ACCEPTED":
            valid_farmer_transition = (
                new_status in {
                    "IN_PROGRESS",
                    "CANCELLED"
                }
            )

        elif current_status == "IN_PROGRESS":
            valid_farmer_transition = (
                new_status in {
                    "COMPLETED",
                    "CANCELLED"
                }
            )

        if not valid_farmer_transition:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Invalid status transition",
                    "current_status": current_status,
                    "requested_status": new_status
                }
            )

    # -----------------------------------------------------
    # Update transaction status
    # -----------------------------------------------------

    transaction.status = new_status

    # -----------------------------------------------------
    # Notifications
    # -----------------------------------------------------

    # Notify farmer when buyer accepts the offer
    if is_buyer and new_status == "ACCEPTED":

        create_notification(
            db=db,
            user_id=transaction.farmer_id,
            title="Offer Accepted",
            message=(
                f"Your offer for {transaction.commodity} "
                f"has been accepted by the buyer at "
                f"\u20b9{transaction.agreed_price_per_quintal} per quintal "
                f"for {transaction.quantity_quintals} quintals."
            ),
            notification_type="TRANSACTION",
        )

    # Notify farmer when buyer rejects the offer
    elif is_buyer and new_status == "REJECTED":

        create_notification(
            db=db,
            user_id=transaction.farmer_id,
            title="Offer Rejected",
            message=(
                f"Your offer for {transaction.commodity} "
                f"at \u20b9{transaction.agreed_price_per_quintal} per quintal "
                f"for {transaction.quantity_quintals} quintals "
                f"has been rejected by the buyer."
            ),
            notification_type="TRANSACTION",
        )

    # Notify buyer when farmer cancels the offer
    elif is_farmer and new_status == "CANCELLED":

        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.id == transaction.buyer_id
            )
            .first()
        )

        if buyer_profile is not None and buyer_profile.user_id is not None:

            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Transaction Cancelled",
                message=(
                    f"The farmer has cancelled the offer for "
                    f"{transaction.commodity} at "
                    f"\u20b9{transaction.agreed_price_per_quintal} per quintal "
                    f"for {transaction.quantity_quintals} quintals."
                ),
                notification_type="TRANSACTION",
            )

    # Notify buyer when farmer starts processing
    elif (
        is_farmer
        and current_status == "ACCEPTED"
        and new_status == "IN_PROGRESS"
    ):

        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.id == transaction.buyer_id
            )
            .first()
        )

        if buyer_profile is not None and buyer_profile.user_id is not None:

            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Transaction In Progress",
                message=(
                    f"The farmer has started processing your "
                    f"{transaction.commodity} transaction for "
                    f"{transaction.quantity_quintals} quintals at "
                    f"\u20b9{transaction.agreed_price_per_quintal} per quintal."
                ),
                notification_type="TRANSACTION",
            )
        # Notify buyer when farmer completes the transaction
    elif (
        is_farmer
        and current_status == "IN_PROGRESS"
        and new_status == "COMPLETED"
    ):

        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.id == transaction.buyer_id
            )
            .first()
        )

        if buyer_profile is not None and buyer_profile.user_id is not None:

            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Transaction Completed",
                message=(
                    f"Your {transaction.commodity} transaction "
                    f"for {transaction.quantity_quintals} quintals "
                    f"at \u20b9{transaction.agreed_price_per_quintal} "
                    f"per quintal has been completed by the farmer."
                ),
                notification_type="TRANSACTION",
            )

    # -----------------------------------------------------
    # Save changes
    # -----------------------------------------------------

    db.commit()
    db.refresh(transaction)

    return transaction# ---------------------------------------------------------
# UPDATE PAYMENT STATUS
# ---------------------------------------------------------

@router.patch(
    "/{transaction_id}/payment-status",
    response_model=TransactionResponse
)
def update_payment_status(
    transaction_id: int,
    data: PaymentStatusUpdate,
    current_user: User = Depends(
        require_role("FARMER", "FPO", "BUYER")
    ),
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id
        )
        .first()
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    new_payment_status = (
        data.payment_status.upper().strip()
    )

    allowed_statuses = {
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED"
    }

    if new_payment_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid payment status",
                "allowed_statuses": sorted(allowed_statuses)
            }
        )

    # -----------------------------------------------------
    # Determine transaction ownership
    # -----------------------------------------------------

    is_farmer = (
        current_user.role.value in ["FARMER", "FPO"]
        and transaction.farmer_id == current_user.id
    )

    buyer_profile = None

    if current_user.role.value == "BUYER":
        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.user_id == current_user.id
            )
            .first()
        )

    is_buyer = (
        current_user.role.value == "BUYER"
        and buyer_profile is not None
        and transaction.buyer_id == buyer_profile.id
    )

    if not is_farmer and not is_buyer:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this transaction"
        )

    # -----------------------------------------------------
    # Payment transition rules
    # -----------------------------------------------------

    current_payment_status = (
        transaction.payment_status.upper().strip()
    )

    if current_payment_status == "PAID":
        if new_payment_status != "PAID":
            raise HTTPException(
                status_code=400,
                detail="Paid transactions cannot be changed to another payment status"
            )

    if current_payment_status == "REFUNDED":
        if new_payment_status != "REFUNDED":
            raise HTTPException(
                status_code=400,
                detail="Refunded transactions cannot be changed"
            )

    # -----------------------------------------------------
    # Update payment status
    # -----------------------------------------------------

    transaction.payment_status = new_payment_status

    # -----------------------------------------------------
    # Notifications
    # -----------------------------------------------------

    # Notify farmer when buyer marks payment as PAID
    if is_buyer and new_payment_status == "PAID":

        create_notification(
            db=db,
            user_id=transaction.farmer_id,
            title="Payment Received",
            message=(
                f"Payment of \u20b9{transaction.total_amount} "
                f"for your {transaction.commodity} transaction "
                f"has been marked as paid by the buyer."
            ),
            notification_type="PAYMENT",
        )

    # Notify buyer when farmer marks payment as PAID
    elif is_farmer and new_payment_status == "PAID":

        if buyer_profile is None:
            buyer_profile = (
                db.query(Buyer)
                .filter(
                    Buyer.id == transaction.buyer_id
                )
                .first()
            )

        if buyer_profile is not None and buyer_profile.user_id is not None:

            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Payment Received",
                message=(
                    f"Payment of \u20b9{transaction.total_amount} "
                    f"for your {transaction.commodity} transaction "
                    f"has been marked as paid."
                ),
                notification_type="PAYMENT",
            )

    # Notify the farmer when payment fails
    elif is_buyer and new_payment_status == "FAILED":

        create_notification(
            db=db,
            user_id=transaction.farmer_id,
            title="Payment Failed",
            message=(
                f"Payment for your {transaction.commodity} transaction "
                f"of \u20b9{transaction.total_amount} has failed."
            ),
            notification_type="PAYMENT",
        )

    # Notify the farmer when payment is refunded
    elif is_buyer and new_payment_status == "REFUNDED":

        create_notification(
            db=db,
            user_id=transaction.farmer_id,
            title="Payment Refunded",
            message=(
                f"Payment of \u20b9{transaction.total_amount} "
                f"for your {transaction.commodity} transaction "
                f"has been refunded."
            ),
            notification_type="PAYMENT",
        )

    # -----------------------------------------------------
    # Save changes
    # -----------------------------------------------------

    db.commit()
    db.refresh(transaction)

    return transaction
# ---------------------------------------------------------
# UPDATE DELIVERY STATUS
# ---------------------------------------------------------

@router.patch(
    "/{transaction_id}/delivery-status",
    response_model=TransactionResponse
)
def update_delivery_status(
    transaction_id: int,
    data: DeliveryStatusUpdate,
    current_user: User = Depends(
        require_role("FARMER", "FPO", "BUYER")
    ),
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id
        )
        .first()
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    new_delivery_status = (
        data.delivery_status.upper().strip()
    )

    allowed_statuses = {
        "PENDING",
        "IN_TRANSIT",
        "DELIVERED",
        "FAILED"
    }

    if new_delivery_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid delivery status",
                "allowed_statuses": sorted(allowed_statuses)
            }
        )

    # -----------------------------------------------------
    # Determine transaction ownership
    # -----------------------------------------------------

    is_farmer = (
        current_user.role.value in ["FARMER", "FPO"]
        and transaction.farmer_id == current_user.id
    )

    buyer_profile = None

    if current_user.role.value == "BUYER":
        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.user_id == current_user.id
            )
            .first()
        )

    is_buyer = (
        current_user.role.value == "BUYER"
        and buyer_profile is not None
        and transaction.buyer_id == buyer_profile.id
    )

    if not is_farmer and not is_buyer:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this transaction"
        )

    # -----------------------------------------------------
    # Delivery transition rules
    # -----------------------------------------------------

    current_delivery_status = (
        transaction.delivery_status.upper().strip()
    )

    if current_delivery_status == "DELIVERED":
        if new_delivery_status != "DELIVERED":
            raise HTTPException(
                status_code=400,
                detail="Delivered transactions cannot be moved back"
            )

    if current_delivery_status == "FAILED":
        if new_delivery_status != "FAILED":
            raise HTTPException(
                status_code=400,
                detail="Failed deliveries cannot be changed"
            )

    # -----------------------------------------------------
    # Buyer can confirm delivery
    # -----------------------------------------------------

    if is_buyer:

        if current_delivery_status == "PENDING":
            raise HTTPException(
                status_code=400,
                detail="Delivery must be IN_TRANSIT before the buyer can confirm delivery"
            )

        if current_delivery_status == "IN_TRANSIT":
            if new_delivery_status != "DELIVERED":
                raise HTTPException(
                    status_code=403,
                    detail={
                        "message": "Buyer can only mark an in-transit delivery as DELIVERED",
                        "allowed_status": "DELIVERED"
                    }
                )

    # -----------------------------------------------------
    # Farmer/FPO can start delivery
    # -----------------------------------------------------

    if is_farmer:

        if current_delivery_status == "PENDING":

            if new_delivery_status not in {
                "IN_TRANSIT",
                "FAILED"
            }:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "message": "Delivery must move from PENDING to IN_TRANSIT or FAILED",
                        "current_status": current_delivery_status,
                        "requested_status": new_delivery_status
                    }
                )

        elif current_delivery_status == "IN_TRANSIT":

            if new_delivery_status not in {
                "DELIVERED",
                "FAILED"
            }:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "message": "Invalid delivery transition",
                        "current_status": current_delivery_status,
                        "requested_status": new_delivery_status
                    }
                )

    # -----------------------------------------------------
    # Update delivery status
    # -----------------------------------------------------

    transaction.delivery_status = new_delivery_status

    # -----------------------------------------------------
    # Notifications
    # -----------------------------------------------------

    # Notify buyer when farmer starts delivery
    if (
        is_farmer
        and current_delivery_status == "PENDING"
        and new_delivery_status == "IN_TRANSIT"
    ):

        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.id == transaction.buyer_id
            )
            .first()
        )

        if buyer_profile is not None and buyer_profile.user_id is not None:

            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Delivery Started",
                message=(
                    f"Your {transaction.commodity} transaction "
                    f"for {transaction.quantity_quintals} quintals "
                    f"is now in transit."
                ),
                notification_type="DELIVERY",
            )

    # -----------------------------------------------------
    # Notify farmer when buyer confirms delivery
    # -----------------------------------------------------

    if (
        is_buyer
        and current_delivery_status == "IN_TRANSIT"
        and new_delivery_status == "DELIVERED"
    ):

        create_notification(
            db=db,
            user_id=transaction.farmer_id,
            title="Delivery Confirmed",
            message=(
                f"Your {transaction.commodity} transaction "
                f"for {transaction.quantity_quintals} quintals "
                f"has been delivered and confirmed by the buyer."
            ),
            notification_type="DELIVERY",
        )

    # -----------------------------------------------------
    # Save changes
    # -----------------------------------------------------

    db.commit()
    db.refresh(transaction)

    return transaction
# ---------------------------------------------------------
# UPDATE DISPUTE STATUS
# ---------------------------------------------------------

@router.patch(
    "/{transaction_id}/dispute-status",
    response_model=TransactionResponse
)
def update_dispute_status(
    transaction_id: int,
    data: DisputeStatusUpdate,
    current_user: User = Depends(
        require_role("FARMER", "FPO", "BUYER", "ADMIN")
    ),
    db: Session = Depends(get_db)
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id
        )
        .first()
    )

    if transaction is None:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    new_dispute_status = (
        data.dispute_status.upper().strip()
    )

    allowed_statuses = {
        "NONE",
        "OPEN",
        "UNDER_REVIEW",
        "RESOLVED"
    }

    if new_dispute_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid dispute status",
                "allowed_statuses": sorted(allowed_statuses)
            }
        )

    # -----------------------------------------------------
    # Determine transaction ownership
    # -----------------------------------------------------

    is_admin = current_user.role.value == "ADMIN"

    is_farmer = (
        current_user.role.value in ["FARMER", "FPO"]
        and transaction.farmer_id == current_user.id
    )

    buyer_profile = None

    if current_user.role.value == "BUYER":
        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.user_id == current_user.id
            )
            .first()
        )

    is_buyer = (
        current_user.role.value == "BUYER"
        and buyer_profile is not None
        and transaction.buyer_id == buyer_profile.id
    )

    if not is_admin and not is_farmer and not is_buyer:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this transaction"
        )

    current_dispute_status = (
        transaction.dispute_status.upper().strip()
    )

    if current_dispute_status == "RESOLVED":
        if new_dispute_status != "RESOLVED":
            raise HTTPException(
                status_code=400,
                detail="Resolved disputes cannot be changed"
            )

    # -----------------------------------------------------
    # Update dispute status
    # -----------------------------------------------------

    transaction.dispute_status = new_dispute_status

    # -----------------------------------------------------
    # Notifications
    # -----------------------------------------------------

    if new_dispute_status == "OPEN":
        other_user_id = None

        if is_farmer or is_admin:
            buyer_profile = (
                db.query(Buyer)
                .filter(
                    Buyer.id == transaction.buyer_id
                )
                .first()
            )

            if buyer_profile is not None:
                other_user_id = buyer_profile.user_id

        elif is_buyer:
            other_user_id = transaction.farmer_id

        if other_user_id is not None:
            create_notification(
                db=db,
                user_id=other_user_id,
                title="Dispute Opened",
                message=(
                    f"A dispute has been opened for your "
                    f"{transaction.commodity} transaction "
                    f"for {transaction.quantity_quintals} quintals."
                ),
                notification_type="DISPUTE",
            )

    elif new_dispute_status == "UNDER_REVIEW":
        if transaction.farmer_id is not None:
            create_notification(
                db=db,
                user_id=transaction.farmer_id,
                title="Dispute Under Review",
                message=(
                    f"The dispute for your {transaction.commodity} "
                    f"transaction is now under review."
                ),
                notification_type="DISPUTE",
            )

        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.id == transaction.buyer_id
            )
            .first()
        )

        if buyer_profile is not None and buyer_profile.user_id is not None:
            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Dispute Under Review",
                message=(
                    f"The dispute for your {transaction.commodity} "
                    f"transaction is now under review."
                ),
                notification_type="DISPUTE",
            )

    elif new_dispute_status == "RESOLVED":
        if transaction.farmer_id is not None:
            create_notification(
                db=db,
                user_id=transaction.farmer_id,
                title="Dispute Resolved",
                message=(
                    f"The dispute for your {transaction.commodity} "
                    f"transaction has been resolved."
                ),
                notification_type="DISPUTE",
            )

        buyer_profile = (
            db.query(Buyer)
            .filter(
                Buyer.id == transaction.buyer_id
            )
            .first()
        )

        if buyer_profile is not None and buyer_profile.user_id is not None:
            create_notification(
                db=db,
                user_id=buyer_profile.user_id,
                title="Dispute Resolved",
                message=(
                    f"The dispute for your {transaction.commodity} "
                    f"transaction has been resolved."
                ),
                notification_type="DISPUTE",
            )

    db.commit()
    db.refresh(transaction)

    return transaction
