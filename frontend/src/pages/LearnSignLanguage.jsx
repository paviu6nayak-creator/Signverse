import { AlertTriangle, RefreshCw } from "lucide-react";
import CategoryCardsSection from "../components/lessons/CategoryCardsSection";
import LearnHero from "../components/lessons/LearnHero";
import LearningPath from "../components/lessons/LearningPath";
import { useAuth } from "../context/AuthContext";
import { ALL_LESSONS, getBeginnerPathLessons } from "../data/lessons";
import { getCompletedLessonIds, getQuizHistory } from "../data/quizCatalog";
import { getPracticeProgress } from "../utils/dailyPracticeGenerator";

export default function LearnSignLanguage() {
  const { user } = useAuth() || {};
  const beginnerData = getBeginnerPathLessons();
  const completedIds = getCompletedLessonIds();
  const practiceProgress = getPracticeProgress();

  const totalLessons = beginnerData?.total || 1;
  const completedCount = (beginnerData.all || []).filter((l) => l.completed || completedIds.has(l.id)).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Real streak from user profile or practice storage
  const streakCount = user?.current_streak ?? user?.streak ?? practiceProgress?.streak ?? 0;

  // Real XP from user profile or calculated from practice/completed lessons
  const totalCompletedCount = completedIds?.size || completedCount;
  const baseCalculatedXp = (practiceProgress?.xp || 0) + (totalCompletedCount * 10);
  const xpCount = user?.total_xp ?? user?.xp ?? (baseCalculatedXp > 0 ? baseCalculatedXp : (practiceProgress?.xp ?? 0));

  // Beginner Path 3 stages
  const alphabetList = beginnerData?.alphabet || [];
  const alphabetCompleted = alphabetList.filter((l) => l.completed || completedIds.has(l.id)).length;

  const numbersList = beginnerData?.numbers || [];
  const numbersCompleted = numbersList.filter((l) => l.completed || completedIds.has(l.id)).length;

  const coreWordsList = beginnerData?.coreWords || beginnerData?.greetings || [];
  const coreWordsCompleted = coreWordsList.filter((l) => l.completed || completedIds.has(l.id)).length;

  const beginnerStages = [
    {
      to: "/learn/alphabet",
      stepNumber: "1",
      title: "Alphabet A-Z",
      subtitle: `${alphabetList.length} static handshapes`,
      countBadge: `${alphabetCompleted}/${alphabetList.length}`,
      completedCount: alphabetCompleted,
      totalCount: alphabetList.length,
    },
    {
      to: "/learn/numbers",
      stepNumber: "2",
      title: "Numbers 0-10",
      subtitle: `${numbersList.length} fundamental digits`,
      countBadge: `${numbersCompleted}/${numbersList.length}`,
      completedCount: numbersCompleted,
      totalCount: numbersList.length,
    },
    {
      to: "/learn/common-words",
      stepNumber: "3",
      title: "Core Words",
      subtitle: `${coreWordsList.length} essential signs`,
      countBadge: `${coreWordsCompleted}/${coreWordsList.length}`,
      completedCount: coreWordsCompleted,
      totalCount: coreWordsList.length,
    },
  ];

  if (!beginnerData?.all || beginnerData.all.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4">
            <AlertTriangle size={24} />
          </span>
          <h2 className="font-display text-lg font-bold text-ink">Failed to load curriculum</h2>
          <p className="mt-2 text-sm text-ink-muted">
            The lesson curriculum could not be initialized. Please reload to try again.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-6 inline-flex items-center gap-2">
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const quizHistory = getQuizHistory();
  const alphabetLessons = beginnerData?.alphabet || ALL_LESSONS.filter((l) => l.category === "alphabet");
  const numbersLessons = ALL_LESSONS.filter((l) => l.category === "numbers");
  const commonWordsLessons = ALL_LESSONS.filter((l) => l.category === "greetings");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Redesigned Top Hero: Progress Ring, Real Streak & XP, Accessible Stage Navigation */}
      <LearnHero
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalLessons={totalLessons}
        streakCount={streakCount}
        xpCount={xpCount}
        beginnerStages={beginnerStages}
      />

      {/* Winding Vertical Learning Path Like a Game Map */}
      <LearningPath
        allLessons={ALL_LESSONS}
        completedLessonIds={completedIds}
      />

      {/* Category Tracks with Looping Mini Hand Animation & 100% Celebratory Burst */}
      <CategoryCardsSection
        alphabetLessons={alphabetLessons}
        numbersLessons={numbersLessons}
        commonWordsLessons={commonWordsLessons}
        completedLessonIds={completedIds}
        practiceProgress={practiceProgress}
        quizHistory={quizHistory}
      />
    </div>
  );
}
