from pymongo import ASCENDING, DESCENDING
from pymongo.database import Database

def init_indexes(db: Database):
    """
    Initializes all MongoDB collections with appropriate unique and compound indexes.
    """
    # 1. users
    db.users.create_index([("normalized_email", ASCENDING)], unique=True, sparse=True)
    db.users.create_index([("normalized_phone", ASCENDING)], unique=True, sparse=True)
    db.users.create_index([("roles", ASCENDING)])
    db.users.create_index([("account_status", ASCENDING)])

    # 2. worker_profiles
    db.worker_profiles.create_index([("user_id", ASCENDING)], unique=True)
    db.worker_profiles.create_index([("preferred_locality_ids", ASCENDING)])
    db.worker_profiles.create_index([("skills", ASCENDING)])

    # 3. employer_profiles
    db.employer_profiles.create_index([("owner_user_id", ASCENDING)], unique=True)
    db.employer_profiles.create_index([("locality_id", ASCENDING)])

    # 4. localities
    db.localities.create_index([("slug", ASCENDING)], unique=True)
    db.localities.create_index([("region", ASCENDING)])
    db.localities.create_index([("active", ASCENDING)])

    # 5. service_categories
    db.service_categories.create_index([("slug", ASCENDING)], unique=True)
    db.service_categories.create_index([("active", ASCENDING)])
    db.service_categories.create_index([("sort_order", ASCENDING)])

    # 6. service_listings
    db.service_listings.create_index([("worker_id", ASCENDING)])
    db.service_listings.create_index([("category_id", ASCENDING)])
    db.service_listings.create_index([("service_area_ids", ASCENDING)])
    db.service_listings.create_index([("status", ASCENDING)])
    db.service_listings.create_index([("moderation_status", ASCENDING)])
    db.service_listings.create_index([("published_at", DESCENDING)])

    # 7. bookings
    db.bookings.create_index([("booking_reference", ASCENDING)], unique=True)
    db.bookings.create_index([("customer_id", ASCENDING), ("created_at", DESCENDING)])
    db.bookings.create_index([("worker_id", ASCENDING), ("scheduled_start_at", ASCENDING)])
    db.bookings.create_index([("status", ASCENDING)])

    # 8. gigs
    db.gigs.create_index([("employer_id", ASCENDING)])
    db.gigs.create_index([("work_locality_id", ASCENDING)])
    db.gigs.create_index([("start_at", ASCENDING)])
    db.gigs.create_index([("status", ASCENDING)])
    db.gigs.create_index([("moderation_status", ASCENDING)])

    # 9. jobs
    db.jobs.create_index([("employer_id", ASCENDING)])
    db.jobs.create_index([("work_locality_id", ASCENDING)])
    db.jobs.create_index([("employment_type", ASCENDING)])
    db.jobs.create_index([("status", ASCENDING)])
    db.jobs.create_index([("moderation_status", ASCENDING)])

    # 10. applications (Strict compound unique: one application per worker per listing)
    db.applications.create_index([
        ("worker_id", ASCENDING),
        ("listing_type", ASCENDING),
        ("listing_id", ASCENDING)
    ], unique=True)
    db.applications.create_index([("employer_id", ASCENDING), ("status", ASCENDING)])
    db.applications.create_index([("applied_at", DESCENDING)])

    # 11. saved_listings (Strict compound unique: one saved entry per user per listing)
    db.saved_listings.create_index([
        ("user_id", ASCENDING),
        ("listing_type", ASCENDING),
        ("listing_id", ASCENDING)
    ], unique=True)

    # 12. reports
    db.reports.create_index([("target_type", ASCENDING), ("target_id", ASCENDING)])
    db.reports.create_index([("status", ASCENDING)])
    db.reports.create_index([("created_at", DESCENDING)])

    # 13. notifications
    db.notifications.create_index([("recipient_user_id", ASCENDING), ("read_at", ASCENDING)])
    db.notifications.create_index([("created_at", DESCENDING)])

    # 14. audit_logs
    db.audit_logs.create_index([("actor_user_id", ASCENDING)])
    db.audit_logs.create_index([("action", ASCENDING)])
    db.audit_logs.create_index([("created_at", DESCENDING)])

    # 15. reviews (if implemented)
    db.reviews.create_index([("booking_id", ASCENDING)], unique=True)
    db.reviews.create_index([("worker_id", ASCENDING), ("rating", DESCENDING)])
