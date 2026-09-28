from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, default="donor")  # donor, organization, admin
    organization_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)  # Admin verification status for Organizations
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    listings_created = relationship(
        "FoodListing",
        foreign_keys="FoodListing.donor_id",
        back_populates="donor",
        cascade="all, delete-orphan"
    )
    listings_claimed = relationship(
        "FoodListing",
        foreign_keys="FoodListing.claimed_by_org_id",
        back_populates="claimed_by_org"
    )
