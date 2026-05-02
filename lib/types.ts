export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProgressStatus = "UNATTEMPTED" | "IN_PROGRESS" | "MASTERED";

export type AlgorithmCategory =
  | "Arrays & Hashing"
  | "Two Pointers"
  | "Sliding Window"
  | "Stack"
  | "Binary Search"
  | "Linked List"
  | "Trees"
  | "Tries"
  | "Heap / Priority Queue"
  | "Backtracking"
  | "Graphs"
  | "Advanced Graphs"
  | "1-D Dynamic Programming"
  | "2-D Dynamic Programming"
  | "Greedy"
  | "Intervals"
  | "Math & Geometry"
  | "Bit Manipulation";

export type SystemDesignCategory =
  | "Foundations"
  | "Databases"
  | "Scaling"
  | "Messaging"
  | "Reliability"
  | "Security"
  | "Case Studies";

export type StudyItemType = "algorithm" | "system" | "quiz";

export type QuizOption = {
  id: string;
  label: string;
};

export type AlgorithmicProblem = {
  id: string;
  title: string;
  patternCategory: AlgorithmCategory;
  patternTags: string[];
  difficulty: Difficulty;
  prepScore: number;
  leetcodeUrl: string;
  embeddedVideoUrl: string;
  markdownDescription: string;
  starterCode: string;
  optimalSolution: string;
  pseudoTests: string[];
  hints: string[];
};

export type SystemDesignModule = {
  id: string;
  title: string;
  frameworkCategory: SystemDesignCategory;
  senioritySignal: "L3 fundamentals" | "L4/L5 trade-offs" | "L6+ ambiguity";
  estimatedMinutes: number;
  resourceUrl: string;
  videoUrl?: string;
  architectureDiagramUrl?: string;
  markdownContent: string;
  reshadedChecklist: string[];
};

export type QuizItem = {
  id: string;
  relatedModuleId: string;
  relatedItemType: Exclude<StudyItemType, "quiz">;
  questionText: string;
  options: QuizOption[];
  correctAnswerIndex: number;
  educationalExplanation: string;
};

export type UserProgress = {
  itemId: string;
  itemType: StudyItemType;
  status: ProgressStatus;
  timeSpentSeconds: number;
  failedSubmissionsCount: number;
  lastAttemptDate?: string;
  completedAt?: string;
  masteredAt?: string;
  notes?: string;
};

export type DailySessionLog = {
  date: string;
  minutesSpent: number;
  completedItinerary: boolean;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  currentStreak: number;
  bestStreak: number;
  streakRepairs: number;
  totalStudyMinutes: number;
  dailyLogs: Record<string, DailySessionLog>;
};

export type Curriculum = {
  algorithmicProblems: AlgorithmicProblem[];
  systemDesignModules: SystemDesignModule[];
  quizItems: QuizItem[];
};

export type ItineraryItem =
  | {
      type: "quiz";
      quiz: QuizItem;
    }
  | {
      type: "algorithm";
      problem: AlgorithmicProblem;
      isReview: boolean;
      isVideoLocked: boolean;
      unlockAfterMinutes: number;
    }
  | {
      type: "system";
      module: SystemDesignModule;
    };

export type SessionBlock = {
  id: "retrieval" | "deep-dive" | "architecture" | "daily-complete";
  title: string;
  minutes: number;
  cognitiveObjective: string;
  items: ItineraryItem[];
};

export type DailyItinerary = {
  date: string;
  totalMinutes: 180;
  minutesLogged: number;
  cooldownActive: boolean;
  blocks: SessionBlock[];
};

export type MoodBoostIntervention = {
  id: string;
  title: string;
  body: string;
  actionLabel: string;
  intensity: "gentle" | "reset";
};
