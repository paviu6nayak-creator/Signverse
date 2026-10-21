# SignVerse Curriculum Audit: Signs Marked for Review (`needsReview`)

This document records the linguistic review status of all American Sign Language (ASL) lessons and handshapes across SignVerse.

---

## 📊 Executive Summary

- **Total Lessons Audited**: 222
  - Alphabet Lessons: 26 (A–Z)
  - Number Lessons: 46 (0–10, compound 11–99, 100, 1000)
  - Common Words & Greetings: 150 (Beginner, Intermediate, Advanced phrases)
- **Total Canonical Handshapes Audited**: 37 (A–Z, 0–10)
- **Reference Standard**: American Sign Language University (ASLU / Lifeprint by Dr. Bill Vicars)
- **Current `needsReview: true` Count**: **10 signs**

All core canonical signs and handshape configurations are vetted against standard ASL linguistics. 10 newly added vocabulary signs featuring regional variants, lexicalized fingerspelling, or multi-hand compound movements are flagged with `needsReview: true` for CDI review.

---

## 🔍 Verified Curriculum Status by Category

| Category / Domain | Lesson Count | Verification Source | Status | Notes |
|---|---|---|---|---|
| **Alphabet (A–Z)** | 26 | ASLU / Lifeprint manual alphabet | ✅ Verified | All 26 letters possess distinct finger and thumb positions (e.g. A upright thumb alongside fist, S thumb over knuckles, T thumb between index and middle, M thumb under 3 fingers, N thumb under 2 fingers). |
| **Numbers 0–10** | 11 | ASLU counting conventions | ✅ Verified | Inward/forward palm orientation verified. Strict thumb-touch rules for 6 (pinky), 7 (ring), 8 (middle), 9 (index) and 10 (thumb-up wrist shake). |
| **Numbers 11–100** | 35 | ASLU compound numbers | ✅ Verified | Flicking dynamics for 11–15; digit-by-digit horizontal progression (42, 64); double-digit downward palm hop rule for 22, 33, 44, 55, 66; 100 as '1' + 'C'. |
| **Greetings & Courtesies** | 24 | ASLU basic vocabulary | ✅ Verified | Hello (temple salute), Goodbye (open wave), Thank you (chin outward), Please (chest circle), Sorry (A-fist on chest), Yes (nodding S-fist), No (index/middle snap to thumb). |
| **Family Relationships** | 18 | ASLU family signs | ✅ Verified | ASL Gender Location rule enforced: Forehead/temple for male signs (Dad, Grandpa, Brother, Son); Chin for female signs (Mom, Grandma, Sister, Daughter); Neutral space for collective signs (Family, Baby, Parents). |
| **Conversational Phrases** | 64 | ASLU conversational structure | ✅ Verified | Multi-sign sequence tokens declared with component handshapes and anchor trajectories (e.g., "My Dad Is At Work", "Nice To Meet You", "See You Later"). |
| **Thematic Vocabulary (New)** | 44 | ASLU / Deaf Community Lexicon | ⚠️ 10 Pending Review | Added 44 new signs across Colors, Days, Months, Animals, Emotions, Health/Body, Travel, Question Words, and Verbs. 34 fully verified; 10 flagged below. |

---

## 🛡 System Behavior for Signs Marked `needsReview: true`

When any sign or handshape is assigned `"needsReview": true` in `frontend/src/data/lessons.js` or `frontend/src/data/handshapes.ts`:

1. **Automatic Quiz Exclusion**: The quiz generator (`quizCatalog.js`) automatically filters out `needsReview` lessons so unverified signs never appear in student assessments.
2. **Developer Preview Flagging**: The developer preview tool at `/dev/handshapes` surfaces a prominent review banner and counts all flagged items.
3. **Card Warning Badges**: The lesson catalog renders an amber "Needs Review" badge on the sign's card to alert instructors and content curators.
4. **Automated Unit Test Validation**: The test suite `npm run test:readiness` audits quiz generation to guarantee no flagged signs leak into student quizzes.

---

## 📝 Protocol for Flagging & Resolving New Signs

When community contributors or curriculum developers add experimental signs:
1. Set `"needsReview": true` in the lesson entry in `frontend/src/data/lessons.js`.
2. Add a detailed entry in the table below describing the sign, the specific question or ambiguity (e.g. regional variation, alternative handshape, motion path), and the reviewer assigned.
3. Once reviewed against Lifeprint/ASLU or verified with a Certified Deaf Interpreter (CDI):
   - Update the lesson with the canonical handshape and anchor landmarks.
   - Set `"needsReview": false`.
   - Remove the sign from the active pending table and run `npm run test:all`.

### Pending Signs Under Review (10 Total)

| Lesson ID | Label | Category | Level | Theme | Specific Ambiguity / Linguistic Question | Reviewer |
|---|---|---|---|---|---|---|
| `word-thursday` | Thursday | greetings | intermediate | Days of the week | Variant usage between circulating 'H' handshape vs. sequential 'T'-to-'H' ("TH") compound sign. Needs CDI consensus on canonical curriculum variant. | Curriculum Team |
| `word-january` | January | greetings | intermediate | Months | Months in ASL are frequently fingerspelled (J-A-N) vs. calendar-page turn followed by '1'; requires confirmation on primary variant. | Curriculum Team |
| `word-february` | February | greetings | intermediate | Months | Abbreviated fingerspelling (F-E-B) vs. calendar flip variant followed by '2'; needs lexical standardization. | Curriculum Team |
| `word-march` | March | greetings | intermediate | Months | Full fingerspelling (M-A-R-C-H) vs. calendar sign variant followed by '3'; pending standardization. | Curriculum Team |
| `word-surprised` | Surprised | greetings | intermediate | Emotions | Closed pinch at eyes flicking open vs. jaw-drop modified-C; verify landmark proximity and facial expression requirement. | CDI Review |
| `word-head` | Head | greetings | beginner | Health and body | Side-head downward tracing vs. temple-to-chin double touch; review path to prevent confusion with "think" or "smart". | Curriculum Team |
| `word-airport` | Airport | greetings | intermediate | Travel and places | Compound sign (FLY-PLANE + PLACE) vs. two-handed runway take-off gesture; verify whether single or two-handed representation is preferred. | CDI Review |
| `word-city` | City | greetings | intermediate | Travel and places | Repetitive touching and separation of fingertips (roof peaks) across horizontal plane; needs landmark trajectory calibration. | CDI Review |
| `word-park` | Park | greetings | intermediate | Travel and places | Lexicalized fingerspelling (P-A-R-K) vs. P-handshape tap on non-dominant hand; needs review for beginner/intermediate learners. | Curriculum Team |
| `word-how-much` | How Much / How Many | greetings | intermediate | Question words | Upward thrust with open claw handshape and non-manual furrowed brow; verify single vs. two-handed upward burst convention. | CDI Review |
