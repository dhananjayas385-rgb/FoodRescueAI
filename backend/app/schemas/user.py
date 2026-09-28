from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "donor"  # donor, organization, admin
    organization_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

# Registration schema
class UserCreate(UserBase):
    password: str

# Login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User response schema
class UserResponse(UserBase):
    id: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token response schema
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
