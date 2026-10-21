"""
Seeds MongoDB with an initial admin account and starter learning content
(alphabet + numbers lessons, one sample quiz) so the app is usable
immediately after deployment, before an admin adds real content.

Usage (from backend/):
    python -m scripts.seed_db
"""
import asyncio
import string
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.core.security import hash_password

ADMIN_EMAIL = "admin@signverse.app"
ADMIN_PASSWORD = "ChangeMe123!"  # change immediately after first login


async def seed_with_db(db) -> None:
    now = datetime.now(timezone.utc)

    # --- Admin user -----------------------------------------------------
    existing_admin = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing_admin:
        await db.users.insert_one(
            {
                "full_name": "SignVerse Admin",
                "username": "signverse_admin",
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "role": "admin",
                "avatar_url": None,
                "bio": "Platform administrator",
                "preferred_language": "ASL",
                "daily_goal_minutes": 15,
                "current_streak": 0,
                "longest_streak": 0,
                "total_xp": 0,
                "level": 1,
                "is_active": True,
                "created_at": now,
                "last_active_at": now,
            }
        )
        print(f"Created admin user: {ADMIN_EMAIL} / {ADMIN_PASSWORD} (change this password immediately)")
    else:
        print("Admin user already exists, skipping.")

    # Helper to check if category needs updated tiered seeding
    async def needs_seeding(category: str) -> bool:
        intermediate_count = await db.lessons.count_documents({"category": category, "difficulty": "intermediate"})
        return intermediate_count == 0

    # --- Alphabet lessons (A-Z across Beginner, Intermediate, Advanced) --
    if await needs_seeding("alphabet"):
        await db.lessons.delete_many({"category": "alphabet"})
        alphabet_tiers = {
            "beginner": list("ABCDEFGHI"),     # 9 letters
            "intermediate": list("JKLMNOPQR"), # 9 letters
            "advanced": list("STUVWXYZ"),      # 8 letters
        }
        alphabet_lessons = []
        order = 0
        for diff, letters in alphabet_tiers.items():
            xp = 10 if diff == "beginner" else 15 if diff == "intermediate" else 20
            for letter in letters:
                alphabet_lessons.append(
                    {
                        "title": f"Letter {letter}",
                        "category": "alphabet",
                        "difficulty": diff,
                        "description": f"Learn how to sign the letter {letter} in the manual alphabet ({diff.capitalize()} tier).",
                        "sign_label": letter,
                        "image_url": f"/assets/signs/alphabet/{letter}.png",
                        "video_url": None,
                        "order": order,
                        "xp_reward": xp,
                        "is_published": True,
                        "created_at": now,
                    }
                )
                order += 1
        await db.lessons.insert_many(alphabet_lessons)
        print(f"Seeded {len(alphabet_lessons)} alphabet lessons across Beginner, Intermediate, and Advanced.")

    # --- Number lessons (Complete logical progression) ------------------
    if await needs_seeding("numbers"):
        await db.lessons.delete_many({"category": "numbers"})
        number_tiers = {
            "beginner": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            "intermediate": ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "30", "40", "50", "60", "70", "80", "90"],
            "advanced": ["21", "22", "25", "33", "42", "55", "64", "77", "88", "99", "100", "125", "340", "500", "750", "1000"],
        }
        number_lessons = []
        order = 0
        for diff, digits in number_tiers.items():
            xp = 10 if diff == "beginner" else 15 if diff == "intermediate" else (25 if diff == "advanced" else 20)
            for digit in digits:
                number_lessons.append(
                    {
                        "title": f"Number {digit}",
                        "category": "numbers",
                        "difficulty": diff,
                        "description": f"Learn how to sign the number {digit} in ASL counting ({diff.capitalize()} tier).",
                        "sign_label": digit,
                        "image_url": f"/signs/asl/{digit}.svg",
                        "video_url": None,
                        "order": order,
                        "xp_reward": xp,
                        "is_published": True,
                        "created_at": now,
                    }
                )
                order += 1
        await db.lessons.insert_many(number_lessons)
        print(f"Seeded {len(number_lessons)} number lessons across Beginner, Intermediate, and Advanced.")

    # --- Common Words & Greetings lessons (Beginner, Intermediate, Advanced)
    if await needs_seeding("greetings"):
        await db.lessons.delete_many({"category": "greetings"})
        greeting_data = [
            # Beginner (10 items)
            {"title": "Hello", "sign_label": "hello", "difficulty": "beginner", "xp": 15, "desc": "The foundational welcoming salute wave in ASL."},
            {"title": "Thank You", "sign_label": "thank_you", "difficulty": "beginner", "xp": 15, "desc": "Classic hand-to-chin gesture expressing gratitude."},
            {"title": "Please", "sign_label": "please", "difficulty": "beginner", "xp": 15, "desc": "Circular motion across the chest for polite requests."},
            {"title": "Sorry", "sign_label": "sorry", "difficulty": "beginner", "xp": 15, "desc": "Circular fist motion over the heart to express apology."},
            {"title": "Goodbye", "sign_label": "goodbye", "difficulty": "beginner", "xp": 15, "desc": "Standard open-palm parting wave facing forward."},
            {"title": "Yes", "sign_label": "yes", "difficulty": "beginner", "xp": 15, "desc": "Closed fist nodding up and down like a nodding head."},
            {"title": "No", "sign_label": "no", "difficulty": "beginner", "xp": 15, "desc": "Index and middle fingers snapping firmly against the thumb."},
            {"title": "Help", "sign_label": "help", "difficulty": "beginner", "xp": 15, "desc": "Thumbs-up resting on a flat supportive palm lifted together."},
            {"title": "Love", "sign_label": "love", "difficulty": "beginner", "xp": 15, "desc": "The iconic ILY sign: thumb, index, and pinky extended."},
            {"title": "Friend", "sign_label": "friend", "difficulty": "beginner", "xp": 15, "desc": "Interlocking curved index fingers symbolizing strong trust."},

            # Intermediate (20 single vocabulary words)
            {"title": "Good", "sign_label": "good", "difficulty": "intermediate", "xp": 15, "desc": "Touch fingertips to chin and bring down to open palm."},
            {"title": "Bad", "sign_label": "bad", "difficulty": "intermediate", "xp": 15, "desc": "Fingertips chin down and away."},
            {"title": "Eat", "sign_label": "eat", "difficulty": "intermediate", "xp": 15, "desc": "Flat O fingertips tapping to mouth."},
            {"title": "Drink", "sign_label": "drink", "difficulty": "intermediate", "xp": 15, "desc": "C-hand shape tip back like a cup."},
            {"title": "Water", "sign_label": "water", "difficulty": "intermediate", "xp": 15, "desc": "W-handshape tapping chin twice."},
            {"title": "Food", "sign_label": "food", "difficulty": "intermediate", "xp": 15, "desc": "Fingertips brought together touching lips."},
            {"title": "Family", "sign_label": "family", "difficulty": "intermediate", "xp": 15, "desc": "F-hands circling around to meet pinkies."},
            {"title": "Home", "sign_label": "home", "difficulty": "intermediate", "xp": 15, "desc": "Flat O touch cheek to ear (eat + sleep)."},
            {"title": "School", "sign_label": "school", "difficulty": "intermediate", "xp": 15, "desc": "Clap flat palms twice."},
            {"title": "Stop", "sign_label": "stop", "difficulty": "intermediate", "xp": 15, "desc": "Chop edge of palm onto base."},
            {"title": "Go", "sign_label": "go", "difficulty": "intermediate", "xp": 15, "desc": "Index fingers roll forward."},
            {"title": "Name", "sign_label": "name", "difficulty": "intermediate", "xp": 15, "desc": "Two H hands tapping fingertips crosswise."},
            {"title": "Time", "sign_label": "time", "difficulty": "intermediate", "xp": 15, "desc": "Index finger tapping back of wrist."},
            {"title": "Bathroom", "sign_label": "bathroom", "difficulty": "intermediate", "xp": 15, "desc": "T-hand shaking side to side."},
            {"title": "Doctor", "sign_label": "doctor", "difficulty": "intermediate", "xp": 15, "desc": "Bent M fingertips tapping wrist pulse."},
            {"title": "Happy", "sign_label": "happy", "difficulty": "intermediate", "xp": 15, "desc": "Open palms brush upward across chest."},
            {"title": "Tired", "sign_label": "tired", "difficulty": "intermediate", "xp": 15, "desc": "Bent hands roll down chest with drooped shoulders."},
            {"title": "Today", "sign_label": "today", "difficulty": "intermediate", "xp": 15, "desc": "Y-hands drop down twice (NOW + DAY)."},
            {"title": "Tomorrow", "sign_label": "tomorrow", "difficulty": "intermediate", "xp": 15, "desc": "Thumb flick forward from jawline."},
            {"title": "Yesterday", "sign_label": "yesterday", "difficulty": "intermediate", "xp": 15, "desc": "Thumb stroke backward along jawline to ear."},

            # Advanced (28 themed phrases)
            {"title": "See You Later", "sign_label": "see_you_later", "difficulty": "advanced", "xp": 25, "desc": "'V' hand from eye forward into 'L' flick forward."},
            {"title": "Excuse Me", "sign_label": "excuse_me", "difficulty": "advanced", "xp": 25, "desc": "Fingertips brush across open flat palm twice."},
            {"title": "Take Care", "sign_label": "take_care", "difficulty": "advanced", "xp": 25, "desc": "Two 'K' handshapes tapping gently together."},
            {"title": "Good Luck", "sign_label": "good_luck", "difficulty": "advanced", "xp": 25, "desc": "Sign GOOD then flick middle finger off chin for LUCK."},
            {"title": "Welcome", "sign_label": "welcome", "difficulty": "advanced", "xp": 25, "desc": "Open upturned palm sweeping gracefully inward."},
            {"title": "Congratulations", "sign_label": "congratulations", "difficulty": "advanced", "xp": 25, "desc": "Clasp hands together and shake happily overhead."},
            {"title": "I Don't Understand", "sign_label": "i_dont_understand", "difficulty": "advanced", "xp": 25, "desc": "Flick index finger by temple with headshake in negation."},
            {"title": "Can You Repeat?", "sign_label": "can_you_repeat", "difficulty": "advanced", "xp": 25, "desc": "Curve dominant hand into center of flat palm for AGAIN."},
            {"title": "Please Slow Down", "sign_label": "please_slow_down", "difficulty": "advanced", "xp": 25, "desc": "Sign PLEASE then slide hand slowly up arm for SLOW."},
            {"title": "How Do You Sign...?", "sign_label": "how_do_you_sign", "difficulty": "advanced", "xp": 25, "desc": "Rotate curved hands palms up for HOW, revolve index fingers."},
            {"title": "I Am Learning Sign Language", "sign_label": "i_am_learning_asl", "difficulty": "advanced", "xp": 25, "desc": "Point I, grab knowledge to forehead for LEARN, revolve fingers."},
            {"title": "Do You Know Sign Language?", "sign_label": "do_you_know_asl", "difficulty": "advanced", "xp": 25, "desc": "Point YOU, tap temple for KNOW, revolve fingers with raised brows."},
            {"title": "I Need Help", "sign_label": "i_need_help", "difficulty": "advanced", "xp": 25, "desc": "Point I, hook X downward for NEED, lift thumbs-up on palm."},
            {"title": "Where Is The Bathroom?", "sign_label": "where_bathroom", "difficulty": "advanced", "xp": 25, "desc": "Shake T-hand for BATHROOM, palms up waggle for WHERE."},
            {"title": "Call The Doctor", "sign_label": "call_doctor", "difficulty": "advanced", "xp": 25, "desc": "Y-hand to ear for CALL, tap inner wrist for DOCTOR."},
            {"title": "I Am Hungry", "sign_label": "i_am_hungry", "difficulty": "advanced", "xp": 25, "desc": "Point I, slide C-hand down chest for HUNGRY."},
            {"title": "I Am Thirsty", "sign_label": "i_am_thirsty", "difficulty": "advanced", "xp": 25, "desc": "Point I, trace index finger down throat for THIRSTY."},
            {"title": "I Am Lost", "sign_label": "i_am_lost", "difficulty": "advanced", "xp": 25, "desc": "Point I, open fingertips and drop hands downward for LOST."},
            {"title": "I Am Happy", "sign_label": "i_am_happy", "difficulty": "advanced", "xp": 25, "desc": "Point I, brush open palms upward across chest twice."},
            {"title": "I Am Tired", "sign_label": "i_am_tired", "difficulty": "advanced", "xp": 25, "desc": "Point I, roll bent hands down chest in fatigue."},
            {"title": "I Love You", "sign_label": "i_love_you", "difficulty": "advanced", "xp": 25, "desc": "Extend thumb, index, and pinky finger toward recipient."},
            {"title": "Nice To Meet You", "sign_label": "nice_to_meet_you", "difficulty": "advanced", "xp": 25, "desc": "Slide palms for NICE, index fingers meet, point YOU."},
            {"title": "What Is Your Name?", "sign_label": "what_is_your_name", "difficulty": "advanced", "xp": 25, "desc": "Palm forward for YOUR, tap H-fingers for NAME, palms waggle."},
            {"title": "My Name Is...", "sign_label": "my_name_is", "difficulty": "advanced", "xp": 25, "desc": "Palm on chest for MY, tap H-fingers for NAME, fingerspell."},
            {"title": "Today", "sign_label": "today_sign", "difficulty": "advanced", "xp": 25, "desc": "Y-hands drop down twice in affirmation."},
            {"title": "Tomorrow", "sign_label": "tomorrow_sign", "difficulty": "advanced", "xp": 25, "desc": "Thumb flick forward from jaw into space in front."},
            {"title": "Yesterday", "sign_label": "yesterday_sign", "difficulty": "advanced", "xp": 25, "desc": "Thumb touches chin then moves back to ear."},
            {"title": "What Time Is It?", "sign_label": "what_time_is_it", "difficulty": "advanced", "xp": 25, "desc": "Tap wrist for TIME, palms up waggle for WHAT."},
        ]

        greeting_lessons = [
            {
                "title": item["title"],
                "category": "greetings",
                "difficulty": item["difficulty"],
                "description": item["desc"],
                "sign_label": item["sign_label"],
                "image_url": f"/signs/asl/{item['sign_label']}.svg",
                "video_url": None,
                "order": idx,
                "xp_reward": item["xp"],
                "is_published": True,
                "created_at": now,
            }
            for idx, item in enumerate(greeting_data)
        ]
        await db.lessons.insert_many(greeting_lessons)
        print(f"Seeded {len(greeting_lessons)} greeting lessons across Beginner, Intermediate, and Advanced.")

    # --- Common Words category (if requested directly) --------------------
    if await needs_seeding("common_words"):
        await db.lessons.delete_many({"category": "common_words"})
        cw_data = [
            {"title": "Name", "sign_label": "name", "difficulty": "beginner", "xp": 15, "desc": "Two 'H' hands tapping fingertips crosswise twice."},
            {"title": "Water", "sign_label": "water", "difficulty": "beginner", "xp": 15, "desc": "'W' handshape tapping the chin twice with index finger."},
            {"title": "Food", "sign_label": "food", "difficulty": "beginner", "xp": 15, "desc": "Fingertips brought together touching lips repeatedly."},
            {"title": "Time", "sign_label": "time", "difficulty": "beginner", "xp": 15, "desc": "Index finger tapping the back of the wrist like a watch."},

            {"title": "Family", "sign_label": "family", "difficulty": "intermediate", "xp": 20, "desc": "'F' hands starting together and circling around to touch pinkies."},
            {"title": "House", "sign_label": "house", "difficulty": "intermediate", "xp": 20, "desc": "Flat hands outlining a roof peak and side walls."},
            {"title": "Work", "sign_label": "work", "difficulty": "intermediate", "xp": 20, "desc": "Dominant fist gently tapping base of non-dominant fist twice."},
            {"title": "Happy", "sign_label": "happy", "difficulty": "intermediate", "xp": 20, "desc": "Flat open hands brushing upward over the chest in joy."},

            {"title": "Important", "sign_label": "important", "difficulty": "advanced", "xp": 25, "desc": "'F' hands starting low and swooping upward in an arc together."},
            {"title": "Community", "sign_label": "community", "difficulty": "advanced", "xp": 25, "desc": "Fingertips touching like a roof and twisting to show collective unity."},
            {"title": "Celebrate", "sign_label": "celebrate", "difficulty": "advanced", "xp": 25, "desc": "Curved 'X' fingers circling overhead like twirling festive streamers."},
            {"title": "Knowledge", "sign_label": "knowledge", "difficulty": "advanced", "xp": 25, "desc": "Curved fingertips tapping the side of the forehead with confidence."},
        ]
        cw_lessons = [
            {
                "title": item["title"],
                "category": "common_words",
                "difficulty": item["difficulty"],
                "description": item["desc"],
                "sign_label": item["sign_label"],
                "image_url": f"/assets/signs/common_words/{item['sign_label']}.png",
                "video_url": None,
                "order": idx,
                "xp_reward": item["xp"],
                "is_published": True,
                "created_at": now,
            }
            for idx, item in enumerate(cw_data)
        ]
        await db.lessons.insert_many(cw_lessons)
        print(f"Seeded {len(cw_lessons)} common_words lessons across all 3 levels.")

    # --- Daily Conversation category ---------------------------------------
    if await needs_seeding("daily_conversation"):
        await db.lessons.delete_many({"category": "daily_conversation"})
        dc_data = [
            {"title": "Good Afternoon", "sign_label": "good_afternoon", "difficulty": "beginner", "xp": 15, "desc": "Sign 'good' from chin, then dominant forearm slopes at a mid-day angle."},
            {"title": "See You Tomorrow", "sign_label": "see_you_tomorrow", "difficulty": "beginner", "xp": 15, "desc": "Sign 'see' then flick thumb forward from jaw for 'tomorrow'."},
            {"title": "What Is That", "sign_label": "what_is_that", "difficulty": "beginner", "xp": 15, "desc": "Open hands palms up shaking slightly side-to-side with curious expression."},
            {"title": "I Like It", "sign_label": "i_like_it", "difficulty": "beginner", "xp": 15, "desc": "Middle finger and thumb pull gently outward from the chest."},

            {"title": "What Is Your Name", "sign_label": "what_is_your_name", "difficulty": "intermediate", "xp": 20, "desc": "Open palm forward ('your'), 'name' tapped, followed by 'what' furrowed brow."},
            {"title": "Where Are You From", "sign_label": "where_are_you_from", "difficulty": "intermediate", "xp": 20, "desc": "Point 'you', hook index finger away from other for 'from', index wag 'where'."},
            {"title": "Do You Know ASL", "sign_label": "do_you_know_asl", "difficulty": "intermediate", "xp": 20, "desc": "Point 'you', tap temple for 'know', fingerspell 'A-S-L' with raised eyebrows."},
            {"title": "Can I Help You", "sign_label": "can_i_help_you", "difficulty": "intermediate", "xp": 20, "desc": "Thumbs-up on palm moving outward toward the person being addressed."},

            {"title": "Sign Slower Please", "sign_label": "sign_slower_please", "difficulty": "advanced", "xp": 25, "desc": "Slide dominant hand slowly up the back of non-dominant hand, then sign 'please'."},
            {"title": "I Am Learning ASL", "sign_label": "i_am_learning_asl", "difficulty": "advanced", "xp": 25, "desc": "Grab knowledge from palm to forehead ('learn') then sign manual letters A-S-L."},
            {"title": "Great Talking With You", "sign_label": "great_talking_with_you", "difficulty": "advanced", "xp": 25, "desc": "Open palms bounce ('wonderful'), alternating index fingers speak together."},
            {"title": "Have A Wonderful Day", "sign_label": "have_a_wonderful_day", "difficulty": "advanced", "xp": 25, "desc": "Cupped hands inward ('have'), push palms out in joy, arm sweeps for 'day'."},
        ]
        dc_lessons = [
            {
                "title": item["title"],
                "category": "daily_conversation",
                "difficulty": item["difficulty"],
                "description": item["desc"],
                "sign_label": item["sign_label"],
                "image_url": f"/assets/signs/daily_conversation/{item['sign_label']}.png",
                "video_url": None,
                "order": idx,
                "xp_reward": item["xp"],
                "is_published": True,
                "created_at": now,
            }
            for idx, item in enumerate(dc_data)
        ]
        await db.lessons.insert_many(dc_lessons)
        print(f"Seeded {len(dc_lessons)} daily_conversation lessons across all 3 levels.")

    # --- Sample quiz --------------------------------------------------------
    if await db.quizzes.count_documents({}) == 0:
        await db.quizzes.insert_one(
            {
                "title": "Alphabet Basics Quiz",
                "category": "alphabet",
                "difficulty": "beginner",
                "description": "Test what you've learned about the manual alphabet.",
                "time_limit_seconds": 180,
                "questions": [
                    {
                        "_id": __import__("bson").ObjectId(),
                        "question_type": "multiple_choice",
                        "prompt": "Which hand shape represents the letter 'A' in ASL?",
                        "image_url": "/assets/signs/alphabet/A.png",
                        "options": [
                            {"text": "A closed fist with thumb resting on the side", "is_correct": True},
                            {"text": "An open flat palm", "is_correct": False},
                            {"text": "A pointed index finger", "is_correct": False},
                            {"text": "A peace sign", "is_correct": False},
                        ],
                        "correct_sign_label": None,
                        "points": 10,
                    },
                    {
                        "_id": __import__("bson").ObjectId(),
                        "question_type": "sign_recognition",
                        "prompt": "Show the sign for the letter 'B' using your webcam.",
                        "image_url": None,
                        "options": [],
                        "correct_sign_label": "B",
                        "points": 15,
                    },
                ],
                "is_published": True,
                "created_at": now,
            }
        )
        print("Seeded sample quiz: Alphabet Basics Quiz")


async def seed() -> None:
    try:
        client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)
        await client.admin.command("ping")
        db = client[settings.MONGO_DB_NAME]
        await seed_with_db(db)
        client.close()
        print("Seeding complete on MongoDB.")
    except Exception as e:
        print(f"MongoDB not available ({e}). Testing in-memory seed with mongomock_motor...")
        import mongomock_motor
        mock_client = mongomock_motor.AsyncMongoMockClient()
        db = mock_client[settings.MONGO_DB_NAME]
        await seed_with_db(db)
        print("In-memory seeding verified successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
