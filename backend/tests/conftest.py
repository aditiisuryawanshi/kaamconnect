import pytest
from app import create_app
from app.config import TestConfig
from app.database.indexes import init_indexes
from app.extensions import mongo
from app.common.permissions import generate_token

@pytest.fixture(scope="session")
def app():
    # Use TestConfig with USE_MONGOMOCK = True for lightning-fast, fully isolated tests
    test_conf = TestConfig()
    test_conf.USE_MONGOMOCK = True
    app = create_app(test_conf)
    with app.app_context():
        init_indexes(mongo.db)
        yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture(autouse=True)
def clean_db(app):
    with app.app_context():
        # Clear collections between test runs
        for coll in mongo.db.list_collection_names():
            mongo.db[coll].delete_many({})
        # Seed basic localities and categories for tests
        mongo.db.localities.insert_many([
            {"name": "Andheri", "slug": "andheri", "region": "Western Suburbs", "city": "Mumbai", "active": True},
            {"name": "Powai", "slug": "powai", "region": "Central Suburbs", "city": "Mumbai", "active": True},
            {"name": "Bandra", "slug": "bandra", "region": "Western Suburbs", "city": "Mumbai", "active": True}
        ])
        mongo.db.service_categories.insert_many([
            {"name": "Electrical Work", "slug": "electrical-work", "sort_order": 1, "active": True},
            {"name": "Home Cleaning", "slug": "home-cleaning", "sort_order": 2, "active": True}
        ])

@pytest.fixture
def auth_headers(app):
    def _make_headers(user_id, email="test@example.com", roles=None):
        roles = roles or ["customer"]
        with app.app_context():
            token = generate_token(str(user_id), email, roles)
            return {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
    return _make_headers
