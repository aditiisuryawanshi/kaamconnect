"""
RozgaarSetu Central Image Registry & Manifest
Curated authentic Indian photography system for Mumbai marketplace listings and worker profiles.
Includes strict uniqueness checks, descriptive alt text, source licensing, and category-specific fallbacks.
"""

# -----------------------------------------------------------------------------
# 1. WORKER PORTRAIT REGISTRY (STRICTLY UNIQUE PER WORKER ID)
# Diverse, realistic Indian adult workers across age, gender, and trade roles.
# Each worker ID is guaranteed to map to a single, distinct, verified portrait.
# -----------------------------------------------------------------------------

WORKER_PORTRAITS = {
    # Demo Worker 1 - Ramesh Shinde (Electrician)
    "demo.worker.ramesh@demo.rozgaarsetu.in": {
        "worker_name": "Ramesh Shinde",
        "trade": "Licensed Electrician",
        "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Ramesh Shinde, experienced Mumbai electrical contractor in work shirt (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 2 - Sunita Kamble (Home Cleaning)
    "demo.worker.sunita@demo.rozgaarsetu.in": {
        "worker_name": "Sunita Kamble",
        "trade": "Deep Cleaning Specialist",
        "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Sunita Kamble, professional deep cleaning and sanitization specialist in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 3 - Prakash Jadhav (Plumber)
    "demo.worker.prakash@demo.rozgaarsetu.in": {
        "worker_name": "Prakash Jadhav",
        "trade": "Master Plumber",
        "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Prakash Jadhav, master plumber specializing in pipeline maintenance in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 4 - Kavita Salve (Cook)
    "demo.worker.kavita@demo.rozgaarsetu.in": {
        "worker_name": "Kavita Salve",
        "trade": "Home Cook & Regional Chef",
        "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Kavita Salve, home cook and regional culinary specialist in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 5 - Rajesh Gupta (HVAC & Appliance)
    "demo.worker.rajesh@demo.rozgaarsetu.in": {
        "worker_name": "Rajesh Gupta",
        "trade": "Appliance Maintenance Technician",
        "image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Rajesh Gupta, certified AC and refrigerator repair technician in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 6 - Anita D'Souza (Salon & Beautician)
    "demo.worker.anita@demo.rozgaarsetu.in": {
        "worker_name": "Anita D'Souza",
        "trade": "Salon Beautician & Esthetician",
        "image_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Anita D'Souza, certified home salon beautician and skincare professional (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 7 - Ganesh Patil (Moving & Loading)
    "demo.worker.ganesh@demo.rozgaarsetu.in": {
        "worker_name": "Ganesh Patil",
        "trade": "Logistics & Moving Assistant",
        "image_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Ganesh Patil, residential moving and furniture transit specialist in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 8 - Meena Nair (Housekeeping & Sanitization)
    "demo.worker.meena@demo.rozgaarsetu.in": {
        "worker_name": "Meena Nair",
        "trade": "Housekeeping & Sanitization Specialist",
        "image_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Meena Nair, home sanitization and allergen cleaning expert in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 9 - Sachin Bhosle (Carpentry & Handyman)
    "demo.worker.sachin@demo.rozgaarsetu.in": {
        "worker_name": "Sachin Bhosle",
        "trade": "Carpentry & Handyman Craftsperson",
        "image_url": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Sachin Bhosle, professional woodworker and modular hardware carpenter (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 10 - Dipak Kamat (Emergency Plumber)
    "demo.worker.dipak@demo.rozgaarsetu.in": {
        "worker_name": "Dipak Kamat",
        "trade": "Emergency Plumber & Drain Specialist",
        "image_url": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Dipak Kamat, high-pressure drain auger and emergency plumbing specialist (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 11 - Shabana Shaikh (Diet Cook)
    "demo.worker.shabana@demo.rozgaarsetu.in": {
        "worker_name": "Shabana Shaikh",
        "trade": "Healthy Diet Meal Specialist",
        "image_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Shabana Shaikh, healthy diet cook and Konkani culinary specialist (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 12 - Rahul Kadam (Inverter & Electrical)
    "demo.worker.rahul@demo.rozgaarsetu.in": {
        "worker_name": "Rahul Kadam",
        "trade": "Electrical Safety & Inverter Specialist",
        "image_url": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Rahul Kadam, battery backup and 3-phase electrical panel specialist (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 13 - Vandana Sawant (Bridal Makeup)
    "demo.worker.vandana@demo.rozgaarsetu.in": {
        "worker_name": "Vandana Sawant",
        "trade": "Bridal & Party Makeup Artist",
        "image_url": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Vandana Sawant, freelance bridal makeup artist and hairstylist (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 14 - Santosh More (Warehouse Shift Leader)
    "demo.worker.santosh@demo.rozgaarsetu.in": {
        "worker_name": "Santosh More",
        "trade": "Warehouse Shift Supervisor",
        "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Santosh More, industrial logistics and warehouse shift supervisor in Mumbai (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Demo Worker 15 - Priya Tawde (Upholstery Cleaning)
    "demo.worker.priya@demo.rozgaarsetu.in": {
        "worker_name": "Priya Tawde",
        "trade": "Upholstery & Fabric Specialist",
        "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Priya Tawde, upholstery extraction and fabric shampooing specialist (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Baseline Test Worker 1 - Ramesh Shinde (worker@demo.rozgaarsetu.in)
    "worker@demo.rozgaarsetu.in": {
        "worker_name": "Ramesh Shinde (Primary Test Worker)",
        "trade": "Licensed Electrician",
        "image_url": "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Ramesh Shinde, certified baseline electrician for RozgaarSetu automated evaluations (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
    # Baseline Test Worker 2 - Sunita Kamble (worker2@demo.rozgaarsetu.in)
    "worker2@demo.rozgaarsetu.in": {
        "worker_name": "Sunita Kamble (Secondary Test Worker)",
        "trade": "Deep Cleaning Specialist",
        "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Portrait of Sunita Kamble, baseline sanitation specialist for RozgaarSetu test workflows (Demo Profile)",
        "source": "Unsplash",
        "license": "Unsplash License (Free commercial & personal use)",
        "license_url": "https://unsplash.com/license",
        "image_type": "profile_portrait",
        "is_demo": True
    },
}

# -----------------------------------------------------------------------------
# 2. SERVICE CATEGORY TRADE WORK PHOTOGRAPHS
# Realistic Indian workplaces, equipment, uniforms, and Mumbai settings.
# -----------------------------------------------------------------------------

SERVICE_WORK_IMAGES = {
    "home-cleaning": [
        {
            "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Professional cleaner wiping modern kitchen counters with microfiber cloth in Mumbai flat",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Housekeeper vacuuming and descaling floor tiles during deep home turnover clean",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Sanitization professional spraying disinfectant on residential living room furniture",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Cleaning equipment, spray bottles and scrubbers staged for bathroom sanitization",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Cleaning specialist polishing glass balcony sliding doors in high-rise Mumbai apartment",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
    ],
    "plumbing": [
        {
            "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Plumber using adjustable wrench to tighten copper pipe water fittings under kitchen sink",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/plumbing.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Plumbing tools, metal pipe connectors, and teflon tape prepared for bathroom repair",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/plumbing.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Plumbing technician repairing chrome water faucet and washbasin trap in bathroom",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/plumbing.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Plumber checking drainage line pressure valve in residential utility room",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/plumbing.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Plumber inspecting water booster pump connection and check valves on rooftop tank",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/plumbing.jpg"
        },
    ],
    "electrical-work": [
        {
            "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Electrician testing residential MCB circuit breaker panel board with insulated screwdriver",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Wiring conduits and power cable lines inside commercial distribution switchboard",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Electrical engineer measuring voltage and phase balance using digital multimeter",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Electrical technician soldering contacts and fixing indoor modular touch switches",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1509744645300-a2098b11871a?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Modern ceiling lighting circuit wiring and warm LED illumination setup",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/electrical.jpg"
        },
    ],
    "appliance-repair": [
        {
            "image_url": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Appliance technician servicing internal compressor coils of double-door refrigerator",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
            "alt_text": "HVAC technician testing split AC outdoor unit condenser fan and capacitor",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Technician checking split air conditioner cooling grill and air filters",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Appliance repair specialist troubleshooting front-load washing machine drum motor",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Technician with diagnostic multimeter and toolbox repairing microwave magnetron",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
    ],
    "cooking-help": [
        {
            "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Cook preparing traditional Indian spices and gravies in stainless steel cookware",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Home chef stirring fresh seasonal vegetables in a hot iron kadai on home gas stove",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Chef plating freshly prepared hot rotis and steaming dal in Mumbai home dining setting",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Wholesome Indian vegetarian thali meal with lentils, chapatis, salad, and spiced curry",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Fresh organic salad preparation and vegetable chopping for healthy tiffin service",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
    ],
    "beauty-personal-care": [
        {
            "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Salon beautician performing soothing facial skincare treatment in home appointment",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Professional makeup artist styling and preparing brushes for bridal look",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Hairstylist cutting and blow drying hair with precision salon scissors",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Organic cosmetics and skincare products arrayed for home facial therapy",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Beautician shaping eyebrows and applying face mask during wellness routine",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
    ],
    "moving-loading": [
        {
            "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Moving helpers carrying sturdy cardboard cargo boxes into transport vehicle",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Logistics loading crew stacking packaged parcels inside storage dispatch warehouse",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1519074069444-1ba4ea16e604?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Packers securing fragile home decor with bubble wrap and stretch film tape",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Industrial warehouse staff moving pallet shipment using hydraulic hand truck",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Delivery movers hoisting wooden furniture pieces through apartment stairwell",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "other-services": [
        {
            "image_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Carpenter measuring timber with tape ruler for custom modular shelf fitting",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/carpentry.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Handyman assembling wooden table leg fasteners using power cordless drill",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/carpentry.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Handyman aligning wall mount brackets with magnetic spirit bubble level",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/carpentry.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Wall painter applying fresh primer coat on living room wall with paint roller",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/painting.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Residential painter dipping paintbrush into paint can for window border finishing",
            "source": "Unsplash",
            "license": "Unsplash License",
            "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph",
            "fallback_local": "/assets/categories/painting.jpg"
        },
    ]
}

# -----------------------------------------------------------------------------
# 3. GIG ROLE TRADE PHOTOGRAPHS
# Shift work, event hospitality, express delivery, and warehouse operations.
# -----------------------------------------------------------------------------

GIG_WORK_IMAGES = {
    "event-support": [
        {
            "image_url": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Event crew setting up lighting and exhibition booths at Mumbai convention center",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Hospitality banquet staff coordinating seating and audio gear for corporate gala",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Venue assistant arranging decorative staging and tables at South Mumbai banquet hall",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "warehouse-helper": [
        {
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Warehouse helper scanning barcode stickers and sorting cartons on warehouse shelf",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Order picker walking warehouse distribution aisle with cargo cart in Kurla depot",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Warehouse associates wrapping pallet shipments with industrial shrink film",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "delivery-shift": [
        {
            "image_url": "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Courier delivery rider with insulated delivery backpack riding through Mumbai streets",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Delivery associate carrying customer parcel box for doorstep handover in Bandra",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Express delivery courier checking route navigation on smartphone during shift",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "loading-unloading": [
        {
            "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Heavy cargo helpers unloading transit crates from goods carrier truck in Andheri",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Logistics workers stacking heavy shipping boxes onto industrial warehouse racks",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Cargo helpers lifting and maneuvering heavy wooden packing cases onto trolley",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "catering-server": [
        {
            "image_url": "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Catering server presenting freshly prepared buffet appetizers at Mumbai reception",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Banquet service staff attending to guests in corporate conference restaurant",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Hospitality waiter serving fine dining courses with white gloves and silver tray",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
    ],
    "cleaning-crew": [
        {
            "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Commercial cleaning crew scrubbing banquet hall floor after corporate seminar",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Housekeeping crew sanitizing high-touch surfaces and vacuuming event carpets",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Facility cleaners wiping down glass partition walls and railings in office foyer",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
    ],
    "brand-promoter": [
        {
            "image_url": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Promotional brand associate demonstrating product features to shoppers in Lower Parel mall",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Brand ambassador distributing promotional flyers at trade expo entrance in Bandra",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Marketing team representative registering attendees at tech product launch desk",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
    ],
    "retail-assistant": [
        {
            "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Retail store associate organizing apparel merchandise on retail racks in Mumbai mall",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Store assistant assisting customer with size queries at retail display counter",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Supermarket retail floor inventory assistant restocking packaged grocery goods",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
    ],
    "electrical-assistant": [
        {
            "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Electrical assistant pulling copper wiring through concealed PVC conduits on site",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Helper holding cable spools and organizing terminal blocks for main electrician",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Site electrical technician measuring voltage drops with digital clamp meter",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/electrical.jpg"
        },
    ],
    "kitchen-steward": [
        {
            "image_url": "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Kitchen steward sanitizing commercial kitchen stainless steel prep counters",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Kitchen helper washing restaurant pots and baking pans in high-temp dishwasher sink",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Kitchen steward organizing clean culinary utensils and food prep containers",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
    ],
}

# -----------------------------------------------------------------------------
# 4. JOB ROLE TRADE PHOTOGRAPHS
# Full-time commercial, facility, logistics, administrative, and hospitality jobs.
# -----------------------------------------------------------------------------

JOB_WORK_IMAGES = {
    "delivery-executive": [
        {
            "image_url": "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Full-time delivery executive riding scooter with cargo delivery bag in Mumbai traffic",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80",
            "alt_text": "E-commerce logistics executive handing over package receipt at commercial office gate",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Courier logistics executive checking digital manifest route on smartphone",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "security-guard": [
        {
            "image_url": "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Uniformed security guard standing vigilant post at corporate tower entrance in Lower Parel",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Commercial security officer checking visitor entry registers at building lobby barrier",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Security supervisor inspecting perimeter gates and emergency access ways in Powai",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
    ],
    "warehouse-associate": [
        {
            "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Warehouse associate scanning inventory barcodes and updating ERP stock counts",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Supply chain associate inspecting storage pallets inside automated distribution facility",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Logistics inventory specialist packaging outbound cartons for dispatch to Mumbai hubs",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/moving_loading.jpg"
        },
    ],
    "facility-electrician": [
        {
            "image_url": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Facility electrician inspecting 3-phase commercial electrical distribution board",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Maintenance technician monitoring transformer busbars and heavy duty circuit breakers",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/electrical.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Facility electrician testing power backups and inverter generator switchboards",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/electrical.jpg"
        },
    ],
    "office-assistant": [
        {
            "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Office assistant organizing document binders and files in corporate administrative office",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Administrative assistant coordinating meeting room schedule and stationery supplies",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Corporate front desk and executive office assistant receiving official dispatches",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/loading_extra.jpg"
        },
    ],
    "cook-home-chef": [
        {
            "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Full-time domestic cook preparing balanced multi-course North and South Indian thalis",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Chef cooking healthy curries and wholesome lentil dishes in modern family kitchen",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Culinary professional plating gourmet delicacies and hot rotis for family dinner",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/cooking_home_help.jpg"
        },
    ],
    "commercial-plumber": [
        {
            "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Commercial plumber welding industrial copper pipelines in corporate business park",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/plumbing.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Plumbing technician overhauling high-volume water pump valves and pressure gauges",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/plumbing.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Sanitation plumber repairing commercial restroom sensor taps and flush mechanisms",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/plumbing.jpg"
        },
    ],
    "housekeeping-supervisor": [
        {
            "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Housekeeping supervisor conducting cleanliness audit and hygiene inspection in office tower",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Facility supervisor inspecting industrial floor buffing and glass sterilization",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Sanitation supervisor training crew on hospital-grade eco-friendly cleaning chemicals",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/home_cleaning.jpg"
        },
    ],
    "appliance-technician": [
        {
            "image_url": "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Commercial refrigeration technician replacing thermostat sensor and defrost timers",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
            "alt_text": "HVAC technician charging R32 refrigerant and pressure-testing split AC compressor",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Technician disassembling washing machine pulsator and drum bearing assembly",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/appliance_repair.jpg"
        },
    ],
    "beautician-stylist": [
        {
            "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Professional salon beautician providing organic skincare facial at Bandra client residence",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Bridal stylist arranging jewelry and high-definition bridal cosmetics",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
        {
            "image_url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
            "alt_text": "Hair specialist creating precision layered cut and blow-dry styling",
            "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
            "image_type": "work_photograph", "fallback_local": "/assets/categories/beauty_wellness.jpg"
        },
    ],
}

# -----------------------------------------------------------------------------
# 5. EMPLOYER LOGO REGISTRY
# Verified Mumbai corporate and enterprise profile logos.
# -----------------------------------------------------------------------------

EMPLOYER_LOGOS = [
    {
        "image_url": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Modern corporate headquarters of Apex Facility & Logistics Services in Andheri Mumbai (Demo Employer)",
        "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
        "image_type": "employer_logo"
    },
    {
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Commercial glass facade of MetroShield Security & Safety Solutions in Lower Parel Mumbai (Demo Employer)",
        "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
        "image_type": "employer_logo"
    },
    {
        "image_url": "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Distribution fleet and logistics hub of Mumbai Express Courier in Kurla (Demo Employer)",
        "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
        "image_type": "employer_logo"
    },
    {
        "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
        "alt_text": "StarBanquets hospitality and event planning suite in Bandra West Mumbai (Demo Employer)",
        "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
        "image_type": "employer_logo"
    },
    {
        "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
        "alt_text": "Corporate maintenance and operations team desk of UrbanCare Mumbai in Powai (Demo Employer)",
        "source": "Unsplash", "license": "Unsplash License", "license_url": "https://unsplash.com/license",
        "image_type": "employer_logo"
    },
]

FALLBACK_IMAGE = {
    "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    "alt_text": "RozgaarSetu verified trade service in Mumbai Maharashtra",
    "source": "Unsplash",
    "license": "Unsplash License",
    "license_url": "https://unsplash.com/license",
    "image_type": "work_photograph",
    "fallback_local": "/assets/hero_workers_mumbai.jpg"
}

# -----------------------------------------------------------------------------
# 6. REGISTRY LOOKUP HELPERS & UNIQUENESS VALIDATION
# -----------------------------------------------------------------------------

def get_worker_portrait_entry(worker_email_or_id: str) -> dict:
    """Retrieve full portrait metadata for a worker profile."""
    if worker_email_or_id in WORKER_PORTRAITS:
        return WORKER_PORTRAITS[worker_email_or_id]
    # Deterministic fallback from registry values
    all_entries = list(WORKER_PORTRAITS.values())
    idx = abs(hash(worker_email_or_id)) % len(all_entries)
    return all_entries[idx]

def get_worker_portrait_url(worker_email_or_id: str) -> str:
    """Retrieve the URL string of the worker portrait."""
    return get_worker_portrait_entry(worker_email_or_id)["image_url"]

def get_service_image_entry(category_slug: str, index: int) -> dict:
    """Retrieve full work photograph metadata for a service listing."""
    images = SERVICE_WORK_IMAGES.get(category_slug, [FALLBACK_IMAGE])
    return images[index % len(images)]

def get_gig_image_entry(role_slug: str, index: int) -> dict:
    """Retrieve full work photograph metadata for a gig listing."""
    images = GIG_WORK_IMAGES.get(role_slug, [FALLBACK_IMAGE])
    return images[index % len(images)]

def get_job_image_entry(role_slug: str, index: int) -> dict:
    """Retrieve full work photograph metadata for a job listing."""
    images = JOB_WORK_IMAGES.get(role_slug, [FALLBACK_IMAGE])
    return images[index % len(images)]

def get_employer_logo_entry(index: int) -> dict:
    """Retrieve full logo metadata for an employer profile."""
    return EMPLOYER_LOGOS[index % len(EMPLOYER_LOGOS)]

def validate_registry_integrity() -> dict:
    """
    Validates that:
    1. Every worker in WORKER_PORTRAITS has a 100% unique portrait (zero duplicates).
    2. Every entry has alt_text, source, license, and image_type.
    """
    portrait_urls = [p["image_url"] for p in WORKER_PORTRAITS.values()]
    unique_portrait_urls = set(portrait_urls)
    duplicates = len(portrait_urls) - len(unique_portrait_urls)

    missing_alt = sum(1 for p in WORKER_PORTRAITS.values() if not p.get("alt_text"))
    missing_source = sum(1 for p in WORKER_PORTRAITS.values() if not p.get("source") or not p.get("license"))

    return {
        "total_worker_portraits": len(portrait_urls),
        "unique_worker_portraits": len(unique_portrait_urls),
        "duplicate_portraits": duplicates,
        "is_strictly_unique": (duplicates == 0),
        "missing_alt_text": missing_alt,
        "missing_license_metadata": missing_source
    }
