"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { curriculum } from "./curriculum";
import { completeDailyItinerary, logStudyMinutes } from "./scheduler";
import type {
  DailyItinerary,
  Difficulty,
  MoodBoostIntervention,
  ProgressStatus,
  StudyItemType,
  UserProfile,
  UserProgress
} from "./types";
import { formatDateKey } from "./utils";

const ADMIN_EMAIL = "abhey@techprep.local";
const ADMIN_PASSCODE = "zen180";

type ViewMode = "dashboard" | "roadmap" | "dsa" | "system" | "quiz" | "resources";

type TechPrepState = {
  authenticated: boolean;
  profile: UserProfile;
  progress: Record<string, UserProgress>;
  activeView: ViewMode;
  selectedAlgorithmId: string;
  selectedSystemId: string;
  selectedQuizId: string;
  zenMode: boolean;
  sessionSeconds: number;
  failedAttempts: number;
  keystrokes: number;
  moodBoost?: MoodBoostIntervention;
  lastCelebration?: string;
  authenticate: (email: string, passcode: string) => boolean;
  signOut: () => void;
  setActiveView: (view: ViewMode) => void;
  selectAlgorithm: (id: string) => void;
  selectSystem: (id: string) => void;
  selectQuiz: (id: string) => void;
  toggleZenMode: () => void;
  recordKeystroke: () => void;
  tickSession: (seconds: number) => void;
  logMinutes: (minutes: number) => void;
  completeDailySession: () => boolean;
  markProgress: (itemId: string, itemType: StudyItemType, status: ProgressStatus) => void;
  registerSubmission: (success: boolean) => void;
  answerQuiz: (quizId: string, correct: boolean) => void;
  setMoodBoost: (boost?: MoodBoostIntervention) => void;
  resetFriction: () => void;
};

export const defaultProfile: UserProfile = {
  id: "admin-local",
  email: ADMIN_EMAIL,
  displayName: "Abhey",
  currentStreak: 0,
  bestStreak: 0,
  streakRepairs: 0,
  totalStudyMinutes: 0,
  dailyLogs: {}
};

export const useTechPrepStore = create<TechPrepState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      profile: defaultProfile,
      progress: {},
      activeView: "dashboard",
      selectedAlgorithmId: curriculum.algorithmicProblems[0].id,
      selectedSystemId: curriculum.systemDesignModules[0].id,
      selectedQuizId: curriculum.quizItems[0].id,
      zenMode: false,
      sessionSeconds: 0,
      failedAttempts: 0,
      keystrokes: 0,
      authenticate: (email, passcode) => {
        const ok = email.trim().toLowerCase() === ADMIN_EMAIL && passcode === ADMIN_PASSCODE;
        if (ok) {
          set({ authenticated: true });
        }

        return ok;
      },
      signOut: () => set({ authenticated: false, zenMode: false, activeView: "dashboard" }),
      setActiveView: (activeView) => set({ activeView }),
      selectAlgorithm: (selectedAlgorithmId) =>
        set({ selectedAlgorithmId, activeView: "dsa", failedAttempts: 0, keystrokes: 0, sessionSeconds: 0 }),
      selectSystem: (selectedSystemId) => set({ selectedSystemId, activeView: "system", sessionSeconds: 0 }),
      selectQuiz: (selectedQuizId) => set({ selectedQuizId, activeView: "quiz" }),
      toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
      recordKeystroke: () => set((state) => ({ keystrokes: state.keystrokes + 1 })),
      tickSession: (seconds) => set((state) => ({ sessionSeconds: state.sessionSeconds + seconds })),
      logMinutes: (minutes) => set((state) => ({ profile: logStudyMinutes(state.profile, minutes) })),
      completeDailySession: () => {
        const result = completeDailyItinerary(get().profile);
        set({
          profile: result.profile,
          lastCelebration: result.earnedRepair ? "repair-earned" : "daily-complete"
        });
        return result.earnedRepair;
      },
      markProgress: (itemId, itemType, status) =>
        set((state) => {
          const current = state.progress[itemId];
          const now = formatDateKey();
          return {
            progress: {
              ...state.progress,
              [itemId]: {
                itemId,
                itemType,
                status,
                timeSpentSeconds: current?.timeSpentSeconds ?? 0,
                failedSubmissionsCount: current?.failedSubmissionsCount ?? 0,
                lastAttemptDate: now,
                completedAt: status === "MASTERED" ? current?.completedAt ?? now : current?.completedAt,
                masteredAt: status === "MASTERED" ? current?.masteredAt ?? now : current?.masteredAt,
                notes: current?.notes
              }
            }
          };
        }),
      registerSubmission: (success) =>
        set((state) => {
          const itemId = state.selectedAlgorithmId;
          const current = state.progress[itemId];
          const now = formatDateKey();
          const failedSubmissionsCount = success ? current?.failedSubmissionsCount ?? 0 : (current?.failedSubmissionsCount ?? 0) + 1;
          return {
            failedAttempts: success ? 0 : state.failedAttempts + 1,
            progress: {
              ...state.progress,
              [itemId]: {
                itemId,
                itemType: "algorithm",
                status: success ? "MASTERED" : "IN_PROGRESS",
                timeSpentSeconds: (current?.timeSpentSeconds ?? 0) + state.sessionSeconds,
                failedSubmissionsCount,
                lastAttemptDate: now,
                completedAt: success ? current?.completedAt ?? now : current?.completedAt,
                masteredAt: success ? current?.masteredAt ?? now : current?.masteredAt,
                notes: current?.notes
              }
            },
            lastCelebration: success ? "algorithm-mastered" : state.lastCelebration
          };
        }),
      answerQuiz: (quizId, correct) =>
        set((state) => {
          const current = state.progress[quizId];
          const now = formatDateKey();
          return {
            progress: {
              ...state.progress,
              [quizId]: {
                itemId: quizId,
                itemType: "quiz",
                status: correct ? "MASTERED" : "IN_PROGRESS",
                timeSpentSeconds: current?.timeSpentSeconds ?? 0,
                failedSubmissionsCount: correct ? current?.failedSubmissionsCount ?? 0 : (current?.failedSubmissionsCount ?? 0) + 1,
                lastAttemptDate: now,
                completedAt: correct ? current?.completedAt ?? now : current?.completedAt,
                masteredAt: correct ? current?.masteredAt ?? now : current?.masteredAt,
                notes: current?.notes
              }
            }
          };
        }),
      setMoodBoost: (moodBoost) => set({ moodBoost }),
      resetFriction: () => set({ failedAttempts: 0, keystrokes: 0, sessionSeconds: 0, moodBoost: undefined })
    }),
    {
      name: "techprep-zen:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authenticated: state.authenticated,
        profile: state.profile,
        progress: state.progress,
        selectedAlgorithmId: state.selectedAlgorithmId,
        selectedSystemId: state.selectedSystemId,
        selectedQuizId: state.selectedQuizId
      })
    }
  )
);

export function difficultyTone(difficulty: Difficulty) {
  if (difficulty === "Easy") {
    return "text-moss bg-moss/10 border-moss/20";
  }

  if (difficulty === "Medium") {
    return "text-cobalt bg-cobalt/10 border-cobalt/20";
  }

  return "text-coral bg-coral/10 border-coral/20";
}

export function selectTodayMinutes(profile: UserProfile) {
  return profile.dailyLogs[formatDateKey()]?.minutesSpent ?? 0;
}

export function itineraryProblemIds(itinerary: DailyItinerary) {
  return itinerary.blocks.flatMap((block) =>
    block.items.flatMap((item) => (item.type === "algorithm" ? [item.problem.id] : []))
  );
}
