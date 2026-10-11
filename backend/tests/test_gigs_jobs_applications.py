from app.extensions import mongo

def test_gig_posting_and_application_workflow(client):
    # Register employer
    e_res = client.post("/api/v1/auth/register", json={
        "name": "QuickHire Logistics", "email": "employer@logistics.com", "password": "Pass123!4", "role": "employer"
    })
    e_token = e_res.get_json()["data"]["token"]
    e_headers = {"Authorization": f"Bearer {e_token}"}

    # Register worker
    w_res = client.post("/api/v1/auth/register", json={
        "name": "Kiran Salve", "email": "kiran@worker.com", "password": "Pass123!4", "role": "worker"
    })
    w_token = w_res.get_json()["data"]["token"]
    w_headers = {"Authorization": f"Bearer {w_token}"}

    loc = mongo.db.localities.find_one({"slug": "bandra"})
    cat = mongo.db.service_categories.find_one({"slug": "electrical-work"})

    # Post a Gig
    gig_res = client.post("/api/v1/gigs", json={
        "title": "Exhibition Stage Lighting Assistants",
        "category_id": str(cat["_id"]),
        "description": "Assist with temporary cable layout and spotlight positioning.",
        "responsibilities": ["Laying rubber cable mats", "Mounting stage lights"],
        "required_skills": ["Physical fitness", "Punctuality"],
        "work_locality_id": str(loc["_id"]),
        "work_address": "Hall 2, MMRDA Grounds, BKC, Bandra",
        "shift_date": "2026-11-05",
        "start_time": "09:00 AM",
        "end_time": "05:00 PM",
        "duration_hours": 8.0,
        "openings": 1,
        "pay_amount": 900.0,
        "pay_unit": "shift",
        "publish_now": True
    }, headers=e_headers)
    assert gig_res.status_code == 201
    gig_id = gig_res.get_json()["data"]["id"]

    # Worker applies
    app_res = client.post("/api/v1/applications", json={
        "listing_type": "gig",
        "listing_id": gig_id,
        "cover_note": "Experienced with event setups and available for full shift."
    }, headers=w_headers)
    assert app_res.status_code == 201
    app_id = app_res.get_json()["data"]["id"]

    # Duplicate application attempt must fail
    dup_res = client.post("/api/v1/applications", json={
        "listing_type": "gig",
        "listing_id": gig_id,
        "cover_note": "Applying again"
    }, headers=w_headers)
    assert dup_res.status_code == 409

    # Employer reviews and shortlists candidate
    shortlist_res = client.post(f"/api/v1/applications/{app_id}/shortlist", json={
        "employer_notes": "Good profile with BKC experience"
    }, headers=e_headers)
    assert shortlist_res.status_code == 200
    assert shortlist_res.get_json()["data"]["status"] == "shortlisted"

    # Worker viewing application should NOT see employer_notes
    worker_view = client.get(f"/api/v1/applications/{app_id}", headers=w_headers)
    assert worker_view.status_code == 200
    assert "employer_notes" not in worker_view.get_json()["data"]

    # Employer selects candidate (decrementing opening count to 0)
    select_res = client.post(f"/api/v1/applications/{app_id}/select", json={
        "employer_notes": "Confirmed for shift"
    }, headers=e_headers)
    assert select_res.status_code == 200
    assert select_res.get_json()["data"]["status"] == "selected"

    # Verify openings became 0
    updated_gig = mongo.db.gigs.find_one({"_id": mongo.db.applications.find_one({"_id": mongo.db.applications.find_one()["_id"]})["listing_id"]})
    assert updated_gig["openings"] == 0

def test_job_posting_and_applicant_filtering(client):
    e_res = client.post("/api/v1/auth/register", json={
        "name": "Metro Retailers", "email": "metro@retail.com", "password": "Pass123!4", "role": "employer"
    })
    e_token = e_res.get_json()["data"]["token"]
    e_headers = {"Authorization": f"Bearer {e_token}"}

    loc = mongo.db.localities.find_one({"slug": "powai"})

    # Post Job
    job_res = client.post("/api/v1/jobs", json={
        "title": "Inventory Store Associate",
        "description": "Manage supermarket warehouse intake and stock rotation.",
        "employment_type": "full_time",
        "required_skills": ["Stock counting", "Basic computer"],
        "experience_requirements": "1 year in retail stock room",
        "salary_min": 18000.0,
        "salary_max": 22000.0,
        "currency": "INR",
        "pay_period": "month",
        "work_locality_id": str(loc["_id"]),
        "schedule": "6 days a week, 9am to 6pm",
        "publish_now": True
    }, headers=e_headers)
    assert job_res.status_code == 201

    # List jobs publicly with filters
    jobs = client.get(f"/api/v1/jobs?locality={str(loc['_id'])}&employment_type=full_time")
    assert jobs.status_code == 200
    assert len(jobs.get_json()["data"]) == 1
    assert jobs.get_json()["data"][0]["title"] == "Inventory Store Associate"
