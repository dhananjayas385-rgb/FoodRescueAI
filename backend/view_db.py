import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import SessionLocal
from app.models.user import User
from app.models.listing import FoodListing

def view_database():
    db = SessionLocal()
    try:
        print("\n=========================================")
        print("         REGISTERED USERS TABLE          ")
        print("=========================================")
        users = db.query(User).all()
        for u in users:
            verified_str = "Verified" if u.is_verified else "Pending"
            print(f"ID {u.id} | [{u.role.upper()}] {u.full_name} ({u.email}) | Org: {u.organization_name or 'N/A'} | Status: {verified_str}")

        print("\n=========================================")
        print("        FOOD SURPLUS LISTINGS TABLE       ")
        print("=========================================")
        listings = db.query(FoodListing).all()
        if not listings:
            print("No food listings saved yet.")
        for l in listings:
            claimed_by = f"Claimed by Org ID {l.claimed_by_org_id}" if l.claimed_by_org_id else "Unclaimed"
            print(f"ID {l.id} | [{l.status.upper()}] '{l.title}' | Qty: {l.quantity} | Donor ID: {l.donor_id} | {claimed_by}")
        print("=========================================\n")

    finally:
        db.close()

if __name__ == "__main__":
    view_database()
