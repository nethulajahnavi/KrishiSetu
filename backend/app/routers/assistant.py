from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/assistant",
    tags=["AI Assistant"]
)


@router.post("")
def assistant(
    request: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = request.get(
        "question",
        request.get("message", "")
    )

    question = str(question).strip()

    if not question:
        return {
            "success": False,
            "message": "Please ask a question."
        }

    if hasattr(current_user.role, "value"):
        user_role = current_user.role.value
    else:
        user_role = str(current_user.role)

    user_role = user_role.upper()

    if user_role == "FARMER":
        response = (
            "I can help you with market prices, "
            "net realisation, buyer matching, "
            "logistics, weather and selling decisions."
        )

    elif user_role == "FPO":
        response = (
            "I can help your FPO with farmer aggregation, "
            "market prices, buyer matching, logistics "
            "and transaction planning."
        )

    elif user_role == "BUYER":
        response = (
            "I can help you with farmer sourcing, "
            "market information, logistics and "
            "transaction planning."
        )

    elif user_role == "ADMIN":
        response = (
            "I can help with platform monitoring, "
            "market information, buyers and transactions."
        )

    else:
        response = (
            "I can help you with KrishiSetu services."
        )

    return {
        "success": True,
        "question": question,
        "role": user_role,
        "response": response
    }