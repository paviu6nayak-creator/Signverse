import { MessageCircle } from "lucide-react";

import LessonCategoryPage from "../components/lessons/LessonCategoryPage";
import { getLessons } from "../data/lessons";

export default function CommonWords() {
  const commonLessons = getLessons("greetings");
  const totalCount = commonLessons.length;
  const uniqueThemes = new Set(commonLessons.map((l) => l.theme).filter(Boolean)).size;

  return (
    <LessonCategoryPage
      category="greetings"
      title="Common Words & Greetings"
      description={`${totalCount} core vocabulary signs and conversational phrases structured across ${uniqueThemes} progressive themes.`}
      icon={MessageCircle}
    />
  );
}
