import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "kaamconnect-dev-super-secret-key-2026-mumbai")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "kaamconnect")
    
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    PORT = int(os.getenv("PORT", 5000))
    TESTING = False

class TestConfig(Config):
    TESTING = True
    MONGODB_DATABASE = "kaamconnect_test"
    SECRET_KEY = "test-secret-key-kaamconnect-mumbai-2026-test"
    JWT_SECRET_KEY = "test-jwt-secret-key-kaamconnect-mumbai-2026-test"
