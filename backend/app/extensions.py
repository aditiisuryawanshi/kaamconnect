import os
from pymongo import MongoClient
from pymongo.database import Database

class MongoExtension:
    def __init__(self):
        self.client: MongoClient = None
        self.db: Database = None

    def init_app(self, app):
        uri = app.config.get("MONGODB_URI", "mongodb://localhost:27017")
        db_name = app.config.get("MONGODB_DATABASE", "rozgaarsetu")
        
        # In test mode or when running tests, mongomock can be optionally passed
        if app.config.get("USE_MONGOMOCK", False):
            import mongomock
            self.client = mongomock.MongoClient()
            self.db = self.client[db_name]
        else:
            try:
                self.client = MongoClient(uri, serverSelectionTimeoutMS=3000)
                # Verify connection
                self.client.admin.command('ping')
                self.db = self.client[db_name]
            except Exception as e:
                # If local mongod is not reachable or during isolated unit testing, fall back gracefully
                if app.config.get("TESTING", False):
                    import mongomock
                    self.client = mongomock.MongoClient()
                    self.db = self.client[db_name]
                else:
                    # In production or standard runtime, raise or report
                    raise RuntimeError(f"Could not connect to MongoDB at {uri}: {e}")

mongo = MongoExtension()
