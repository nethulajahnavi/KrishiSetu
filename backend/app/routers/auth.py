from fastapi import (
    APIRouter,
    Depends,
    Form,
    HTTPException,
    status,
)

from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.security import (
    create_access_token,
    hash_password,
    verify_password,
)

from app.database import get_db
from app.models.user import User, UserRole

from app.schemas.user import (
    UserRegister,
    UserResponse,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Check email
    # -----------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    # -----------------------------------------------------
    # Check phone
    # -----------------------------------------------------

    existing_phone = (
        db.query(User)
        .filter(User.phone == user_data.phone)
        .first()
    )

    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already registered"
        )


    # -----------------------------------------------------
    # Validate role
    # -----------------------------------------------------

    try:
        role = UserRole(user_data.role)

    except (ValueError, TypeError):

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid role. Allowed roles are: "
                "FARMER, FPO, BUYER, TRANSPORTER"
            )
        )


    # -----------------------------------------------------
    # SECURITY
    #
    # Admin accounts cannot be created through
    # public registration.
    # -----------------------------------------------------

    if role == UserRole.ADMIN:

        raise HTTPException(
            status_code=403,
            detail="Admin registration is not allowed."
        )


    # -----------------------------------------------------
    # Hash password
    # -----------------------------------------------------

    try:

        password_hash = hash_password(
            user_data.password
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


    # -----------------------------------------------------
    # Create user
    # -----------------------------------------------------

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=password_hash,
        role=role,
        is_active=True,
    )


    db.add(new_user)


    # -----------------------------------------------------
    # Save user
    # -----------------------------------------------------

    try:

        db.commit()
        db.refresh(new_user)

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to create account."
        )


    return new_user


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),

    role: str = Form(...),

    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # Find account by email
    # -----------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )


    # -----------------------------------------------------
    # Account not found
    # -----------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )


    # -----------------------------------------------------
    # Verify password
    # -----------------------------------------------------

    if not verify_password(
        form_data.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )


    # -----------------------------------------------------
    # Get actual database role safely
    # -----------------------------------------------------

    actual_role = (
        user.role.value
        if hasattr(user.role, "value")
        else str(user.role)
    )

    actual_role = actual_role.upper()


    # -----------------------------------------------------
    # Get role selected on Login page
    # -----------------------------------------------------

    selected_role = str(role).upper()


    # -----------------------------------------------------
    # Check selected role
    # -----------------------------------------------------

    if actual_role != selected_role:

        raise HTTPException(
            status_code=403,
            detail=(
                "This account is registered as "
                f"{actual_role.title()}, not "
                f"{selected_role.title()}."
            )
        )


    # -----------------------------------------------------
    # Create JWT
    # -----------------------------------------------------

    access_token = create_access_token(
        user_id=user.id,
        role=actual_role
    )


    # -----------------------------------------------------
    # Return login response
    # -----------------------------------------------------

    return {
        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "role": actual_role
        }
    }