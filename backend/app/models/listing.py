from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class FoodListing(Base):
    __tablename__ = "food_listings"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    food_type = Column(String, nullable=False)  # e.g., Cooked Meal, Bakery, Produce, Packaged
    quantity = Column(String, nullable=False)   # e.g., '10 kg', '30 meals'
    preparation_time = Column(String, nullable=False)
    pickup_deadline = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="available", nullable=False)  # available, claimed, completed, cancelled
    claimed_by_org_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    donor = relationship("User", foreign_keys=[donor_id], back_populates="listings_created")
    claimed_by_org = relationship("User", foreign_keys=[claimed_by_org_id], back_populates="listings_claimed")
