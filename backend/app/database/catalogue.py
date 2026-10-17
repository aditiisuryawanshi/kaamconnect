"""
Catalogue Definitions for RozgaarSetu (Mumbai-Only Marketplace)
Defines canonical Mumbai localities, service categories, gig roles, and job roles.
Includes 30 meaningfully varied, realistic templates for each category/role.
"""

MUMBAI_LOCALITIES = [
    {"name": "Andheri East", "slug": "andheri-east", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Andheri West", "slug": "andheri-west", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Andheri", "slug": "andheri", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True}, # Canonical compatibility
    {"name": "Bandra West", "slug": "bandra-west", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Bandra East", "slug": "bandra-east", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Bandra", "slug": "bandra", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True}, # Canonical compatibility
    {"name": "Borivali", "slug": "borivali", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Kandivali", "slug": "kandivali", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Malad", "slug": "malad", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Goregaon", "slug": "goregaon", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Dahisar", "slug": "dahisar", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Santacruz", "slug": "santacruz", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Vile Parle", "slug": "vile-parle", "region": "Western Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Powai", "slug": "powai", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Kurla", "slug": "kurla", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Ghatkopar", "slug": "ghatkopar", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Chembur", "slug": "chembur", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Vikhroli", "slug": "vikhroli", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Bhandup", "slug": "bhandup", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Mulund", "slug": "mulund", "region": "Central Suburbs", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Dadar", "slug": "dadar", "region": "South Central", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Worli", "slug": "worli", "region": "South Central", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Lower Parel", "slug": "lower-parel", "region": "South Central", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Byculla", "slug": "byculla", "region": "South Central", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
    {"name": "Colaba", "slug": "colaba", "region": "South Mumbai", "city": "Mumbai", "state": "Maharashtra", "country": "India", "active": True},
]

SERVICE_CATEGORIES = [
    {
        "name": "Home Cleaning",
        "slug": "home-cleaning",
        "description": "Deep cleaning, dusting, bathroom and kitchen sanitization",
        "sort_order": 1,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["bandra-west", "andheri-west", "powai", "worli", "lower-parel", "dadar", "malad", "borivali", "santacruz", "vile-parle", "chembur", "ghatkopar"]
    },
    {
        "name": "Plumbing",
        "slug": "plumbing",
        "description": "Pipe repair, tap installations, leakage fixes and drain clearing",
        "sort_order": 2,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["andheri-east", "andheri-west", "borivali", "kandivali", "malad", "goregaon", "kurla", "chembur", "ghatkopar", "dadar", "powai", "mulund"]
    },
    {
        "name": "Electrical Work",
        "slug": "electrical-work",
        "description": "Wiring, switchboard fixes, fan fitting and appliance connections",
        "sort_order": 3,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["andheri-east", "powai", "bandra-west", "bandra-east", "lower-parel", "dadar", "malad", "borivali", "chembur", "vikhroli", "goregaon", "kandivali"]
    },
    {
        "name": "Appliance Repair",
        "slug": "appliance-repair",
        "description": "AC servicing, refrigerator fixing, washing machine maintenance",
        "sort_order": 4,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["powai", "andheri-west", "andheri-east", "bandra-west", "goregaon", "malad", "borivali", "ghatkopar", "chembur", "mulund", "dadar", "santacruz"]
    },
    {
        "name": "Cooking Help",
        "slug": "cooking-help",
        "description": "Daily home cooking, regional Maharashtrian, North & South Indian meals",
        "sort_order": 5,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["bandra-west", "worli", "dadar", "powai", "andheri-west", "vile-parle", "santacruz", "lower-parel", "colaba", "malad", "chembur", "borivali"]
    },
    {
        "name": "Beauty & Personal Care",
        "slug": "beauty-personal-care",
        "description": "Home salon, grooming, haircutting and waxing services",
        "sort_order": 6,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["bandra-west", "andheri-west", "vile-parle", "santacruz", "powai", "worli", "lower-parel", "dadar", "malad", "colaba", "chembur", "borivali"]
    },
    {
        "name": "Moving & Loading",
        "slug": "moving-loading",
        "description": "Furniture lifting, shifting help, carton packing and transit labor",
        "sort_order": 7,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["kurla", "andheri-east", "vikhroli", "bhandup", "ghatkopar", "mulund", "goregaon", "borivali", "dadar", "lower-parel", "malad", "chembur"]
    },
    {
        "name": "Other Services",
        "slug": "other-services",
        "description": "Carpentry, painting, pest control and skilled handyman work",
        "sort_order": 8,
        "active": True,
        "image_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
        "preferred_localities": ["andheri-east", "andheri-west", "bandra-west", "powai", "malad", "borivali", "dadar", "worli", "lower-parel", "chembur", "goregaon", "ghatkopar"]
    },
]

GIG_ROLES = [
    {
        "slug": "event-support",
        "name": "Event Support & Venue Assistant",
        "category_slug": "moving-loading",
        "preferred_localities": ["bandra-west", "bandra-east", "lower-parel", "worli", "andheri-east", "powai", "colaba", "dadar"]
    },
    {
        "slug": "warehouse-helper",
        "name": "Warehouse Order Picker & Sorter",
        "category_slug": "moving-loading",
        "preferred_localities": ["kurla", "andheri-east", "vikhroli", "bhandup", "ghatkopar", "mulund"]
    },
    {
        "slug": "delivery-shift",
        "name": "Express Courier & Delivery Associate",
        "category_slug": "moving-loading",
        "preferred_localities": ["andheri-east", "kurla", "bandra-west", "dadar", "ghatkopar", "malad", "borivali", "chembur", "powai", "lower-parel"]
    },
    {
        "slug": "loading-unloading",
        "name": "Loading & Unloading Cargo Helper",
        "category_slug": "moving-loading",
        "preferred_localities": ["kurla", "andheri-east", "vikhroli", "bhandup", "mulund", "ghatkopar", "goregaon"]
    },
    {
        "slug": "catering-server",
        "name": "Banquet & Catering Service Assistant",
        "category_slug": "cooking-help",
        "preferred_localities": ["bandra-west", "lower-parel", "worli", "colaba", "dadar", "andheri-west", "powai"]
    },
    {
        "slug": "cleaning-crew",
        "name": "Post-Event & Commercial Cleaning Crew",
        "category_slug": "home-cleaning",
        "preferred_localities": ["bandra-east", "lower-parel", "worli", "andheri-east", "andheri-west", "powai", "dadar"]
    },
    {
        "slug": "brand-promoter",
        "name": "Promotional Brand Promoter & Flyer Distributor",
        "category_slug": "other-services",
        "preferred_localities": ["bandra-west", "lower-parel", "malad", "andheri-west", "borivali", "kurla", "ghatkopar"]
    },
    {
        "slug": "retail-assistant",
        "name": "Store Inventory & Retail Floor Assistant",
        "category_slug": "other-services",
        "preferred_localities": ["lower-parel", "kurla", "malad", "bandra-west", "andheri-west", "ghatkopar", "borivali"]
    },
    {
        "slug": "electrical-assistant",
        "name": "Site Wiring & Electrical Helper",
        "category_slug": "electrical-work",
        "preferred_localities": ["andheri-east", "powai", "lower-parel", "bandra-east", "vikhroli", "kurla"]
    },
    {
        "slug": "kitchen-steward",
        "name": "Commercial Kitchen Steward & Dishwasher",
        "category_slug": "cooking-help",
        "preferred_localities": ["bandra-west", "lower-parel", "worli", "andheri-west", "powai", "colaba", "dadar"]
    },
]

JOB_ROLES = [
    {
        "slug": "delivery-executive",
        "name": "Delivery Executive",
        "category_slug": "moving-loading",
        "preferred_localities": ["andheri-east", "kurla", "ghatkopar", "malad", "borivali", "chembur", "dadar", "vikhroli", "bandra-east", "bhandup"]
    },
    {
        "slug": "security-guard",
        "name": "Security Guard",
        "category_slug": "other-services",
        "preferred_localities": ["powai", "lower-parel", "bandra-west", "andheri-east", "worli", "malad", "goregaon", "borivali", "kurla", "dadar"]
    },
    {
        "slug": "warehouse-associate",
        "name": "Warehouse Associate & Inventory Specialist",
        "category_slug": "moving-loading",
        "preferred_localities": ["kurla", "vikhroli", "bhandup", "andheri-east", "mulund", "ghatkopar"]
    },
    {
        "slug": "facility-electrician",
        "name": "Electrician & Maintenance Technician",
        "category_slug": "electrical-work",
        "preferred_localities": ["powai", "lower-parel", "bandra-east", "andheri-east", "worli", "malad", "goregaon", "dadar"]
    },
    {
        "slug": "office-assistant",
        "name": "Office Assistant & Administrative Peon",
        "category_slug": "other-services",
        "preferred_localities": ["lower-parel", "bandra-east", "andheri-east", "dadar", "worli", "colaba", "powai"]
    },
    {
        "slug": "cook-home-chef",
        "name": "Cook & Domestic Chef",
        "category_slug": "cooking-help",
        "preferred_localities": ["bandra-west", "worli", "powai", "andheri-west", "vile-parle", "santacruz", "dadar", "colaba"]
    },
    {
        "slug": "commercial-plumber",
        "name": "Plumbing & Sanitation Technician",
        "category_slug": "plumbing",
        "preferred_localities": ["lower-parel", "andheri-east", "powai", "bandra-west", "worli", "dadar", "malad", "goregaon"]
    },
    {
        "slug": "housekeeping-supervisor",
        "name": "Housekeeping Supervisor & Facility Cleaner",
        "category_slug": "home-cleaning",
        "preferred_localities": ["lower-parel", "bandra-west", "powai", "andheri-east", "worli", "malad", "dadar"]
    },
    {
        "slug": "appliance-technician",
        "name": "Appliance Repair Specialist (AC / Refrigeration)",
        "category_slug": "appliance-repair",
        "preferred_localities": ["andheri-east", "powai", "malad", "borivali", "ghatkopar", "chembur", "mulund", "dadar"]
    },
    {
        "slug": "beautician-stylist",
        "name": "Salon Beautician & Grooming Specialist",
        "category_slug": "beauty-personal-care",
        "preferred_localities": ["bandra-west", "andheri-west", "lower-parel", "worli", "santacruz", "vile-parle", "powai"]
    },
]
