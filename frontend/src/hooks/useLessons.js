import { useCallback, useEffect, useState } from "react";
import { getLessons } from "../data/lessons";
import api from "../utils/api";

export function useLessons(category) {
  const initialLocalLessons = getLessons(category || "all");
  const [lessons, setLessons] = useState(initialLocalLessons);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const baseLessons = getLessons(category || "all");

    try {
      const { data } = await api.get("/lessons", { params: category ? { category } : {} });

      // Merge backend progress into base lessons
      const progressByLabel = new Map();
      const progressById = new Map();

      if (Array.isArray(data)) {
        data.forEach((p) => {
          if (p.id) progressById.set(String(p.id), p);
          if (p.title) progressByLabel.set(p.title.toLowerCase().trim(), p);
          if (p.sign_label) progressByLabel.set(p.sign_label.toLowerCase().trim(), p);
        });
      }

      const merged = baseLessons.map((lesson) => {
        const backendMatch =
          progressById.get(lesson.id) ||
          progressByLabel.get(lesson.label.toLowerCase().trim()) ||
          progressByLabel.get(lesson.label.replace(/^(letter|number)\s*/i, "").toLowerCase().trim());

        return {
          ...lesson,
          title: lesson.label, // ensure compatibility with title consumers
          xp_reward: lesson.xp, // ensure compatibility with backend schema
          completed: Boolean(backendMatch?.completed),
          accuracy: backendMatch?.accuracy ?? null,
          attempts: backendMatch?.attempts ?? 0,
        };
      });

      setLessons(merged);
    } catch (err) {
      // Graceful fallback to local single source of truth
      setLessons(baseLessons.map((l) => ({ ...l, title: l.label, xp_reward: l.xp })));
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  return { lessons, isLoading, error, refetch: fetchLessons };
}

