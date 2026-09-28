from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.schemas.user import UserResponse

class ListingBase(BaseModel):
    title: str
    food_type: str
    quantity: str
    preparation_time: str
    pickup_deadline: str
    location: str
    description: Optional[str] = None

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    food_type: Optional[str] = None
    quantity: Optional[str] = None
    preparation_time: Optional[str] = None
    pickup_deadline: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class ListingResponse(ListingBase):
    id: int
    donor_id: int
    status: str
    claimed_by_org_id: Optional[int] = None
    created_at: datetime
    donor: Optional[UserResponse] = None
    claimed_by_org: Optional[UserResponse] = None

    class Config:
        from_attributes = True
