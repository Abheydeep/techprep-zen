import { allTasks, activeDay, fullPlan, planForDay } from "./plan";
import type { PhaseId, SkillTrackerState, Task, TrackId } from "./types";

export type DayProgress = {
  done: number;
  total: number;
  pct: number;
  minutesPlanned: number;
  minutesLogged: number;
};

export function dayProgress(state: SkillTrackerState, day: number): DayProgress {
  const plan = planForDay(state.startDate, day);
  let done = 0;
  let minutesLogged = 0;
  for (const task of plan.tasks) {
    const completion = state.completions[task.id];
    if (completion) {
      done++;
      minutesLogged += completion.minutesActual ?? task.minutesPlanned;
    }
  }
  return {
    done,
    total: plan.tasks.length,
    pct: plan.tasks.length === 0 ? 0 : Math.round((done / plan.tasks.length) * 100),
    minutesPlanned: plan.totalMinutes,
    minutesLogged
  };
}

export function overallStats(state: SkillTrackerState) {
  const tasks = allTasks(state.startDate);
  const done = tasks.filter((task) => state.completions[task.id]).length;
  const minutesLogged = tasks.reduce((sum, task) => {
    const completion = state.completions[task.id];
    if (!completion) return sum;
    return sum + (completion.minutesActual ?? task.minutesPlanned);
  }, 0);
  const minutesPlanned = tasks.reduce((sum, task) => sum + task.minutesPlanned, 0);
  return {
    done,
    total: tasks.length,
    pct: tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100),
    minutesLogged,
    minutesPlanned
  };
}

export function streak(state: SkillTrackerState, now: Date = new Date()): number {
  const active = activeDay(state.startDate, now);
  let endDay = active;
  if (active > 0 && dayProgress(state, active).pct !== 100) endDay = active - 1;
  let count = 0;
  for (let day = endDay; day >= 1; day--) {
    if (dayProgress(state, day).pct === 100) count++;
    else break;
  }
  return count;
}

export function trackProgress(state: SkillTrackerState) {
  const tasks = allTasks(state.startDate);
  const buckets: Record<TrackId, { done: number; total: number }> = {
    english: { done: 0, total: 0 },
    coding: { done: 0, total: 0 },
    website: { done: 0, total: 0 },
    express: { done: 0, total: 0 },
    interview: { done: 0, total: 0 }
  };
  for (const task of tasks) {
    buckets[task.track].total++;
    if (state.completions[task.id]) buckets[task.track].done++;
  }
  return buckets;
}

export function phaseProgress(state: SkillTrackerState) {
  const tasks = allTasks(state.startDate);
  const buckets: Record<PhaseId, { done: number; total: number }> = {
    1: { done: 0, total: 0 },
    2: { done: 0, total: 0 },
    3: { done: 0, total: 0 }
  };
  for (const task of tasks) {
    const phase: PhaseId = task.day <= 30 ? 1 : task.day <= 60 ? 2 : 3;
    buckets[phase].total++;
    if (state.completions[task.id]) buckets[phase].done++;
  }
  return buckets;
}

export type WeeklyRollup = {
  week: number;
  rangeLabel: string;
  done: number;
  total: number;
  minutesLogged: number;
  minutesPlanned: number;
};

export function weeklyRollup(state: SkillTrackerState): WeeklyRollup[] {
  const plan = fullPlan(state.startDate);
  const weeks: WeeklyRollup[] = [];
  for (let w = 0; w < 13; w++) {
    const slice = plan.slice(w * 7, w * 7 + 7);
    if (!slice.length) break;
    let done = 0;
    let total = 0;
    let minutesLogged = 0;
    let minutesPlanned = 0;
    for (const dayPlan of slice) {
      total += dayPlan.tasks.length;
      minutesPlanned += dayPlan.totalMinutes;
      for (const task of dayPlan.tasks) {
        const completion = state.completions[task.id];
        if (completion) {
          done++;
          minutesLogged += completion.minutesActual ?? task.minutesPlanned;
        }
      }
    }
    weeks.push({
      week: w + 1,
      rangeLabel: `Day ${slice[0].day}-${slice[slice.length - 1].day}`,
      done,
      total,
      minutesLogged,
      minutesPlanned
    });
  }
  return weeks;
}

export function searchTasks(state: SkillTrackerState, query: string): Task[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tasks = allTasks(state.startDate);
  return tasks
    .filter((task) =>
      task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q)
    )
    .slice(0, 50);
}

export function documentProgress(state: SkillTrackerState, total: number) {
  const done = Object.values(state.docs).filter(Boolean).length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}
