import os
import sys

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.listing import FoodListing
from app.core.security import get_password_hash, verify_password, create_access_token

def test_backend_components():
    print("1. Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("   [OK] Tables created successfully!")

    db = SessionLocal()
    try:
        print("2. Testing Password Hashing & JWT...")
        pwd = "testpassword123"
        hashed = get_password_hash(pwd)
        assert verify_password(pwd, hashed), "Password verification failed"
        token = create_access_token(subject=1)
        assert token, "Token creation failed"
        print("   [OK] Password hashing & JWT generation working perfectly!")

        print("3. Checking Database connectivity...")
        user_count = db.query(User).count()
        listing_count = db.query(FoodListing).count()
        print(f"   [OK] Database query success! Current Users: {user_count}, Listings: {listing_count}")

    finally:
        db.close()


if __name__ == "__main__":
    test_backend_components()
