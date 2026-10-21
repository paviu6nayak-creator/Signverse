"""
Gamification helpers shared by lessons/quizzes routes: XP + leveling,
daily streak tracking, and achievement unlocking.

Kept framework-agnostic (plain Motor calls) so it can be called from any
route without circular imports.
"""
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

XP_PER_LEVEL = 100

ACHIEVEMENTS = [
    {"code": "first_lesson", "title": "First Steps", "description": "Complete your first lesson", "icon": "sparkles"},
    {"code": "streak_3", "title": "Getting Consistent", "description": "Maintain a 3-day streak", "icon": "flame"},
    {"code": "streak_7", "title": "Week Warrior", "description": "Maintain a 7-day streak", "icon": "flame"},
    {"code": "streak_30", "title": "Unstoppable", "description": "Maintain a 30-day streak", "icon": "flame"},
    {"code": "alphabet_master", "title": "Alphabet Master", "description": "Complete all alphabet lessons", "icon": "award"},
    {"code": "quiz_perfect", "title": "Perfect Score", "description": "Score 100% on a quiz", "icon": "trophy"},
    {"code": "level_5", "title": "Rising Signer", "description": "Reach level 5", "icon": "trending-up"},
]


async def award_xp(db: AsyncIOMotorDatabase, user_id: ObjectId, xp: int) -> None:
    """Add XP to a user and recompute their level (100 XP per level)."""
    user = await db.users.find_one({"_id": user_id}, {"total_xp": 1})
    new_total = (user.get("total_xp", 0) if user else 0) + xp
    new_level = max(1, new_total // XP_PER_LEVEL + 1)

    await db.users.update_one({"_id": user_id}, {"$set": {"total_xp": new_total, "level": new_level}})

    completed_count = await db.progress.count_documents({"user_id": user_id, "completed": True})
    if completed_count == 1:
        await unlock_achievement(db, user_id, "first_lesson")
    if new_level >= 5:
        await unlock_achievement(db, user_id, "level_5")


async def update_streak(db: AsyncIOMotorDatabase, user_id: ObjectId) -> None:
    """
    Update the user's daily activity streak. Called whenever the user
    completes any learning activity (practice attempt or quiz).
    """
    user = await db.users.find_one({"_id": user_id}, {"current_streak": 1, "longest_streak": 1, "last_streak_date": 1})
    if not user:
        return

    today = datetime.now(timezone.utc).date()
    last_date = user.get("last_streak_date")
    last_date = last_date.date() if isinstance(last_date, datetime) else None

    if last_date == today:
        return  # already counted today

    if last_date == today - timedelta(days=1):
        new_streak = user.get("current_streak", 0) + 1
    else:
        new_streak = 1

    longest = max(new_streak, user.get("longest_streak", 0))
    await db.users.update_one(
        {"_id": user_id},
        {"$set": {"current_streak": new_streak, "longest_streak": longest, "last_streak_date": datetime.now(timezone.utc)}},
    )

    if new_streak == 3:
        await unlock_achievement(db, user_id, "streak_3")
    elif new_streak == 7:
        await unlock_achievement(db, user_id, "streak_7")
    elif new_streak == 30:
        await unlock_achievement(db, user_id, "streak_30")


async def unlock_achievement(db: AsyncIOMotorDatabase, user_id: ObjectId, code: str) -> None:
    """Idempotently unlock an achievement for a user (no-op if already earned)."""
    definition = next((a for a in ACHIEVEMENTS if a["code"] == code), None)
    if not definition:
        return

    already_earned = await db.achievements.find_one({"user_id": user_id, "code": code})
    if already_earned:
        return

    await db.achievements.insert_one(
        {
            "user_id": user_id,
            "code": code,
            "title": definition["title"],
            "description": definition["description"],
            "icon": definition["icon"],
            "earned_at": datetime.now(timezone.utc),
        }
    )
