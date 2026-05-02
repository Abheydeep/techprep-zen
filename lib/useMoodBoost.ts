"use client";

import { useEffect } from "react";
import { createMoodBoost } from "./moodBoost";
import type { Difficulty } from "./types";
import { useTechPrepStore } from "./store";

export function useMoodBoost(
  failedAttempts: number,
  timeSpentSeconds: number,
  difficulty: Difficulty,
  keystrokes = 0
) {
  const setMoodBoost = useTechPrepStore((state) => state.setMoodBoost);
  const activeBoost = useTechPrepStore((state) => state.moodBoost);

  useEffect(() => {
    if (activeBoost) {
      return;
    }

    const boost = createMoodBoost(failedAttempts, timeSpentSeconds, difficulty, keystrokes);
    if (boost) {
      setMoodBoost(boost);
    }
  }, [activeBoost, difficulty, failedAttempts, keystrokes, setMoodBoost, timeSpentSeconds]);
}
