import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.listing import FoodListing
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Admin Account
        admin = db.query(User).filter(User.email == "admin@foodrescue.ai").first()
        if not admin:
            admin = User(
                email="admin@foodrescue.ai",
                hashed_password=get_password_hash("admin123"),
                full_name="Platform Admin",
                role="admin",
                organization_name="FoodRescue AI HQ",
                is_verified=True
            )
            db.add(admin)

        # 2. Donor Account
        donor = db.query(User).filter(User.email == "donor@restaurant.com").first()
        if not donor:
            donor = User(
                email="donor@restaurant.com",
                hashed_password=get_password_hash("donor123"),
                full_name="Chef Marco Rossi",
                role="donor",
                organization_name="Grand Plaza Bistro",
                phone="+1 555-0192",
                address="742 Evergreen Terrace",
                is_verified=True
            )
            db.add(donor)

        # 3. Organization Account
        org = db.query(User).filter(User.email == "shelter@ngo.org").first()
        if not org:
            org = User(
                email="shelter@ngo.org",
                hashed_password=get_password_hash("org123"),
                full_name="Sarah Jenkins",
                role="organization",
                organization_name="Hope Haven Shelter",
                phone="+1 555-0144",
                address="108 Ocean Drive",
                is_verified=True
            )
            db.add(org)

        db.commit()

        # Refresh objects
        db.refresh(donor)

        # Add sample listings if empty
        if db.query(FoodListing).count() == 0:
            sample1 = FoodListing(
                donor_id=donor.id,
                title="40 Servings of Fresh Catered Buffet Meals",
                food_type="Cooked Meal",
                quantity="40 meals (20 kg)",
                preparation_time="Today 1:30 PM",
                pickup_deadline="Today 9:00 PM",
                location="742 Evergreen Terrace, Loading Dock B",
                description="Vegetarian and chicken rice bowls from lunch catering. Packed in sealed thermal containers.",
                status="available"
            )

            sample2 = FoodListing(
                donor_id=donor.id,
                title="Fresh Artisan Bakery & Croissants",
                food_type="Bakery",
                quantity="15 boxes",
                preparation_time="Today 6:00 AM",
                pickup_deadline="Tomorrow 10:00 AM",
                location="742 Evergreen Terrace",
                description="Assorted sourdough loaves, croissants, and fruit pastries baked fresh this morning.",
                status="available"
            )

            db.add(sample1)
            db.add(sample2)
            db.commit()

        print("[OK] Database seeded successfully with demo accounts and sample listings!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
