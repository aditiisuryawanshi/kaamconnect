"""
Central Image Manifest for RozgaarSetu Demo Seeding
Powered by image_registry.py.
Maintains backwards compatibility while supplying rich metadata (alt text, licensing, Indian trade context).
"""

from app.database.image_registry import (
    WORKER_PORTRAITS,
    SERVICE_WORK_IMAGES,
    GIG_WORK_IMAGES,
    JOB_WORK_IMAGES,
    EMPLOYER_LOGOS,
    FALLBACK_IMAGE,
    get_worker_portrait_entry,
    get_worker_portrait_url,
    get_service_image_entry,
    get_gig_image_entry,
    get_job_image_entry,
    get_employer_logo_entry,
    validate_registry_integrity
)

IMAGE_MANIFEST = {
    "service_categories": {
        slug: [img["image_url"] for img in img_list]
        for slug, img_list in SERVICE_WORK_IMAGES.items()
    },
    "gig_roles": {
        slug: [img["image_url"] for img in img_list]
        for slug, img_list in GIG_WORK_IMAGES.items()
    },
    "job_roles": {
        slug: [img["image_url"] for img in img_list]
        for slug, img_list in JOB_WORK_IMAGES.items()
    },
    "workers": [
        p["image_url"] for p in WORKER_PORTRAITS.values()
    ],
    "employers": [
        e["image_url"] for e in EMPLOYER_LOGOS
    ],
    "fallback": FALLBACK_IMAGE["image_url"]
}

def get_image_for_service(category_slug: str, index: int) -> str:
    return get_service_image_entry(category_slug, index)["image_url"]

def get_image_for_gig(role_slug: str, index: int) -> str:
    return get_gig_image_entry(role_slug, index)["image_url"]

def get_image_for_job(role_slug: str, index: int) -> str:
    return get_job_image_entry(role_slug, index)["image_url"]
