from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.models.listing import FoodListing
from app.schemas.user import UserResponse
from app.api.deps import get_current_user

router = APIRouter()

def check_admin(user: User):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )

@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint to list all registered users and organizations."""
    check_admin(current_user)
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.put("/users/{user_id}/verify", response_model=UserResponse)
def verify_organization(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Admin endpoint to verify/approve an Organization account."""
    check_admin(current_user)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user

@router.get("/stats")
def get_platform_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get platform overview metrics (Admin or general metrics)."""
    total_users = db.query(User).count()
    total_donors = db.query(User).filter(User.role == "donor").count()
    total_organizations = db.query(User).filter(User.role == "organization").count()
    
    total_listings = db.query(FoodListing).count()
    active_listings = db.query(FoodListing).filter(FoodListing.status == "available").count()
    claimed_listings = db.query(FoodListing).filter(FoodListing.status == "claimed").count()
    completed_listings = db.query(FoodListing).filter(FoodListing.status == "completed").count()

    return {
        "total_users": total_users,
        "total_donors": total_donors,
        "total_organizations": total_organizations,
        "total_listings": total_listings,
        "active_listings": active_listings,
        "claimed_listings": claimed_listings,
        "completed_rescues": completed_listings
    }
