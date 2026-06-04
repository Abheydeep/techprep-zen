export type TrackId = "english" | "coding" | "website" | "express" | "interview";

export type PhaseId = 1 | 2 | 3;

export type TaskKind =
  | "english"
  | "coding-fundamentals"
  | "coding-review"
  | "coding-deep"
  | "website"
  | "express"
  | "dsa"
  | "system-design"
  | "behavioral";

export type Task = {
  /** Stable id, deterministic from (day, key). */
  id: string;
  day: number;
  track: TrackId;
  kind: TaskKind;
  title: string;
  description: string;
  minutesPlanned: number;
};

export type TrackMeta = {
  id: TrackId;
  label: string;
  shortLabel: string;
  tone: string;
  hex: string;
  description: string;
};

export type Phase = {
  id: PhaseId;
  name: string;
  range: [number, number];
  description: string;
};

export type DayPlan = {
  day: number;
  phase: PhaseId;
  isWeekend: boolean;
  tasks: Task[];
  totalMinutes: number;
};

export type TaskCompletion = {
  taskId: string;
  completedAt: string;
  minutesActual?: number;
  note?: string;
};

export type ApplicationStage = "Applied" | "OA" | "Interview" | "Offer" | "Rejected";

export type Application = {
  id: string;
  company: string;
  role: string;
  date: string;
  stage: ApplicationStage;
  link?: string;
  note?: string;
};

export type SkillTrackerState = {
  schemaVersion: 1;
  /** ISO yyyy-mm-dd that day 1 maps to. */
  startDate: string;
  /** Per-task completion. */
  completions: Record<string, TaskCompletion>;
  /** Per-day free-form note. */
  dayNotes: Record<number, string>;
  /** Document checklist by index. */
  docs: Record<number, boolean>;
  /** Job applications. */
  applications: Application[];
  /** Stored last selected day so refresh keeps focus. */
  lastSelectedDay: number;
  /** Search query persisted between sessions. */
  searchQuery: string;
  /** Whether the user has dismissed the onboarding banner. */
  onboardingDismissed: boolean;
};

export type SkillTrackerActions = {
  setStartDate: (iso: string) => void;
  toggleTask: (taskId: string) => void;
  setTaskMinutes: (taskId: string, minutes: number | undefined) => void;
  setTaskNote: (taskId: string, note: string) => void;
  setDayNote: (day: number, note: string) => void;
  toggleDoc: (index: number) => void;
  addApplication: (input: Omit<Application, "id">) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  removeApplication: (id: string) => void;
  setLastSelectedDay: (day: number) => void;
  setSearchQuery: (query: string) => void;
  dismissOnboarding: () => void;
  resetAll: () => void;
  importState: (next: SkillTrackerState) => void;
};

export type SkillTrackerStore = SkillTrackerState & SkillTrackerActions;
