"""
Automated Pytest Suite for RozgaarSetu Realistic Indian Image System.
Verifies worker portrait 1:1 uniqueness, trade photo coverage, alt text,
and licensing metadata across database and registry.
"""

import pytest
from app.extensions import mongo
from app.database.image_registry import (
    WORKER_PORTRAITS,
    SERVICE_WORK_IMAGES,
    GIG_WORK_IMAGES,
    JOB_WORK_IMAGES,
    EMPLOYER_LOGOS,
    validate_registry_integrity
)
from app.database.demo_seeder import seed_mumbai_demo_data

def test_static_registry_integrity():
    """Verify registry loads without duplicate worker portraits and with valid metadata."""
    res = validate_registry_integrity()
    assert res["is_strictly_unique"] is True
    assert res["duplicate_portraits"] == 0
    assert len(WORKER_PORTRAITS) == 17

    # Check worker portrait uniqueness
    urls = [entry["image_url"] for entry in WORKER_PORTRAITS.values()]
    assert len(urls) == len(set(urls)), "Worker portraits must be strictly unique"

    # Check alt text and licensing
    for key, entry in WORKER_PORTRAITS.items():
        assert entry["alt_text"] and len(entry["alt_text"]) > 10
        assert "Unsplash" in entry["license"]
        assert entry["image_type"] == "profile_portrait"

def test_trade_categories_and_roles_image_coverage():
    """Verify all 8 service categories, 10 gig roles, and 10 job roles have trade photography."""
    assert len(SERVICE_WORK_IMAGES) >= 8
    assert len(GIG_WORK_IMAGES) >= 10
    assert len(JOB_WORK_IMAGES) >= 10
    assert len(EMPLOYER_LOGOS) >= 5

    for slug, entries in SERVICE_WORK_IMAGES.items():
        assert len(entries) >= 2, f"Service category {slug} must have multiple trade photos"
        for img in entries:
            assert img["image_url"].startswith("http") or img["image_url"].startswith("/assets")
            assert img["alt_text"]
            assert img["license"]

    for slug, entries in GIG_WORK_IMAGES.items():
        assert len(entries) >= 2, f"Gig role {slug} must have multiple trade photos"
        for img in entries:
            assert img["image_url"]
            assert img["alt_text"]

    for slug, entries in JOB_WORK_IMAGES.items():
        assert len(entries) >= 2, f"Job role {slug} must have multiple trade photos"
        for img in entries:
            assert img["image_url"]
            assert img["alt_text"]

def test_demo_seeder_image_and_portrait_integrity(app):
    """Verify that seeding creates 100% unique portraits and 100% image/alt text coverage."""
    db = mongo.db
    # Run seeder on the test database
    report = seed_mumbai_demo_data(db)
    assert report["services"] == 240
    assert report["gigs"] == 300
    assert report["jobs"] == 300
    assert report["total"] == 840

    # 1. Check worker portrait uniqueness
    demo_workers = list(db.worker_profiles.find({"is_demo": True}))
    assert len(demo_workers) >= 15
    portraits = [w.get("profile_photo_url") for w in demo_workers if w.get("profile_photo_url")]
    assert len(portraits) == len(demo_workers)
    assert len(portraits) == len(set(portraits)), "Zero duplicate portraits across distinct worker profiles"

    for w in demo_workers:
        assert w.get("photo_alt_text")
        assert w.get("photo_license")
        assert w.get("photo_source")

    # 2. Check listings image & alt coverage
    services = list(db.service_listings.find({"is_demo": True}))
    gigs = list(db.gigs.find({"is_demo": True}))
    jobs = list(db.jobs.find({"is_demo": True}))

    assert len(services) == 240
    assert len(gigs) == 300
    assert len(jobs) == 300

    for s in services:
        assert s.get("image_urls") and len(s["image_urls"]) > 0
        assert s.get("photo_alt_text")
        assert s.get("image_metadata")

    for g in gigs:
        assert g.get("image_url")
        assert g.get("photo_alt_text")
        assert g.get("image_metadata")

    for j in jobs:
        assert j.get("image_url")
        assert j.get("photo_alt_text")
        assert j.get("image_metadata")
