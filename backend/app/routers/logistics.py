from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import require_role
from app.database import get_db
from app.models.logistics import LogisticsOption
from app.models.user import User
from app.schemas.logistics import (
    LogisticsCreate,
    LogisticsResponse
)


router = APIRouter(
    prefix="/api/logistics",
    tags=["Logistics"]
)


@router.post(
    "",
    response_model=LogisticsResponse,
    status_code=201
)
def create_logistics(
    data: LogisticsCreate,
    current_user: User = Depends(
        require_role("ADMIN")
    ),
    db: Session = Depends(get_db)
):

    option = LogisticsOption(
        **data.model_dump()
    )

    db.add(option)
    db.commit()
    db.refresh(option)

    return option


@router.get(
    "",
    response_model=List[LogisticsResponse]
)
def get_logistics(
    current_user: User = Depends(
        require_role(
            "FARMER",
            "FPO",
            "BUYER",
            "ADMIN"
        )
    ),
    db: Session = Depends(get_db)
):

    return db.query(
        LogisticsOption
    ).filter(
        LogisticsOption.available == True
    ).all()