import {
  CODING_TOPICS,
  DSA_PROBLEMS,
  EXPRESS_PLAN,
  STAR_STORIES,
  SYSTEM_DESIGNS,
  WEBSITE_MISSIONS
} from "./content";
import { phaseForDay, TOTAL_DAYS } from "./tracks";
import type { DayPlan, Task, TaskKind, TrackId } from "./types";

// ---------- date helpers ----------

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIso(now: Date = new Date()): string {
  return toIsoDate(now);
}

export function addDays(date: Date, n: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

export function diffDays(later: Date, earlier: Date): number {
  const msPerDay = 86_400_000;
  const lateMidnight = new Date(later.getFullYear(), later.getMonth(), later.getDate()).getTime();
  const earlyMidnight = new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate()).getTime();
  return Math.round((lateMidnight - earlyMidnight) / msPerDay);
}

export function dateForDay(startDateIso: string, day: number): Date {
  return addDays(parseIsoDate(startDateIso), day - 1);
}

export function activeDay(startDateIso: string, now: Date = new Date()): number {
  const diff = diffDays(now, parseIsoDate(startDateIso)) + 1;
  if (diff < 1) return 1;
  if (diff > TOTAL_DAYS) return TOTAL_DAYS;
  return diff;
}

export function isFutureDay(startDateIso: string, day: number, now: Date = new Date()): boolean {
  return day > activeDay(startDateIso, now);
}

export function isWeekend(date: Date): boolean {
  const dow = date.getDay();
  return dow === 0 || dow === 6;
}

// ---------- task id ----------

export function taskId(day: number, kind: TaskKind, key: string): string {
  return `d${day}:${kind}:${key}`;
}

// ---------- per-track generators ----------

const weekdayEnglishFocus = {
  1: [
    "IELTS diagnostic: write 150 words about why Canada and score clarity, grammar, cohesion.",
    "Read one strong article and rewrite 5 sentences in clearer professional English.",
    "Record a 2-minute IELTS Part 2 cue card; replay and note filler words.",
    "Practice IELTS Listening section clips; write 5 new phrases in context.",
    "Write a Task 1 informal/semi-formal/formal letter outline in 10 minutes.",
    "Weekend IELTS mini-test: one Reading passage plus one Speaking Part 2 recording.",
    "Weekend writing lab: Task 2 opinion essay plan plus 250-word draft."
  ],
  2: [
    "Write a Task 2 essay paragraph with topic sentence, support, example, and conclusion.",
    "Do timed Reading: identify keywords, traps, and why wrong answers are wrong.",
    "Record IELTS Speaking Part 1 and remove filler words; repeat once cleaner.",
    "Write a professional status update on today's coding/PR task in 120 words.",
    "Practice Listening map/table completion and note spelling mistakes.",
    "Weekend full module: Task 1 letter plus self-review against IELTS criteria.",
    "Weekend speaking simulation: Parts 1, 2, 3 with 90-second self-debrief."
  ],
  3: [
    "Do one full timed IELTS section and log score, mistakes, and retry plan.",
    "Record a 3-minute senior-engineer project explanation; tighten it to 90 seconds.",
    "Write a Canadian-style cover-letter paragraph: collaborative, direct, evidence-led.",
    "Practice IELTS Task 2 under time; mark thesis clarity and examples.",
    "Run speaking fluency drill: answer 10 common questions without pausing over 3 seconds.",
    "Weekend full writing test: Task 1 + Task 2 with band-score self-review.",
    "Weekend final mock speaking: answer, review, repeat with fewer fillers."
  ]
} as const;

function makeEnglishTask(day: number, date: Date, weekend: boolean): Task {
  const phase = phaseForDay(day).id;
  const focus = weekdayEnglishFocus[phase][date.getDay()];
  const title =
    phase === 1
      ? `English: ${weekend ? "IELTS deep practice" : "CLB 9 foundation"}`
      : phase === 2
        ? "English: applied IELTS and work communication"
        : "English: CLB 9+ polish";
  return {
    id: taskId(day, "english", "main"),
    day,
    track: "english",
    kind: "english",
    title,
    description: focus,
    minutesPlanned: weekend ? 45 : 30
  };
}

function makeInterviewTask(day: number, date: Date, weekend: boolean): Task {
  const week = Math.floor((day - 1) / 7);
  const problemIndex = Math.min(day - 1, DSA_PROBLEMS.length - 1);

  if (weekend && date.getDay() === 0) {
    const design = SYSTEM_DESIGNS[week % SYSTEM_DESIGNS.length];
    return {
      id: taskId(day, "system-design", String(week)),
      day,
      track: "interview",
      kind: "system-design",
      title: `System design: ${design}`,
      description:
        "Use framework: requirements, scale, API, data model, high-level design, deep dive, trade-offs.",
      minutesPlanned: 45
    };
  }
  if (weekend && date.getDay() === 6) {
    const story = STAR_STORIES[week % STAR_STORIES.length];
    return {
      id: taskId(day, "behavioral", String(week)),
      day,
      track: "interview",
      kind: "behavioral",
      title: `STAR story: ${story}`,
      description:
        "Draft Situation, Task, Action, Result in 90 seconds; record once and fix rambling.",
      minutesPlanned: 30
    };
  }
  if (day % 5 === 0) {
    const story = STAR_STORIES[Math.floor(day / 5) % STAR_STORIES.length];
    return {
      id: taskId(day, "behavioral", `wk-${day}`),
      day,
      track: "interview",
      kind: "behavioral",
      title: `Behavioral drill: ${story}`,
      description: "Turn the proof point into a crisp 90-second product-company answer.",
      minutesPlanned: 25
    };
  }
  const problem = DSA_PROBLEMS[problemIndex];
  return {
    id: taskId(day, "dsa", String(problemIndex)),
    day,
    track: "interview",
    kind: "dsa",
    title: `DSA: ${problem[0]}`,
    description: `Solve in Java. Pattern: ${problem[1]}. Write 3-line reflection: pattern, stuck point, improvement.`,
    minutesPlanned: 35
  };
}

