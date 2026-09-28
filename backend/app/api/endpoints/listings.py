from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.listing import FoodListing
from app.schemas.listing import ListingCreate, ListingResponse, ListingUpdate
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_in: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Donor creates a new surplus food listing."""
    if current_user.role not in ["donor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only food donors or admins can create food listings."
        )

    new_listing = FoodListing(
        donor_id=current_user.id,
        title=listing_in.title,
        food_type=listing_in.food_type,
        quantity=listing_in.quantity,
        preparation_time=listing_in.preparation_time,
        pickup_deadline=listing_in.pickup_deadline,
        location=listing_in.location,
        description=listing_in.description,
        status="available"
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

@router.get("/", response_model=List[ListingResponse])
def get_listings(
    status_filter: Optional[str] = Query(None, alias="status"),
    food_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve food listings. By default lists available food listings."""
    query = db.query(FoodListing)
    
    if status_filter:
        query = query.filter(FoodListing.status == status_filter)
    else:
        # Default to available listings for marketplace feed
        query = query.filter(FoodListing.status == "available")
        
    if food_type:
        query = query.filter(FoodListing.food_type.ilike(f"%{food_type}%"))
        
    listings = query.order_by(FoodListing.created_at.desc()).all()
    return listings

@router.get("/my-listings", response_model=List[ListingResponse])
def get_my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve listings related to the currently logged in user."""
    if current_user.role == "donor":
        listings = db.query(FoodListing).filter(FoodListing.donor_id == current_user.id).order_by(FoodListing.created_at.desc()).all()
    elif current_user.role == "organization":
        listings = db.query(FoodListing).filter(FoodListing.claimed_by_org_id == current_user.id).order_by(FoodListing.created_at.desc()).all()
    else:
        # Admin gets all listings
        listings = db.query(FoodListing).order_by(FoodListing.created_at.desc()).all()
        
    return listings

@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch details of a single food listing."""
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found.")
    return listing

@router.put("/{listing_id}/claim", response_model=ListingResponse)
def claim_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Organization claims an available surplus food listing."""
    if current_user.role not in ["organization", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only registered recipient organizations can claim food listings."
        )

    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found.")

    if listing.status != "available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This food listing is currently '{listing.status}' and cannot be claimed."
        )

    listing.status = "claimed"
    listing.claimed_by_org_id = current_user.id
    db.commit()
    db.refresh(listing)
    return listing

@router.put("/{listing_id}/status", response_model=ListingResponse)
def update_listing_status(
    listing_id: int,
    status_update: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update listing status (e.g. mark as completed or cancelled)."""
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found.")

    # Check permission (Donor creator, Claiming org, or Admin)
    is_donor = listing.donor_id == current_user.id
    is_claiming_org = listing.claimed_by_org_id == current_user.id
    is_admin = current_user.role == "admin"

    if not (is_donor or is_claiming_org or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this food listing."
        )

    if status_update.status:
        listing.status = status_update.status
    if status_update.title:
        listing.title = status_update.title
    if status_update.quantity:
        listing.quantity = status_update.quantity
    if status_update.description:
        listing.description = status_update.description

    db.commit()
    db.refresh(listing)
    return listing
