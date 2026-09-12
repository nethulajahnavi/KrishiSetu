from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse
)

from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/transactions",
    tags=["Transactions"]
)


@router.post(
    "",
    response_model=TransactionResponse,
    status_code=201
)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    total_amount = (
        data.quantity_quintals
        * data.agreed_price_per_quintal
    )

    transaction = Transaction(
        farmer_id=current_user.id,

        buyer_id=data.buyer_id,

        commodity=data.commodity,

        quantity_quintals=
            data.quantity_quintals,

        agreed_price_per_quintal=
            data.agreed_price_per_quintal,

        total_amount=total_amount,

        status="OFFERED"
    )

    db.add(transaction)

    db.commit()

    db.refresh(transaction)

    return transaction
@router.get(
    "/my-transactions",
    response_model=list[TransactionResponse]
)
def get_my_transactions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return db.query(
        Transaction
    ).filter(
        Transaction.farmer_id == current_user.id
    ).order_by(
        Transaction.created_at.desc()
    ).all()