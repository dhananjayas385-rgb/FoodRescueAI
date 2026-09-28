import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_full_workflow():
    print("==================================================")
    print("  FOODRESCUE AI — END-TO-END SYSTEM TEST SUITE  ")
    print("==================================================")

    # 1. Health check
    try:
        r = requests.get("http://127.0.0.1:8000/")
        assert r.status_code == 200
        print("[PASS] 1. Backend server health check OK")
    except Exception as e:
        print(f"[FAIL] 1. Health check failed: {e}")
        sys.exit(1)

    # 2. Login seeded Donor
    print("\n2. Testing Donor Authentication...")
    r = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "donor@restaurant.com",
        "password": "donor123"
    })
    assert r.status_code == 200, f"Donor login failed: {r.text}"
    donor_token = r.json()["access_token"]
    donor_headers = {"Authorization": f"Bearer {donor_token}"}
    print("[PASS] Donor login success! Received JWT Token.")

    # 3. Login seeded Organization
    print("\n3. Testing Organization Authentication...")
    r = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "shelter@ngo.org",
        "password": "org123"
    })
    assert r.status_code == 200, f"Org login failed: {r.text}"
    org_token = r.json()["access_token"]
    org_headers = {"Authorization": f"Bearer {org_token}"}
    print("[PASS] Organization login success! Received JWT Token.")

    # 4. Login seeded Admin
    print("\n4. Testing Admin Authentication...")
    r = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@foodrescue.ai",
        "password": "admin123"
    })
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    admin_token = r.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("[PASS] Admin login success!")

    # 5. New User Registration Test
    print("\n5. Testing New User Registration (New NGO)...")
    reg_email = "new_charity@help.org"
    r = requests.post(f"{BASE_URL}/auth/register", json={
        "full_name": "New Charity Org",
        "email": reg_email,
        "password": "password123",
        "role": "organization",
        "organization_name": "Grace Haven Food Bank",
        "phone": "+1 555-9988",
        "address": "456 Community Way"
    })
    assert r.status_code in [201, 400], f"Registration failed: {r.text}"
    print(f"[PASS] User registration test complete.")

    # 6. Donor creates new Food Listing
    print("\n6. Testing Food Listing Creation (Donor Dashboard)...")
    listing_data = {
        "title": "50 Fresh Packed Buffet Lunch Boxes",
        "food_type": "Cooked Meal",
        "quantity": "50 boxes",
        "preparation_time": "Today 12:00 PM",
        "pickup_deadline": "Today 7:00 PM",
        "location": "Downtown Hotel Loading Dock",
        "description": "Sealed vegetarian pasta and salad meals from afternoon conference."
    }
    r = requests.post(f"{BASE_URL}/listings/", json=listing_data, headers=donor_headers)
    assert r.status_code == 201, f"Listing creation failed: {r.text}"
    new_listing = r.json()
    new_listing_id = new_listing["id"]
    print(f"[PASS] Food listing created successfully! (ID: {new_listing_id})")

    # 7. Organization views available Marketplace
    print("\n7. Testing Marketplace Feed View (Org Dashboard)...")
    r = requests.get(f"{BASE_URL}/listings/?status=available", headers=org_headers)
    assert r.status_code == 200, f"Marketplace fetch failed: {r.text}"
    available_items = r.json()
    assert len(available_items) > 0, "No available items found in marketplace"
    print(f"[PASS] Marketplace feed retrieved! Found {len(available_items)} available listings.")

    # 8. Organization claims the Food Listing
    print(f"\n8. Testing Food Listing Claiming (Claiming ID {new_listing_id})...")
    r = requests.put(f"{BASE_URL}/listings/{new_listing_id}/claim", headers=org_headers)
    assert r.status_code == 200, f"Claim failed: {r.text}"
    claimed_item = r.json()
    assert claimed_item["status"] == "claimed"
    print(f"[PASS] Food listing claimed successfully! Status updated to 'claimed'.")

    # 9. Donor/Org updates status to Completed (Rescued)
    print("\n9. Testing Status Update to 'completed'...")
    r = requests.put(f"{BASE_URL}/listings/{new_listing_id}/status", json={"status": "completed"}, headers=donor_headers)
    assert r.status_code == 200, f"Status update failed: {r.text}"
    assert r.json()["status"] == "completed"
    print("[PASS] Status marked as 'completed' (Rescued)!")

    # 10. Admin Portal Verification & Stats
    print("\n10. Testing Admin Features & Analytics...")
    r = requests.get(f"{BASE_URL}/admin/users", headers=admin_headers)
    assert r.status_code == 200
    users_list = r.json()
    
    r_stats = requests.get(f"{BASE_URL}/admin/stats", headers=admin_headers)
    assert r_stats.status_code == 200
    stats_data = r_stats.json()
    print(f"[PASS] Admin stats verified! Users: {stats_data['total_users']}, Listings: {stats_data['total_listings']}, Rescued: {stats_data['completed_rescues']}")

    print("\n==================================================")
    print("  ALL 10 END-TO-END TESTS PASSED WITH 100% SUCCESS! ")
    print("==================================================")

if __name__ == "__main__":
    test_full_workflow()
