import { algorithmCategoryOrder } from "./curriculum";
import type {
  AlgorithmCategory,
  AlgorithmicProblem,
  Curriculum,
  DailyItinerary,
  SessionBlock,
  UserProfile,
  UserProgress
} from "./types";
import { addDays, formatDateKey } from "./utils";

const DAILY_LIMIT_MINUTES = 180;
const VIDEO_UNLOCK_MINUTES = 25;

export function generateDailyItinerary(
  profile: UserProfile,
  progress: Record<string, UserProgress>,
  curriculum: Curriculum,
  date = new Date()
): DailyItinerary {
  const dateKey = formatDateKey(date);
  const minutesLogged = profile.dailyLogs[dateKey]?.minutesSpent ?? 0;

  if (minutesLogged >= DAILY_LIMIT_MINUTES) {
    return {
      date: dateKey,
      totalMinutes: DAILY_LIMIT_MINUTES,
      minutesLogged,
      cooldownActive: true,
      blocks: [
        {
          id: "daily-complete",
          title: "Daily Goal Achieved",
          minutes: 0,
          cognitiveObjective: "Protect recovery after the full 180-minute preparation block.",
          items: []
        }
      ]
    };
  }

  const retrievalItems = [
    ...selectRetrievalQuizzes(progress, curriculum, date).map((quiz) => ({ type: "quiz" as const, quiz })),
    {
      type: "algorithm" as const,
      problem: selectRapidResolve(progress, curriculum.algorithmicProblems, date),
      isReview: true,
      isVideoLocked: false,
      unlockAfterMinutes: 0
    }
  ];

  const deepDiveItems = selectDeepDiveProblems(progress, curriculum.algorithmicProblems).map((problem) => ({
    type: "algorithm" as const,
    problem,
    isReview: false,
    isVideoLocked: true,
    unlockAfterMinutes: VIDEO_UNLOCK_MINUTES
  }));

  const architectureModule = selectSystemDesignModule(progress, curriculum);

  const blocks: SessionBlock[] = [
    {
      id: "retrieval",
      title: "Retrieval Practice",
      minutes: 30,
      cognitiveObjective: "Interrupt the forgetting curve with quizzes and one fast re-solve.",
      items: retrievalItems
    },
    {
      id: "deep-dive",
      title: "Algorithmic Deep Dive",
      minutes: 90,
      cognitiveObjective: "Build pattern recognition through one or two new NeetCode problems.",
      items: deepDiveItems
    },
    {
      id: "architecture",
      title: "Architecture Design",
      minutes: 60,
      cognitiveObjective: "Practice RESHADED thinking on one system design concept or case study.",
      items: architectureModule ? [{ type: "system", module: architectureModule }] : []
    }
  ];

  return {
    date: dateKey,
    totalMinutes: DAILY_LIMIT_MINUTES,
    minutesLogged,
    cooldownActive: false,
    blocks
  };
}

export function completeDailyItinerary(profile: UserProfile, date = new Date()) {
  const dateKey = formatDateKey(date);
  if (profile.dailyLogs[dateKey]?.completedItinerary) {
    return { profile, earnedRepair: false };
  }

  const yesterdayKey = formatDateKey(addDays(date, -1));
  const hadYesterday = profile.dailyLogs[yesterdayKey]?.completedItinerary === true;
  const currentStreak = hadYesterday ? profile.currentStreak + 1 : 1;
  const bestStreak = Math.max(profile.bestStreak, currentStreak);
  const earnedRepair = currentStreak > 0 && currentStreak % 7 === 0;

  return {
    profile: {
      ...profile,
      currentStreak,
      bestStreak,
      streakRepairs: profile.streakRepairs + (earnedRepair ? 1 : 0),
      totalStudyMinutes: Math.max(profile.totalStudyMinutes, 0) + DAILY_LIMIT_MINUTES,
      dailyLogs: {
        ...profile.dailyLogs,
        [dateKey]: {
          date: dateKey,
          minutesSpent: DAILY_LIMIT_MINUTES,
          completedItinerary: true
        }
      }
    },
    earnedRepair
  };
}

