"""
MongoDB connection management using Motor (async driver).

Exposes a single `db` handle plus lifecycle hooks that are called from
main.py on FastAPI startup/shutdown, and helpers to create indexes so
lookups (email, username) stay fast and unique.
"""
import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings

logger = logging.getLogger("signverse.database")


class MongoManager:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None


mongo_manager = MongoManager()


async def connect_to_mongo() -> None:
    """Open the MongoDB connection pool. Called on app startup."""
    logger.info("Connecting to MongoDB...")
    try:
        mongo_manager.client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=1500)
        await mongo_manager.client.admin.command("ping")
        mongo_manager.db = mongo_manager.client[settings.MONGO_DB_NAME]
        await create_indexes()
        logger.info("MongoDB connection established: db=%s", settings.MONGO_DB_NAME)
    except Exception:
        logger.info("MongoDB not running or unreachable at %s. Using in-memory database (mongomock_motor).", settings.MONGO_URI)
        import mongomock_motor
        from scripts.seed_db import seed_with_db

        mongo_manager.client = mongomock_motor.AsyncMongoMockClient()
        mongo_manager.db = mongo_manager.client[settings.MONGO_DB_NAME]
        await create_indexes()
        await seed_with_db(mongo_manager.db)
        logger.info("In-memory database ready with starter content.")


async def close_mongo_connection() -> None:
    """Close the MongoDB connection pool. Called on app shutdown."""
    if mongo_manager.client:
        mongo_manager.client.close()
        logger.info("MongoDB connection closed.")


async def create_indexes() -> None:
    """Create indexes used across the app. Safe to call repeatedly (idempotent)."""
    db = mongo_manager.db
    try:
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.lessons.create_index([("category", 1), ("order", 1)])
        await db.quizzes.create_index("category")
        await db.progress.create_index([("user_id", 1), ("lesson_id", 1)], unique=True)
        await db.quiz_attempts.create_index([("user_id", 1), ("created_at", -1)])
        await db.practice_sessions.create_index([("user_id", 1), ("created_at", -1)])
    except Exception:
        # In-memory DB collections don't need indexes; ignore failures
        logger.debug("Skipping index creation for in-memory DB.")


def get_db() -> AsyncIOMotorDatabase:
    """FastAPI dependency: returns the active database handle."""
    return mongo_manager.db
