import { Hash } from "lucide-react";

import LessonCategoryPage from "../components/lessons/LessonCategoryPage";

export default function NumbersLearning() {
  return (
    <LessonCategoryPage
      category="numbers"
      title="Numbers"
      description="Master ASL numbers from foundational digits 0–10 through tens, 2-digit combinations up to 99, 100, and 1000."
      icon={Hash}
    />
  );
}