export function logStudyMinutes(profile: UserProfile, minutes: number, date = new Date()) {
  const dateKey = formatDateKey(date);
  const currentLog = profile.dailyLogs[dateKey] ?? {
    date: dateKey,
    minutesSpent: 0,
    completedItinerary: false
  };
  const nextMinutes = Math.min(DAILY_LIMIT_MINUTES, Math.max(0, currentLog.minutesSpent + minutes));

  return {
    ...profile,
    totalStudyMinutes: profile.totalStudyMinutes + Math.max(0, nextMinutes - currentLog.minutesSpent),
    dailyLogs: {
      ...profile.dailyLogs,
      [dateKey]: {
        ...currentLog,
        minutesSpent: nextMinutes,
        completedItinerary: currentLog.completedItinerary || nextMinutes >= DAILY_LIMIT_MINUTES
      }
    }
  };
}

function selectRetrievalQuizzes(progress: Record<string, UserProgress>, curriculum: Curriculum, date: Date) {
  const lowerKey = formatDateKey(addDays(date, -7));
  const upperKey = formatDateKey(addDays(date, -3));
  const completedItemIds = new Set(
    Object.values(progress)
      .filter((item) => item.status === "MASTERED")
      .filter((item) => {
        const completed = item.masteredAt ?? item.completedAt;
        return Boolean(completed && completed >= lowerKey && completed <= upperKey);
      })
      .map((item) => item.itemId)
  );

  const spacedQuizzes = curriculum.quizItems.filter((quiz) => completedItemIds.has(quiz.relatedModuleId));
  const fallbackQuizzes = curriculum.quizItems.filter((quiz) => !progress[quiz.id] || progress[quiz.id].status !== "MASTERED");
  return uniqueById([...spacedQuizzes, ...fallbackQuizzes]).slice(0, 5);
}

function selectRapidResolve(
  progress: Record<string, UserProgress>,
  problems: AlgorithmicProblem[],
  date: Date
): AlgorithmicProblem {
  const lowerKey = formatDateKey(addDays(date, -8));
  const upperKey = formatDateKey(addDays(date, -6));
  const reviewCandidate = problems.find((problem) => {
    const item = progress[problem.id];
    const completed = item?.masteredAt ?? item?.completedAt;
    return (
      problem.difficulty === "Easy" &&
      item?.status === "MASTERED" &&
      Boolean(completed && completed >= lowerKey && completed <= upperKey)
    );
  });

  return reviewCandidate ?? problems.find((problem) => problem.difficulty === "Easy") ?? problems[0];
}

function selectDeepDiveProblems(progress: Record<string, UserProgress>, problems: AlgorithmicProblem[]) {
  const category = selectNextAlgorithmCategory(progress, problems);
  const candidates = problems
    .filter((problem) => problem.patternCategory === category)
    .filter((problem) => progress[problem.id]?.status !== "MASTERED");

  const ordered = [...candidates].sort((a, b) => {
    const aProgress = progress[a.id]?.status === "IN_PROGRESS" ? -1 : 0;
    const bProgress = progress[b.id]?.status === "IN_PROGRESS" ? -1 : 0;
    return aProgress - bProgress || difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
  });

  return ordered.slice(0, ordered[0]?.difficulty === "Hard" ? 1 : 2);
}

function selectNextAlgorithmCategory(
  progress: Record<string, UserProgress>,
  problems: AlgorithmicProblem[]
): AlgorithmCategory {
  return (
    algorithmCategoryOrder.find((category) => {
      const categoryProblems = problems.filter((problem) => problem.patternCategory === category);
      return categoryProblems.some((problem) => progress[problem.id]?.status !== "MASTERED");
    }) ?? algorithmCategoryOrder[0]
  );
}

function selectSystemDesignModule(progress: Record<string, UserProgress>, curriculum: Curriculum) {
  return curriculum.systemDesignModules.find((module) => progress[module.id]?.status !== "MASTERED");
}

function difficultyRank(difficulty: AlgorithmicProblem["difficulty"]) {
  if (difficulty === "Easy") {
    return 0;
  }

  if (difficulty === "Medium") {
    return 1;
  }

  return 2;
}

function uniqueById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}
