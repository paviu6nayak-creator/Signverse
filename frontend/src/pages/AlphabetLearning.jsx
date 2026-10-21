import { Type } from "lucide-react";

import LessonCategoryPage from "../components/lessons/LessonCategoryPage";

export default function AlphabetLearning() {
  return (
    <LessonCategoryPage
      category="alphabet"
      title="Alphabet"
      description="Master the manual alphabet, A through Z — the foundation for fingerspelling any word."
      icon={Type}
    />
  );
}
