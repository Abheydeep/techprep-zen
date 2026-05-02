import assert from "node:assert/strict";
import test from "node:test";
import { algorithmicProblems, curriculum, systemDesignModules } from "../lib/curriculum";
import { completeDailyItinerary, generateDailyItinerary } from "../lib/scheduler";
import type { UserProfile, UserProgress } from "../lib/types";
import { createMoodBoost } from "../lib/moodBoost";

const baseDate = new Date(2026, 4, 10);

function profile(patch: Partial<UserProfile> = {}): UserProfile {
  return {
    id: "admin-local",
    email: "abhey@techprep.local",
    displayName: "Abhey",
    currentStreak: 0,
    bestStreak: 0,
    streakRepairs: 0,
    totalStudyMinutes: 0,
    dailyLogs: {},
    ...patch
  };
}

function mastered(itemId: string, itemType: UserProgress["itemType"], date = "2026-05-05"): UserProgress {
  return {
    itemId,
    itemType,
    status: "MASTERED",
    timeSpentSeconds: 120,
    failedSubmissionsCount: 0,
    completedAt: date,
    masteredAt: date,
    lastAttemptDate: date
  };
}

test("daily cap returns cooldown itinerary", () => {
  const itinerary = generateDailyItinerary(
    profile({
      dailyLogs: {
        "2026-05-10": { date: "2026-05-10", minutesSpent: 180, completedItinerary: true }
      }
    }),
    {},
    curriculum,
    baseDate
  );

  assert.equal(itinerary.cooldownActive, true);
  assert.equal(itinerary.blocks[0].id, "daily-complete");
});

test("retrieval quizzes prefer items mastered three to seven days ago", () => {
  const module = systemDesignModules[0];
  const itinerary = generateDailyItinerary(
    profile(),
    {
      [module.id]: mastered(module.id, "system", "2026-05-05")
    },
    curriculum,
    baseDate
  );

  const retrieval = itinerary.blocks.find((block) => block.id === "retrieval");
  assert.ok(retrieval?.items.some((item) => item.type === "quiz" && item.quiz.relatedModuleId === module.id));
});

test("deep dive follows algorithm category ordering", () => {
  const arraysMastered = Object.fromEntries(
    algorithmicProblems
      .filter((problem) => problem.patternCategory === "Arrays & Hashing")
      .map((problem) => [problem.id, mastered(problem.id, "algorithm")])
  );
  const itinerary = generateDailyItinerary(profile(), arraysMastered, curriculum, baseDate);
  const deepDive = itinerary.blocks.find((block) => block.id === "deep-dive");
  const firstProblem = deepDive?.items.find((item) => item.type === "algorithm");

  assert.equal(firstProblem?.type, "algorithm");
  if (firstProblem?.type === "algorithm") {
    assert.equal(firstProblem.problem.patternCategory, "Two Pointers");
  }
});

test("new algorithm problems lock solution video until the 25-minute struggle window", () => {
  const itinerary = generateDailyItinerary(profile(), {}, curriculum, baseDate);
  const deepDive = itinerary.blocks.find((block) => block.id === "deep-dive");
  const algorithmItem = deepDive?.items.find((item) => item.type === "algorithm");

  assert.equal(algorithmItem?.type, "algorithm");
  if (algorithmItem?.type === "algorithm") {
    assert.equal(algorithmItem.isVideoLocked, true);
    assert.equal(algorithmItem.unlockAfterMinutes, 25);
  }
});

test("seven-day streak completion awards one streak repair", () => {
  const result = completeDailyItinerary(
    profile({
      currentStreak: 6,
      bestStreak: 6,
      dailyLogs: {
        "2026-05-09": { date: "2026-05-09", minutesSpent: 180, completedItinerary: true }
      }
    }),
    baseDate
  );

  assert.equal(result.earnedRepair, true);
  assert.equal(result.profile.currentStreak, 7);
  assert.equal(result.profile.streakRepairs, 1);
});

test("mood boost triggers after repeated failed attempts", () => {
  const boost = createMoodBoost(3, 10 * 60, "Hard", 20);

  assert.equal(boost?.id, "submission-reset");
  assert.match(boost?.body ?? "", /Hard-tier/);
});

test("mood boost normalizes idle time on medium and hard problems", () => {
  const boost = createMoodBoost(0, 25 * 60, "Medium", 0);

  assert.equal(boost?.id, "idle-normalizer");
});
