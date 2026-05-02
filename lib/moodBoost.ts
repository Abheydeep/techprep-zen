import type { Difficulty, MoodBoostIntervention } from "./types";

export function createMoodBoost(
  failedAttempts: number,
  timeSpentSeconds: number,
  difficulty: Difficulty,
  keystrokes = 0
): MoodBoostIntervention | undefined {
  const minutes = Math.floor(timeSpentSeconds / 60);

  if (failedAttempts >= 3 && minutes <= 15) {
    return {
      id: "submission-reset",
      title: "Reset the loop",
      body:
        difficulty === "Hard"
          ? "Take a breath. This is a Hard-tier problem, and three misses usually means the invariant needs a rewrite, not that you are behind. Step back, name the state, then ask for one conceptual hint."
          : "Three misses is useful signal. The code is telling you where the invariant is fuzzy. Pause the keyboard for one minute, trace the smallest failing case, and resume from the state update.",
      actionLabel: "Show a conceptual hint",
      intensity: "reset"
    };
  }

  if ((difficulty === "Medium" || difficulty === "Hard") && timeSpentSeconds >= 25 * 60 && keystrokes === 0) {
    return {
      id: "idle-normalizer",
      title: "This struggle is expected",
      body:
        "You have been mapping the problem for 25 minutes. That is normal for this tier. Senior engineers often spend the first half of a hard problem choosing the right representation before writing code.",
      actionLabel: "Take a guided hint",
      intensity: "gentle"
    };
  }

  return undefined;
}
