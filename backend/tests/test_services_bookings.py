from app.extensions import mongo

def test_service_creation_and_discovery(client):
    # Register worker
    w_reg = client.post("/api/v1/auth/register", json={
        "name": "Ramesh Shinde", "email": "ramesh@test.com", "password": "Pass123!4", "role": "worker"
    })
    w_token = w_reg.get_json()["data"]["token"]
    w_headers = {"Authorization": f"Bearer {w_token}"}

    # Fetch locality & category
    loc = mongo.db.localities.find_one({"slug": "powai"})
    cat = mongo.db.service_categories.find_one({"slug": "electrical-work"})

    # Create service listing
    res = client.post("/api/v1/services", json={
        "category_id": str(cat["_id"]),
        "title": "Complete House Wiring & Switchboard Repair",
        "description": "Expert electrical repairs and switchboard fitting across Mumbai.",
        "pricing": {
            "amount": 400.0,
            "currency": "INR",
            "unit": "visit"
        },
        "service_area_ids": [str(loc["_id"])],
        "available_days": ["mon", "tue", "wed"],
        "publish_now": True
    }, headers=w_headers)
    assert res.status_code == 201
    service_id = res.get_json()["data"]["id"]

    # Discover service publicly
    disc = client.get(f"/api/v1/services?locality={str(loc['_id'])}")
    assert disc.status_code == 200
    items = disc.get_json()["data"]
    assert len(items) == 1
    assert items[0]["title"] == "Complete House Wiring & Switchboard Repair"
    assert items[0]["pricing"]["amount"] == 400.0

def test_booking_workflow_and_concurrency(client):
    # Register worker & customer
    w_res = client.post("/api/v1/auth/register", json={
        "name": "Ganesh Rao", "email": "ganesh@test.com", "password": "Pass123!4", "role": "worker"
    })
    w_token = w_res.get_json()["data"]["token"]
    w_headers = {"Authorization": f"Bearer {w_token}"}

    c_res = client.post("/api/v1/auth/register", json={
        "name": "Sneha K", "email": "sneha@test.com", "password": "Pass123!4", "role": "customer"
    })
    c_token = c_res.get_json()["data"]["token"]
    c_headers = {"Authorization": f"Bearer {c_token}"}

    # Create service
    loc = mongo.db.localities.find_one({"slug": "powai"})
    cat = mongo.db.service_categories.find_one({"slug": "home-cleaning"})
    srv = client.post("/api/v1/services", json={
        "category_id": str(cat["_id"]),
        "title": "Kitchen Sanitization & Deep Cleaning",
        "description": "Deep kitchen sanitization including chimney and tiles.",
        "pricing": {"amount": 750.0, "currency": "INR", "unit": "task"},
        "service_area_ids": [str(loc["_id"])],
        "publish_now": True
    }, headers=w_headers).get_json()["data"]

    # Customer books slot
    bkg_res = client.post("/api/v1/bookings", json={
        "service_listing_id": srv["id"],
        "scheduled_date": "2026-10-25",
        "scheduled_time_slot": "10:00 AM - 12:00 PM",
        "service_locality_id": str(loc["_id"]),
        "service_address": "Flat 302, Green Woods, Central Avenue, Powai",
        "customer_instructions": "Please bring safe child-friendly cleaning solutions."
    }, headers=c_headers)
    assert bkg_res.status_code == 201
    booking = bkg_res.get_json()["data"]
    assert booking["status"] == "requested"
    assert booking["booking_reference"].startswith("RS-BKG-")

    # Worker accepts booking
    accept_res = client.post(f"/api/v1/bookings/{booking['id']}/accept", json={}, headers=w_headers)
    assert accept_res.status_code == 200
    assert accept_res.get_json()["data"]["status"] == "confirmed"

    # Conflicting booking attempt on same slot must be rejected
    c2_res = client.post("/api/v1/auth/register", json={
        "name": "Rahul M", "email": "rahul@test.com", "password": "Pass123!4", "role": "customer"
    })
    c2_token = c2_res.get_json()["data"]["token"]
    conflict_res = client.post("/api/v1/bookings", json={
        "service_listing_id": srv["id"],
        "scheduled_date": "2026-10-25",
        "scheduled_time_slot": "10:00 AM - 12:00 PM",
        "service_locality_id": str(loc["_id"]),
        "service_address": "Flat 101, Lake Palace, Powai"
    }, headers={"Authorization": f"Bearer {c2_token}"})
    assert conflict_res.status_code == 409
    assert conflict_res.get_json()["success"] is False

    # Worker starts and completes booking
    start_res = client.post(f"/api/v1/bookings/{booking['id']}/start", json={}, headers=w_headers)
    assert start_res.status_code == 200
    assert start_res.get_json()["data"]["status"] == "in_progress"

    complete_res = client.post(f"/api/v1/bookings/{booking['id']}/complete", json={}, headers=w_headers)
    assert complete_res.status_code == 200
    assert complete_res.get_json()["data"]["status"] == "completed"
