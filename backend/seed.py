from datetime import datetime, timezone, timedelta
from app import create_app
from app.extensions import mongo
from app.database.indexes import init_indexes
from app.common.permissions import hash_password
from app.database.image_registry import (
    get_worker_portrait_entry,
    get_worker_portrait_url,
    get_employer_logo_entry
)
from app.database.demo_seeder import seed_mumbai_demo_data

def seed():
    app = create_app()
    with app.app_context():
        db = mongo.db
        print("Initializing indexes...")
        init_indexes(db)

        now = datetime.now(timezone.utc)
        demo_password = hash_password("DemoPassword123")

        # 1. Seed Core Baseline Users (for automated test and demo logins)
        # Using strictly unique portraits from WORKER_PORTRAITS registry
        users_data = [
            {
                "name": "Ramesh Shinde",
                "email": "worker@demo.rozgaarsetu.in",
                "phone": "+919820011111",
                "roles": ["worker"],
                "headline": "Licensed Electrician & Certified Wiring Specialist",
                "bio": "Experienced electrician with 8+ years across Mumbai residential societies. [Demo Profile for testing]",
                "skills": ["Wiring", "MCB Repairs", "Appliance Fitting", "Inverter Setup", "Earthing"],
                "experience_years": 8.0,
                "localities": ["andheri", "bandra", "goregaon", "powai"],
                "photo": get_worker_portrait_url("worker@demo.rozgaarsetu.in")
            },
            {
                "name": "Sunita Kamble",
                "email": "worker2@demo.rozgaarsetu.in",
                "phone": "+919820022222",
                "roles": ["worker"],
                "headline": "Expert Deep Cleaning & Home Sanitization Professional",
                "bio": "Dedicated cleaning specialist serving Powai, Ghatkopar, and Kurla. [Demo Profile for testing]",
                "skills": ["Deep Cleaning", "Kitchen Sanitization", "Bathroom Scrubbing", "Sofa Shampooing"],
                "experience_years": 5.0,
                "localities": ["powai", "ghatkopar", "kurla", "dadar"],
                "photo": get_worker_portrait_url("worker2@demo.rozgaarsetu.in")
            },
            {
                "name": "Pooja Sharma",
                "email": "customer@demo.rozgaarsetu.in",
                "phone": "+919820033333",
                "roles": ["customer"],
                "headline": None,
                "bio": None,
                "skills": [],
                "experience_years": 0.0,
                "localities": ["powai"],
                "photo": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80"
            },
            {
                "name": "Vikram Sethi",
                "email": "employer@demo.rozgaarsetu.in",
                "phone": "+919820044444",
                "roles": ["employer"],
                "headline": "Operations Director at Apex Facility & Logistics Services",
                "bio": "Apex Logistics manages warehousing, retail fulfillment, and corporate event staff across Mumbai. [Demo Enterprise]",
                "skills": [],
                "experience_years": 12.0,
                "localities": ["andheri", "kurla", "bandra"],
                "photo": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80"
            },
            {
                "name": "Admin RozgaarSetu",
                "email": "admin@demo.rozgaarsetu.in",
                "phone": "+919820099999",
                "roles": ["admin"],
                "headline": "System Administrator",
                "bio": "RozgaarSetu platform administrator and trust & safety officer.",
                "skills": [],
                "experience_years": 0.0,
                "localities": [],
                "photo": None
            }
        ]

        user_map = {}
        for u in users_data:
            existing = db.users.find_one({"normalized_email": u["email"].lower()})
            if not existing:
                u_doc = {
                    "name": u["name"],
                    "email": u["email"],
                    "normalized_email": u["email"].lower(),
                    "phone": u["phone"],
                    "normalized_phone": u["phone"],
                    "password_hash": demo_password,
                    "roles": u["roles"],
                    "preferred_language": "en",
                    "account_status": "active",
                    "is_demo": True,
                    "created_at": now,
                    "updated_at": now,
                    "last_login_at": now
                }
                res = db.users.insert_one(u_doc)
                uid = res.inserted_id
            else:
                uid = existing["_id"]
                db.users.update_one({"_id": uid}, {"$set": {"is_demo": True, "updated_at": now}})
            user_map[u["email"]] = uid

            if "worker" in u["roles"]:
                p_entry = get_worker_portrait_entry(u["email"])
                wp = db.worker_profiles.find_one({"user_id": uid})
                wp_doc = {
                    "user_id": uid,
                    "headline": u["headline"],
                    "bio": u["bio"],
                    "profile_photo_url": p_entry["image_url"],
                    "photo_alt_text": p_entry["alt_text"],
                    "photo_source": p_entry["source"],
                    "photo_license": p_entry["license"],
                    "preferred_locality_ids": [],
                    "work_preferences": ["services", "gigs", "jobs"],
                    "skills": u["skills"],
                    "experience_years": u["experience_years"],
                    "available_weekdays": ["mon", "tue", "wed", "thu", "fri", "sat"],
                    "preferred_shifts": ["morning", "afternoon"],
                    "profile_visibility": "public",
                    "completion_percentage": 95,
                    "is_demo": True,
                    "updated_at": now
                }
                if not wp:
                    wp_doc["created_at"] = now
                    db.worker_profiles.insert_one(wp_doc)
                else:
                    db.worker_profiles.update_one({"_id": wp["_id"]}, {"$set": wp_doc})

            if "employer" in u["roles"]:
                ep = db.employer_profiles.find_one({"owner_user_id": uid})
                emp_logo_entry = get_employer_logo_entry(0)
                ep_doc = {
                    "owner_user_id": uid,
                    "name": "Apex Facility & Logistics Services (Demo)",
                    "employer_type": "business",
                    "description": "Leading logistics and facility management enterprise operating across Mumbai. [Demo Enterprise]",
                    "logo_url": emp_logo_entry["image_url"],
                    "logo_alt_text": emp_logo_entry["alt_text"],
                    "logo_source": emp_logo_entry["source"],
                    "logo_license": emp_logo_entry["license"],
                    "contact_phone": u["phone"],
                    "contact_email": u["email"],
                    "website": "https://apexlogistics.example.com",
                    "address": "Unit 402, Pinnacle Business Park, Andheri East, Mumbai",
                    "verification_status": "verified",
                    "account_status": "active",
                    "is_demo": True,
                    "updated_at": now
                }
                if not ep:
                    ep_doc["created_at"] = now
                    db.employer_profiles.insert_one(ep_doc)
                else:
                    db.employer_profiles.update_one({"_id": ep["_id"]}, {"$set": ep_doc})
        print(f"Verified core demo users & authentication baselines.")

        # 2. RUN COMPREHENSIVE MUMBAI DEMO DATA SEEDING
        report = seed_mumbai_demo_data(db)

        # 3. Seed Baseline Sample Booking & Application (if not already existing)
        pooja_id = user_map.get("customer@demo.rozgaarsetu.in")
        ramesh_id = user_map.get("worker@demo.rozgaarsetu.in")
        employer_id = user_map.get("employer@demo.rozgaarsetu.in")

        sample_svc = db.service_listings.find_one({"is_demo": True})
        if pooja_id and ramesh_id and sample_svc:
            bkg_existing = db.bookings.find_one({"customer_id": pooja_id})
            if not bkg_existing:
                bkg_doc = {
                    "booking_reference": "RS-BKG-20261011-DEMO1",
                    "customer_id": pooja_id,
                    "worker_id": ramesh_id,
                    "service_listing_id": sample_svc["_id"],
                    "service_title_snapshot": sample_svc["title"],
                    "service_category_id_snapshot": sample_svc["category_id"],
                    "pricing_snapshot": {
                        "base_amount": sample_svc["pricing"]["amount"],
                        "currency": "INR",
                        "unit": sample_svc["pricing"]["unit"],
                        "estimated_hours": 1.0,
                        "estimated_total": sample_svc["pricing"]["amount"]
                    },
                    "scheduled_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
                    "scheduled_time_slot": "10:00 AM - 12:00 PM",
                    "service_locality_id": sample_svc["service_area_ids"][0],
                    "service_address_private": "Flat 804, Lake View Heights, Powai, Mumbai",
                    "customer_instructions": "Initial diagnostic visit for residential electrical repair.",
                    "status": "requested",
                    "status_history": [
                        {
                            "status": "requested",
                            "timestamp": now - timedelta(hours=2),
                            "actor_id": pooja_id,
                            "notes": "Booking request submitted by customer"
                        }
                    ],
                    "is_demo": True,
                    "cancellation_reason": None,
                    "created_at": now - timedelta(hours=2),
                    "updated_at": now - timedelta(hours=2)
                }
                db.bookings.insert_one(bkg_doc)
                print("Seeded baseline sample booking.")

        sample_gig = db.gigs.find_one({"is_demo": True})
        if ramesh_id and employer_id and sample_gig:
            app_existing = db.applications.find_one({"worker_id": ramesh_id})
            if not app_existing:
                app_doc = {
                    "worker_id": ramesh_id,
                    "listing_type": "gig",
                    "listing_id": sample_gig["_id"],
                    "employer_id": employer_id,
                    "profile_snapshot": {
                        "name": "Ramesh Shinde",
                        "phone": "+919820011111",
                        "headline": "Licensed Electrician & Certified Wiring Specialist",
                        "bio": "Experienced electrician with 8+ years across Mumbai.",
                        "skills": ["Wiring", "MCB Repairs", "Appliance Fitting"],
                        "experience_years": 8.0,
                        "profile_photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    },
                    "cover_note": "I am available on Saturday for full day event support at BKC.",
                    "status": "applied",
                    "status_history": [
                        {
                            "status": "applied",
                            "timestamp": now - timedelta(hours=4),
                            "notes": "Application submitted by candidate"
                        }
                    ],
                    "employer_notes": None,
                    "applied_at": now - timedelta(hours=4),
                    "updated_at": now - timedelta(hours=4),
                    "is_demo": True,
                    "withdrawn_at": None
                }
                db.applications.insert_one(app_doc)
                print("Seeded baseline sample gig application.")

        print("\nAll database seeding steps executed successfully.")

if __name__ == "__main__":
    seed()
