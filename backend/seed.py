from datetime import datetime, timezone, timedelta
from app import create_app
from app.extensions import mongo
from app.database.indexes import init_indexes
from app.common.permissions import hash_password

def seed():
    app = create_app()
    with app.app_context():
        db = mongo.db
        print("Initializing indexes...")
        init_indexes(db)

        now = datetime.now(timezone.utc)
        demo_password = hash_password("DemoPassword123")

        # 1. Seed Mumbai Localities
        localities_data = [
            {"name": "Andheri", "slug": "andheri", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Bandra", "slug": "bandra", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Borivali", "slug": "borivali", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Dahisar", "slug": "dahisar", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Goregaon", "slug": "goregaon", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Malad", "slug": "malad", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Kandivali", "slug": "kandivali", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Kurla", "slug": "kurla", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Powai", "slug": "powai", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Ghatkopar", "slug": "ghatkopar", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Dadar", "slug": "dadar", "region": "South Central", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Thane", "slug": "thane", "region": "Thane Region", "city": "Thane", "state": "Maharashtra", "country": "India", "active": True},
            {"name": "Navi Mumbai", "slug": "navi-mumbai", "region": "Navi Mumbai Region", "city": "Navi Mumbai", "state": "Maharashtra", "country": "India", "active": True},
        ]
        locality_map = {}
        for loc in localities_data:
            existing = db.localities.find_one({"slug": loc["slug"]})
            if not existing:
                res = db.localities.insert_one(loc)
                locality_map[loc["slug"]] = res.inserted_id
            else:
                locality_map[loc["slug"]] = existing["_id"]
        print(f"Seeded {len(locality_map)} Mumbai localities.")

        # 2. Seed Service Categories
        categories_data = [
            {"name": "Home Cleaning", "slug": "home-cleaning", "description": "Deep cleaning, dusting, bathroom and kitchen sanitization", "sort_order": 1, "active": True, "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"},
            {"name": "Plumbing", "slug": "plumbing", "description": "Pipe repair, tap installations, leakage fixes and drain clearing", "sort_order": 2, "active": True, "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80"},
            {"name": "Electrical Work", "slug": "electrical-work", "description": "Wiring, switchboard fixes, fan fitting and appliance connections", "sort_order": 3, "active": True, "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"},
            {"name": "Appliance Repair", "slug": "appliance-repair", "description": "AC servicing, refrigerator fixing, washing machine maintenance", "sort_order": 4, "active": True, "image_url": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"},
            {"name": "Cooking Help", "slug": "cooking-help", "description": "Daily home cooking, regional Maharashtrian, North & South Indian meals", "sort_order": 5, "active": True, "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80"},
            {"name": "Beauty & Personal Care", "slug": "beauty-personal-care", "description": "Home salon, grooming, haircutting and waxing services", "sort_order": 6, "active": True, "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"},
            {"name": "Moving & Loading", "slug": "moving-loading", "description": "Furniture lifting, shifting help, carton packing and transit labor", "sort_order": 7, "active": True, "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80"},
            {"name": "Other Services", "slug": "other-services", "description": "Carpentry, painting, pest control and skilled handyman work", "sort_order": 8, "active": True, "image_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"},
        ]
        category_map = {}
        for cat in categories_data:
            existing = db.service_categories.find_one({"slug": cat["slug"]})
            if not existing:
                res = db.service_categories.insert_one(cat)
                category_map[cat["slug"]] = res.inserted_id
            else:
                category_map[cat["slug"]] = existing["_id"]
        print(f"Seeded {len(category_map)} service categories.")

        # 3. Seed Demo Users
        users_data = [
            {
                "name": "Ramesh Shinde",
                "email": "worker@demo.rozgaarsetu.in",
                "phone": "+919820011111",
                "roles": ["worker"],
                "headline": "Licensed Electrician & Certified Wiring Specialist",
                "bio": "Experienced electrician with 8+ years across Mumbai residential and commercial societies. Expertise in switchboards, MCB setups, wiring diagnostics, and inverter repairs.",
                "skills": ["Wiring", "MCB Repairs", "Appliance Fitting", "Inverter Setup", "Earthing"],
                "experience_years": 8.0,
                "localities": ["andheri", "bandra", "goregaon", "powai"],
                "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
            },
            {
                "name": "Sunita Kamble",
                "email": "worker2@demo.rozgaarsetu.in",
                "phone": "+919820022222",
                "roles": ["worker"],
                "headline": "Expert Deep Cleaning & Home Sanitization Professional",
                "bio": "Dedicated cleaning specialist with 5 years experience serving households in Powai, Ghatkopar, and Kurla. Trustworthy, meticulous, and experienced with eco-friendly cleaning agents.",
                "skills": ["Deep Cleaning", "Kitchen Sanitization", "Bathroom Scrubbing", "Sofa Shampooing"],
                "experience_years": 5.0,
                "localities": ["powai", "ghatkopar", "kurla", "dadar"],
                "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
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
                "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
            },
            {
                "name": "Vikram Sethi",
                "email": "employer@demo.rozgaarsetu.in",
                "phone": "+919820044444",
                "roles": ["employer"],
                "headline": "Operations Director at Apex Facility & Logistics Services",
                "bio": "Apex Logistics manages warehousing, retail fulfillment, and corporate event staff across Mumbai Metropolitan Region.",
                "skills": [],
                "experience_years": 12.0,
                "localities": ["andheri", "thane", "kurla"],
                "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
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
                    "created_at": now,
                    "updated_at": now,
                    "last_login_at": now
                }
                res = db.users.insert_one(u_doc)
                uid = res.inserted_id
            else:
                uid = existing["_id"]
            user_map[u["email"]] = uid

            # Worker profile
            if "worker" in u["roles"]:
                loc_oids = [locality_map[slug] for slug in u["localities"] if slug in locality_map]
                wp = db.worker_profiles.find_one({"user_id": uid})
                if not wp:
                    db.worker_profiles.insert_one({
                        "user_id": uid,
                        "headline": u["headline"],
                        "bio": u["bio"],
                        "profile_photo_url": u["photo"],
                        "preferred_locality_ids": [str(o) for o in loc_oids],
                        "work_preferences": ["services", "gigs", "jobs"],
                        "skills": u["skills"],
                        "experience_years": u["experience_years"],
                        "available_weekdays": ["mon", "tue", "wed", "thu", "fri", "sat"],
                        "preferred_shifts": ["morning", "afternoon"],
                        "profile_visibility": "public",
                        "completion_percentage": 95,
                        "created_at": now,
                        "updated_at": now
                    })

            # Employer profile
            if "employer" in u["roles"]:
                ep = db.employer_profiles.find_one({"owner_user_id": uid})
                if not ep:
                    db.employer_profiles.insert_one({
                        "owner_user_id": uid,
                        "name": "Apex Facility & Logistics Services",
                        "employer_type": "business",
                        "description": "Leading logistics and facility management enterprise operating across Mumbai, Navi Mumbai, and Thane.",
                        "logo_url": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
                        "contact_phone": u["phone"],
                        "contact_email": u["email"],
                        "website": "https://apexlogistics.example.com",
                        "locality_id": str(locality_map.get("andheri")),
                        "address": "Unit 402, Pinnacle Business Park, Andheri East, Mumbai",
                        "verification_status": "verified",
                        "account_status": "active",
                        "created_at": now,
                        "updated_at": now
                    })

        print("Seeded demo users & profiles.")

        # 4. Seed Service Listings
        ramesh_id = user_map["worker@demo.rozgaarsetu.in"]
        sunita_id = user_map["worker2@demo.rozgaarsetu.in"]

        service_listings = [
            {
                "worker_id": ramesh_id,
                "category_id": category_map["electrical-work"],
                "title": "Professional Electrical Wiring, Repair & Switchboard Installation",
                "description": "Certified electrician available for quick household and office visits. I diagnose tripping MCBs, install new switchboards, repair short circuits, and safely fit fans and lights.",
                "pricing": {"amount": 350.0, "currency": "INR", "unit": "visit", "minimum_charge": 350.0, "additional_notes": "Parts and replacement wires charged separately at MRP."},
                "service_area_ids": [locality_map["andheri"], locality_map["bandra"], locality_map["goregaon"], locality_map["powai"]],
                "available_days": ["mon", "tue", "wed", "thu", "fri", "sat"],
                "time_slots": ["09:00 - 13:00", "14:00 - 18:00"],
                "booking_lead_time_hours": 2,
                "image_urls": ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"],
                "status": "published",
                "moderation_status": "approved",
                "published_at": now - timedelta(days=5),
                "created_at": now - timedelta(days=5),
                "updated_at": now - timedelta(days=5)
            },
            {
                "worker_id": sunita_id,
                "category_id": category_map["home-cleaning"],
                "title": "Comprehensive Home Deep Cleaning & Kitchen Degreasing",
                "description": "Complete deep scrubbing for 1BHK, 2BHK and 3BHK flats. Includes chimney degreasing, bathroom tile descaling, floor scrubbing, and window track dusting using safe hygiene chemicals.",
                "pricing": {"amount": 800.0, "currency": "INR", "unit": "task", "minimum_charge": 800.0, "additional_notes": "Standard 2-3 hours visit. Supplies included."},
                "service_area_ids": [locality_map["powai"], locality_map["ghatkopar"], locality_map["kurla"], locality_map["dadar"]],
                "available_days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                "time_slots": ["08:00 - 12:00", "13:00 - 17:00"],
                "booking_lead_time_hours": 3,
                "image_urls": ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"],
                "status": "published",
                "moderation_status": "approved",
                "published_at": now - timedelta(days=4),
                "created_at": now - timedelta(days=4),
                "updated_at": now - timedelta(days=4)
            }
        ]

        service_ids = []
        for s in service_listings:
            existing = db.service_listings.find_one({"title": s["title"]})
            if not existing:
                res = db.service_listings.insert_one(s)
                service_ids.append(res.inserted_id)
            else:
                service_ids.append(existing["_id"])
        print(f"Seeded {len(service_ids)} service listings.")

        # 5. Seed Gigs
        employer_id = user_map["employer@demo.rozgaarsetu.in"]
        gigs_data = [
            {
                "employer_id": employer_id,
                "title": "Event Support & Guest Assistance Staff - BKC Trade Expo",
                "category_id": category_map["moving-loading"],
                "description": "Looking for energetic assistants to support venue setup, distribute visitor badges, manage queue flow, and assist stage crew during a 2-day business convention.",
                "responsibilities": ["Badge check-in at entrance", "Assisting delegates with directions", "Light stage equipment handling", "Maintaining presentation booth order"],
                "required_skills": ["Good communication", "Punctuality", "Teamwork"],
                "work_locality_id": locality_map["bandra"],
                "work_address_private": "Hall 3, MMRDA Grounds, Bandra-Kurla Complex, Mumbai",
                "shift_date": (now + timedelta(days=3)).strftime("%Y-%m-%d"),
                "start_time": "08:30 AM",
                "end_time": "05:30 PM",
                "is_overnight": False,
                "duration_hours": 9.0,
                "openings": 5,
                "initial_openings": 5,
                "pay_amount": 950.0,
                "currency": "INR",
                "pay_unit": "shift",
                "payment_conditions": "Same-day cash/UPI payout at conclusion of shift upon supervisor signoff.",
                "experience_requirements": "Fresher or experienced candidates welcome. Smart dress code required.",
                "application_deadline": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
                "status": "published",
                "moderation_status": "approved",
                "published_at": now - timedelta(days=2),
                "created_at": now - timedelta(days=2),
                "updated_at": now - timedelta(days=2)
            },
            {
                "employer_id": employer_id,
                "title": "Night Shift Warehouse Order Pickers & Sorters - Thane Depot",
                "category_id": category_map["moving-loading"],
                "description": "Night shift loading and picking crew required for e-commerce sorting center. Scanning parcel barcodes, carton stacking, and loading delivery dispatch vans.",
                "responsibilities": ["Scanning incoming parcels", "Stacking crates according to delivery pincode", "Loading light tempo vans safely"],
                "required_skills": ["Physical stamina", "Barcode scanner usage", "Basic reading"],
                "work_locality_id": locality_map["thane"],
                "work_address_private": "Gala 12, Kolshet Industrial Estate, Thane West",
                "shift_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
                "start_time": "10:00 PM",
                "end_time": "06:00 AM",
                "is_overnight": True,
                "duration_hours": 8.0,
                "openings": 8,
                "initial_openings": 8,
                "pay_amount": 800.0,
                "currency": "INR",
                "pay_unit": "shift",
                "payment_conditions": "Direct bank transfer next business morning.",
                "experience_requirements": "Previous logistics experience preferred.",
                "application_deadline": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
                "status": "published",
                "moderation_status": "approved",
                "published_at": now - timedelta(days=1),
                "created_at": now - timedelta(days=1),
                "updated_at": now - timedelta(days=1)
            }
        ]

        gig_ids = []
        for g in gigs_data:
            existing = db.gigs.find_one({"title": g["title"]})
            if not existing:
                res = db.gigs.insert_one(g)
                gig_ids.append(res.inserted_id)
            else:
                gig_ids.append(existing["_id"])
        print(f"Seeded {len(gig_ids)} gigs.")

        # 6. Seed Jobs
        jobs_data = [
            {
                "employer_id": employer_id,
                "title": "Full-Time Facility Maintenance Technician & Electrician",
                "category_id": category_map["electrical-work"],
                "description": "Apex Facility Services is hiring a permanent Maintenance Electrician for our Powai commercial technology center. Responsible for daily inspection of power backup, central UPS, lighting circuits, and coordinating routine HVAC maintenance.",
                "employment_type": "full_time",
                "responsibilities": ["Daily inspection of 3-phase switchboards and sub-panels", "Monitoring DG set operations during outages", "Executing preventive electrical maintenance audits", "Responding to tenant facility service tickets"],
                "required_skills": ["ITI Electrical Certification or Equivalent", "3-phase power distribution knowledge", "Safety protocol adherence"],
                "preferred_skills": ["HVAC basic troubleshooting", "Fire safety panel awareness"],
                "experience_requirements": "2-4 years in commercial buildings or industrial plants",
                "salary_min": 24000.0,
                "salary_max": 32000.0,
                "currency": "INR",
                "pay_period": "month",
                "benefits": ["PF & ESIC Coverage", "Annual Performance Bonus", "Health Insurance", "Overtime Allowance"],
                "work_locality_id": locality_map["powai"],
                "schedule": "Monday to Saturday, 9:00 AM to 6:00 PM (Rotational week off)",
                "application_deadline": (now + timedelta(days=20)).strftime("%Y-%m-%d"),
                "status": "published",
                "moderation_status": "approved",
                "published_at": now - timedelta(days=3),
                "created_at": now - timedelta(days=3),
                "updated_at": now - timedelta(days=3)
            },
            {
                "employer_id": employer_id,
                "title": "Dispatch Logistics Coordinator & Fleet Assistant",
                "category_id": category_map["moving-loading"],
                "description": "Join our fast-growing intra-city distribution operations in Andheri East. Oversee local van drivers, record daily dispatch sheets, handle delivery exceptions, and maintain warehouse inventory logs.",
                "employment_type": "full_time",
                "responsibilities": ["Route planning for delivery vans across Mumbai suburbs", "Driver attendance and trip sheet verification", "Handling damaged goods claims and re-dispatch", "Communicating delivery status to corporate clients"],
                "required_skills": ["Basic Excel & smartphone apps", "Good Mumbai geography knowledge", "Problem-solving"],
                "preferred_skills": ["Prior courier / 3PL experience"],
                "experience_requirements": "1-3 years in retail or warehouse dispatch",
                "salary_min": 20000.0,
                "salary_max": 26000.0,
                "currency": "INR",
                "pay_period": "month",
                "benefits": ["PF & Mediclaim", "Paid Leaves", "Mobile Phone Allowance"],
                "work_locality_id": locality_map["andheri"],
                "schedule": "Monday to Saturday, 10:00 AM to 7:00 PM",
                "application_deadline": (now + timedelta(days=15)).strftime("%Y-%m-%d"),
                "status": "published",
                "moderation_status": "approved",
                "published_at": now - timedelta(days=2),
                "created_at": now - timedelta(days=2),
                "updated_at": now - timedelta(days=2)
            }
        ]

        job_ids = []
        for j in jobs_data:
            existing = db.jobs.find_one({"title": j["title"]})
            if not existing:
                res = db.jobs.insert_one(j)
                job_ids.append(res.inserted_id)
            else:
                job_ids.append(existing["_id"])
        print(f"Seeded {len(job_ids)} jobs.")

        # 7. Seed Sample Booking
        pooja_id = user_map["customer@demo.rozgaarsetu.in"]
        bkg_existing = db.bookings.find_one({"customer_id": pooja_id})
        if not bkg_existing and service_ids:
            bkg_doc = {
                "booking_reference": "RS-BKG-20261011-DEMO1",
                "customer_id": pooja_id,
                "worker_id": ramesh_id,
                "service_listing_id": service_ids[0],
                "service_title_snapshot": "Professional Electrical Wiring, Repair & Switchboard Installation",
                "service_category_id_snapshot": category_map["electrical-work"],
                "pricing_snapshot": {
                    "base_amount": 350.0,
                    "currency": "INR",
                    "unit": "visit",
                    "estimated_hours": 1.0,
                    "estimated_total": 350.0
                },
                "scheduled_date": (now + timedelta(days=1)).strftime("%Y-%m-%d"),
                "scheduled_time_slot": "10:00 AM - 12:00 PM",
                "service_locality_id": locality_map["powai"],
                "service_address_private": "Flat 804, Lake View Heights, Hiranandani Gardens, Powai, Mumbai",
                "customer_instructions": "Main hall fan regulator is smoking and tripping MCB switch. Please carry a spare anchor switch.",
                "status": "requested",
                "status_history": [
                    {
                        "status": "requested",
                        "timestamp": now - timedelta(hours=2),
                        "actor_id": pooja_id,
                        "notes": "Booking request submitted by customer"
                    }
                ],
                "cancellation_reason": None,
                "created_at": now - timedelta(hours=2),
                "updated_at": now - timedelta(hours=2)
            }
            db.bookings.insert_one(bkg_doc)
            print("Seeded sample booking.")

        # 8. Seed Sample Application
        app_existing = db.applications.find_one({"worker_id": ramesh_id})
        if not app_existing and gig_ids:
            app_doc = {
                "worker_id": ramesh_id,
                "listing_type": "gig",
                "listing_id": gig_ids[0],
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
                "cover_note": "I am available on Saturday for full day event support at BKC. I have prior experience with convention hall setups.",
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
                "withdrawn_at": None
            }
            db.applications.insert_one(app_doc)
            print("Seeded sample gig application.")

        print("=== Database Seed Complete ===")

if __name__ == "__main__":
    seed()
