from pydantic import BaseModel, EmailStr

from app.models.user import UserRole


class UserRegister(BaseModel):

    name: str
    email: EmailStr
    phone: str
    password: str
    role: UserRole = UserRole.FARMER


class UserLogin(BaseModel):

    email: EmailStr
    password: str


class UserResponse(BaseModel):

    id: int
    name: str
    email: EmailStr
    phone: str
    role: UserRole

    class Config:
        from_attributes = True