function makeCodingTask(day: number, date: Date, weekend: boolean): Task {
  const topic = CODING_TOPICS[(day - 1) % CODING_TOPICS.length];
  if (weekend && date.getDay() === 0) {
    return {
      id: taskId(day, "coding-deep", "main"),
      day,
      track: "coding",
      kind: "coding-deep",
      title: "Coding deep work: clean architecture drill",
      description: `${topic} Then write one before/after snippet from your own project.`,
      minutesPlanned: 90
    };
  }
  if (day % 7 === 0) {
    return {
      id: taskId(day, "coding-review", "ritual"),
      day,
      track: "coding",
      kind: "coding-review",
      title: "Code review ritual",
      description:
        "Review one AI-generated or old code block and annotate what you understand, what is risky, and what you would rewrite.",
      minutesPlanned: 30
    };
  }
  return {
    id: taskId(day, "coding-fundamentals", "main"),
    day,
    track: "coding",
    kind: "coding-fundamentals",
    title: "Coding fundamentals",
    description: topic,
    minutesPlanned: 30
  };
}

function countWeekendDaysBefore(startDateIso: string, day: number): number {
  let count = 0;
  for (let i = 1; i < day; i++) {
    if (isWeekend(dateForDay(startDateIso, i))) count++;
  }
  return count;
}

function makeWebsiteTask(day: number, date: Date, startDateIso: string): Task {
  const weekendIndex = countWeekendDaysBefore(startDateIso, day);
  const mission = WEBSITE_MISSIONS[weekendIndex % WEBSITE_MISSIONS.length];
  const isSaturday = date.getDay() === 6;
  return {
    id: taskId(day, "website", String(weekendIndex)),
    day,
    track: "website",
    kind: "website",
    title: `Website reconstruction: ${mission[0]}`,
    description: mission[1],
    minutesPlanned: isSaturday ? 120 : 60
  };
}

function makeWebsiteMini(day: number): Task {
  const mission = WEBSITE_MISSIONS[Math.floor(day / 6) % WEBSITE_MISSIONS.length];
  return {
    id: taskId(day, "website", `mini-${day}`),
    day,
    track: "website",
    kind: "website",
    title: `Mini website audit: ${mission[0]}`,
    description: mission[1],
    minutesPlanned: 30
  };
}

function makeExpressTask(day: number, date: Date, weekend: boolean): Task {
  let text = EXPRESS_PLAN[Math.min(day - 1, EXPRESS_PLAN.length - 1)];
  if (date.getDay() === 3 && day > 20) {
    text =
      "Wednesday PR habit: check IRCC draw results, log draw type/cutoff/invitations, and update CRS risk note.";
  }
  return {
    id: taskId(day, "express", "main"),
    day,
    track: "express",
    kind: "express",
    title: "Express Entry",
    description: text,
    minutesPlanned: weekend ? 45 : 25
  };
}

// ---------- composed plan ----------

export function planForDay(startDateIso: string, day: number): DayPlan {
  const date = dateForDay(startDateIso, day);
  const weekend = isWeekend(date);
  const tasks: Task[] = [];

  if (weekend) {
    if (date.getDay() === 6) {
      tasks.push(makeWebsiteTask(day, date, startDateIso));
      tasks.push(makeEnglishTask(day, date, true));
      tasks.push(makeExpressTask(day, date, true));
      tasks.push(makeInterviewTask(day, date, true));
    } else {
      tasks.push(makeCodingTask(day, date, true));
      tasks.push(makeWebsiteTask(day, date, startDateIso));
      tasks.push(makeExpressTask(day, date, true));
      tasks.push(makeInterviewTask(day, date, true));
    }
  } else {
    tasks.push(makeInterviewTask(day, date, false));
    tasks.push(makeEnglishTask(day, date, false));
    tasks.push(makeExpressTask(day, date, false));
    if (day % 6 === 0) {
      tasks.push(makeWebsiteMini(day));
    } else {
      tasks.push(makeCodingTask(day, date, false));
    }
  }

  return {
    day,
    phase: phaseForDay(day).id,
    isWeekend: weekend,
    tasks,
    totalMinutes: tasks.reduce((sum, task) => sum + task.minutesPlanned, 0)
  };
}

export function fullPlan(startDateIso: string): DayPlan[] {
  const plan: DayPlan[] = [];
  for (let day = 1; day <= TOTAL_DAYS; day++) {
    plan.push(planForDay(startDateIso, day));
  }
  return plan;
}

export function allTasks(startDateIso: string): Task[] {
  return fullPlan(startDateIso).flatMap((day) => day.tasks);
}

export function groupTasksByTrack(tasks: Task[]): Record<TrackId, Task[]> {
  const empty: Record<TrackId, Task[]> = {
    english: [],
    coding: [],
    website: [],
    express: [],
    interview: []
  };
  for (const task of tasks) empty[task.track].push(task);
  return empty;
}
