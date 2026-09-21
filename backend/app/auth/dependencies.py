from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.auth.security import (
    ALGORITHM,
    SECRET_KEY,
)


# ============================================================
# OAUTH2 / BEARER TOKEN
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


# ============================================================
# GET CURRENT USER
# ============================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Decode the JWT token and return the authenticated user.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:

        # ----------------------------------------------------
        # Decode JWT
        #
        # IMPORTANT:
        # This MUST use the same SECRET_KEY and ALGORITHM
        # used by security.py when creating the token.
        # ----------------------------------------------------

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # ----------------------------------------------------
        # Get user ID from JWT "sub"
        # ----------------------------------------------------

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        # JWT "sub" is stored as a string
        user_id = int(user_id)

    except (
        JWTError,
        ValueError,
        TypeError
    ):

        raise credentials_exception


    # ========================================================
    # FIND USER IN DATABASE
    # ========================================================

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )


    # --------------------------------------------------------
    # User doesn't exist
    # --------------------------------------------------------

    if user is None:
        raise credentials_exception


    # --------------------------------------------------------
    # Inactive users cannot access protected APIs
    # --------------------------------------------------------

    if not user.is_active:
        raise credentials_exception


    return user


# ============================================================
# ROLE AUTHORIZATION
# ============================================================

def require_role(*allowed_roles: str):
    """
    Restrict an endpoint to specific user roles.

    Example:

        Depends(require_role("FARMER"))

    Or:

        Depends(require_role("FARMER", "FPO"))
    """

    def role_checker(
        current_user: User = Depends(get_current_user)
    ):

        # ----------------------------------------------------
        # Get user's actual database role
        # ----------------------------------------------------

        if hasattr(current_user.role, "value"):

            user_role = current_user.role.value

        else:

            user_role = str(current_user.role)


        user_role = user_role.upper()


        # ----------------------------------------------------
        # Normalize allowed roles
        # ----------------------------------------------------

        allowed = [
            str(role).upper()
            for role in allowed_roles
        ]


        # ----------------------------------------------------
        # Check authorization
        # ----------------------------------------------------

        if user_role not in allowed:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "message": (
                        "You do not have permission "
                        "to access this resource."
                    ),
                    "required_roles": allowed,
                    "your_role": user_role,
                },
            )


        return current_user


    return role_checker