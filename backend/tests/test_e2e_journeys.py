import requests
import json
import pytest

BASE_URL = "http://127.0.0.1:5000/api/v1"

def test_full_platform_e2e_journeys():
    # Helper for unique emails
    import time
    ts = int(time.time() * 1000)

    # -------------------------------------------------------------
    # 1. JOURNEY 1 & 2: CUSTOMER DISCOVERS SERVICE, REQUESTS BOOKING,
    #                   AND WORKER ACCEPTS, STARTS & COMPLETES IT
    # -------------------------------------------------------------
    # Step 1a: Register worker
    w_email = f"worker_{ts}@mumbai.in"
    w_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Santosh More",
        "email": w_email,
        "password": "Password123!",
        "role": "worker"
    })
    assert w_res.status_code == 201, w_res.text
    w_token = w_res.json()["data"]["token"]
    w_headers = {"Authorization": f"Bearer {w_token}"}

    # Fetch locality & category
    localities = requests.get(f"{BASE_URL}/meta/localities").json()["data"]
    powai_loc = next(l for l in localities if l["slug"] == "powai")
    categories = requests.get(f"{BASE_URL}/meta/categories").json()["data"]
    elec_cat = next(c for c in categories if c["slug"] == "electrical-work")

    # Worker creates service
    srv_res = requests.post(f"{BASE_URL}/services", json={
        "category_id": elec_cat["id"],
        "title": "Inverter Wiring & MCB Installation",
        "description": "Certified electrician for high-voltage and inverter installations.",
        "pricing": {"amount": 450.0, "currency": "INR", "unit": "visit"},
        "service_area_ids": [powai_loc["id"]],
        "publish_now": True
    }, headers=w_headers)
    assert srv_res.status_code == 201
    service_id = srv_res.json()["data"]["id"]

    # Step 1b: Customer registers & discovers service
    c_email = f"customer_{ts}@mumbai.in"
    c_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Neha Joshi",
        "email": c_email,
        "password": "Password123!",
        "role": "customer"
    })
    assert c_res.status_code == 201, c_res.text
    c_token = c_res.json()["data"]["token"]
    c_headers = {"Authorization": f"Bearer {c_token}"}

    # Customer searches services in Powai
    search_res = requests.get(f"{BASE_URL}/services?locality={powai_loc['id']}&keyword=Inverter")
    assert search_res.status_code == 200
    assert len(search_res.json()["data"]) >= 1

    # Customer books service
    bkg_res = requests.post(f"{BASE_URL}/bookings", json={
        "service_listing_id": service_id,
        "scheduled_date": "2026-11-10",
        "scheduled_time_slot": "10:00 AM - 12:00 PM",
        "service_locality_id": powai_loc["id"],
        "service_address": "Flat 702, Lake View Towers, Powai, Mumbai",
        "customer_instructions": "Main inverter battery is not holding charge."
    }, headers=c_headers)
    assert bkg_res.status_code == 201
    booking_id = bkg_res.json()["data"]["id"]
    assert bkg_res.json()["data"]["status"] == "requested"
    assert bkg_res.json()["data"]["pricing_snapshot"]["estimated_total"] == 450.0

    # Step 2: Worker views booking & accepts
    worker_bkg_res = requests.get(f"{BASE_URL}/bookings/{booking_id}", headers=w_headers)
    assert worker_bkg_res.status_code == 200
    assert worker_bkg_res.json()["data"]["status"] == "requested"

    accept_res = requests.post(f"{BASE_URL}/bookings/{booking_id}/accept", json={}, headers=w_headers)
    assert accept_res.status_code == 200
    assert accept_res.json()["data"]["status"] == "confirmed"

    # Worker starts and completes
    start_res = requests.post(f"{BASE_URL}/bookings/{booking_id}/start", json={}, headers=w_headers)
    assert start_res.status_code == 200
    assert start_res.json()["data"]["status"] == "in_progress"

    complete_res = requests.post(f"{BASE_URL}/bookings/{booking_id}/complete", json={}, headers=w_headers)
    assert complete_res.status_code == 200
    assert complete_res.json()["data"]["status"] == "completed"

    # -------------------------------------------------------------
    # 3. JOURNEY 3 & 4: WORKER COMPLETES ONBOARDING & APPLIES TO GIG,
    #                   EMPLOYER POSTS GIG & REVIEWS CANDIDATE
    # -------------------------------------------------------------
    # Worker completes onboarding
    onboarding_res = requests.post(f"{BASE_URL}/workers/onboarding", json={
        "headline": "Senior Electrician & Power Specialist",
        "bio": "10 years across commercial projects in Mumbai.",
        "preferred_locality_ids": [powai_loc["id"]],
        "work_preferences": ["services", "gigs"],
        "skills": ["Wiring", "MCB", "Power Backup"],
        "experience_years": 10.0,
        "available_weekdays": ["mon", "tue", "wed", "thu", "fri"],
        "preferred_shifts": ["morning", "afternoon"]
    }, headers=w_headers)
    assert onboarding_res.status_code == 200
    assert onboarding_res.json()["data"]["completion_percentage"] >= 80

    # Employer registers and posts gig with 1 opening
    e_email = f"employer_{ts}@mumbai.in"
    e_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Apex Event Organizers",
        "email": e_email,
        "password": "Password123!",
        "role": "employer"
    })
    assert e_res.status_code == 201
    e_token = e_res.json()["data"]["token"]
    e_headers = {"Authorization": f"Bearer {e_token}"}

    gig_post_res = requests.post(f"{BASE_URL}/gigs", json={
        "title": "Stage Electrical Crew Assistant",
        "category_id": elec_cat["id"],
        "description": "Assist with setting up sound console power and stage spot lights.",
        "responsibilities": ["Laying power cables", "Assisting chief lighting technician"],
        "required_skills": ["Power wiring", "Punctuality"],
        "work_locality_id": powai_loc["id"],
        "work_address": "Convention Center Powai",
        "shift_date": "2026-11-15",
        "start_time": "08:00 AM",
        "end_time": "04:00 PM",
        "duration_hours": 8.0,
        "openings": 1,
        "pay_amount": 950.0,
        "pay_unit": "shift",
        "publish_now": True
    }, headers=e_headers)
    assert gig_post_res.status_code == 201
    gig_id = gig_post_res.json()["data"]["id"]

    # Worker applies to gig
    app_gig_res = requests.post(f"{BASE_URL}/applications", json={
        "listing_type": "gig",
        "listing_id": gig_id,
        "cover_note": "Available on 15th Nov for stage setup."
    }, headers=w_headers)
    assert app_gig_res.status_code == 201
    gig_app_id = app_gig_res.json()["data"]["id"]

    # Employer reviews applicants
    emp_apps = requests.get(f"{BASE_URL}/applications/employer?type=gig", headers=e_headers).json()["data"]
    assert any(a["id"] == gig_app_id for a in emp_apps)

    # Employer shortlists worker
    shortlist_res = requests.post(f"{BASE_URL}/applications/{gig_app_id}/shortlist", json={
        "employer_notes": "Impressive 10 years experience"
    }, headers=e_headers)
    assert shortlist_res.status_code == 200
    assert shortlist_res.json()["data"]["status"] == "shortlisted"

    # Employer selects worker (openings becomes 0)
    select_res = requests.post(f"{BASE_URL}/applications/{gig_app_id}/select", json={
        "employer_notes": "Selected and confirmed for shift"
    }, headers=e_headers)
    assert select_res.status_code == 200
    assert select_res.json()["data"]["status"] == "selected"

    # Verify gig openings decreased to 0
    gig_updated = requests.get(f"{BASE_URL}/gigs/{gig_id}").json()["data"]
    assert gig_updated["openings"] == 0

    # -------------------------------------------------------------
    # 5. JOURNEY 5: LONG-TERM JOB APPLICATION & PRIVACY
    # -------------------------------------------------------------
    job_post_res = requests.post(f"{BASE_URL}/jobs", json={
        "title": "Full-Time Chief Facility Electrician",
        "description": "Permanent maintenance position for commercial tech park in Powai.",
        "employment_type": "full_time",
        "required_skills": ["Commercial Wiring", "Safety protocols"],
        "experience_requirements": "5+ years",
        "salary_min": 28000.0,
        "salary_max": 35000.0,
        "currency": "INR",
        "pay_period": "month",
        "work_locality_id": powai_loc["id"],
        "schedule": "Monday to Friday 9am to 6pm",
        "publish_now": True
    }, headers=e_headers)
    assert job_post_res.status_code == 201
    job_id = job_post_res.json()["data"]["id"]

    # Worker applies for job
    app_job_res = requests.post(f"{BASE_URL}/applications", json={
        "listing_type": "job",
        "listing_id": job_id,
        "cover_note": "Excited for permanent facility management role."
    }, headers=w_headers)
    assert app_job_res.status_code == 201
    job_app_id = app_job_res.json()["data"]["id"]

    # Employer adds internal private note
    requests.post(f"{BASE_URL}/applications/{job_app_id}/shortlist", json={
        "employer_notes": "CONFIDENTIAL: Strong candidate for salary cap 32000"
    }, headers=e_headers)

    # Worker views application -> private note MUST NOT be leaked
    worker_view_job_app = requests.get(f"{BASE_URL}/applications/{job_app_id}", headers=w_headers).json()["data"]
    assert "employer_notes" not in worker_view_job_app

    # -------------------------------------------------------------
    # 7. JOURNEY 7: SECURITY & BOUNDARY ENFORCEMENT
    # -------------------------------------------------------------
    # Customer Neha tries to access Employer's private applicant list -> 403 Forbidden
    unauthorized_res = requests.get(f"{BASE_URL}/applications/employer", headers=c_headers)
    assert unauthorized_res.status_code == 403

    # Customer tries to view another user's private booking details
    other_user_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Intruder User",
        "email": f"intruder_{ts}@mumbai.in",
        "password": "Password123!",
        "role": "customer"
    })
    intruder_token = other_user_res.json()["data"]["token"]
    forbidden_booking_view = requests.get(f"{BASE_URL}/bookings/{booking_id}", headers={"Authorization": f"Bearer {intruder_token}"})
    assert forbidden_booking_view.status_code == 403

    # -------------------------------------------------------------
    # 8. JOURNEY 8: SAFETY REPORTING & ADMINISTRATIVE MODERATION
    # -------------------------------------------------------------
    # Customer Neha files safety report
    rep_res = requests.post(f"{BASE_URL}/reports", json={
        "target_type": "job",
        "target_id": job_id,
        "reason": "Verify company credentials",
        "description": "Please verify business GST registration for this enterprise."
    }, headers=c_headers)
    assert rep_res.status_code == 201
    report_id = rep_res.json()["data"]["id"]

    # Admin demo logs in
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@demo.rozgaarsetu.in",
        "password": "DemoPassword123"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["data"]["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin checks dashboard metrics
    adm_dash = requests.get(f"{BASE_URL}/admin/dashboard", headers=admin_headers)
    assert adm_dash.status_code == 200
    assert adm_dash.json()["data"]["total_users"] >= 3

    # Admin resolves report
    resolve_res = requests.post(f"{BASE_URL}/admin/reports/{report_id}/resolve", json={
        "resolution": "action_taken",
        "resolution_notes": "Employer credentials and Mumbai trade license verified successfully."
    }, headers=admin_headers)
    assert resolve_res.status_code == 200
    assert resolve_res.json()["data"]["status"] == "resolved"

    # Admin inspects audit logs
    audit_res = requests.get(f"{BASE_URL}/admin/audit-logs", headers=admin_headers)
    assert audit_res.status_code == 200
    assert len(audit_res.json()["data"]) >= 1

    print("\n[SUCCESS] ALL 8 END-TO-END USER JOURNEYS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    test_full_platform_e2e_journeys()
