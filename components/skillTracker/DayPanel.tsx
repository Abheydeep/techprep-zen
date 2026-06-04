"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Lock } from "lucide-react";
import { useMemo } from "react";
import {
  TRACKS,
  dateForDay,
  isFutureDay,
  phaseForDay,
  planForDay
} from "../../lib/skillTracker";
import type { Task, TrackId } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";
import { useSkillTrackerStore } from "../../lib/skillTracker";
import { TaskCard } from "./TaskCard";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

type DayPanelProps = {
  selectedDay: number;
  onCelebrate: () => void;
};

export function DayPanel({ selectedDay, onCelebrate }: DayPanelProps) {
  const startDate = useSkillTrackerStore((state) => state.startDate);
  const completions = useSkillTrackerStore((state) => state.completions);
  const dayNote = useSkillTrackerStore((state) => state.dayNotes[selectedDay] ?? "");
  const toggleTask = useSkillTrackerStore((state) => state.toggleTask);
  const setTaskMinutes = useSkillTrackerStore((state) => state.setTaskMinutes);
  const setTaskNote = useSkillTrackerStore((state) => state.setTaskNote);
  const setDayNote = useSkillTrackerStore((state) => state.setDayNote);

  const plan = useMemo(() => planForDay(startDate, selectedDay), [startDate, selectedDay]);
  const date = dateForDay(startDate, selectedDay);
  const phase = phaseForDay(selectedDay);
  const locked = isFutureDay(startDate, selectedDay);

  const grouped = useMemo(() => {
    const buckets: Record<TrackId, Task[]> = {
      english: [],
      coding: [],
      website: [],
      express: [],
      interview: []
    };
    for (const task of plan.tasks) buckets[task.track].push(task);
    return buckets;
  }, [plan]);

  const doneCount = plan.tasks.filter((task) => completions[task.id]).length;
  const dayPct = plan.tasks.length === 0 ? 0 : Math.round((doneCount / plan.tasks.length) * 100);
  const minutesLogged = plan.tasks.reduce((sum, task) => {
    const c = completions[task.id];
    if (!c) return sum;
    return sum + (c.minutesActual ?? task.minutesPlanned);
  }, 0);

  const handleToggle = (task: Task) => {
    const wasDone = Boolean(completions[task.id]);
    toggleTask(task.id);
    if (!wasDone) {
      // After toggling, check if this completes the day.
      const futureDone = doneCount + 1;
      if (futureDone === plan.tasks.length) onCelebrate();
    }
  };

  return (
    <section className="rounded-[10px] border border-line bg-paper p-5 shadow-calm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal text-cobalt">
            <CalendarDays size={14} aria-hidden="true" />
            Phase {phase.id}: {phase.name}
          </p>
          <h2 className="mt-1 text-3xl font-black leading-tight text-ink">Day {selectedDay}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {formatDate(date)} · {plan.isWeekend ? "4-hour project session" : "2-hour weekday session"} ·{" "}
            {plan.totalMinutes} min planned
          </p>
          {locked ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-[8px] border border-coral/40 bg-coral/10 px-3 py-2 text-xs font-black text-coral">
              <Lock size={14} aria-hidden="true" />
              Future day locked. Inspect the plan; completion opens on today or past days.
            </div>
          ) : null}
        </div>
        <div className="min-w-[180px] rounded-[10px] border border-line bg-panel p-3">
          <div className="text-xs font-black uppercase text-slate-500">Day progress</div>
          <div className="mt-1 text-3xl font-black text-ink">{dayPct}%</div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-paper">
            <div
              className={cn("h-full rounded-full transition-[width] duration-300", dayPct === 100 ? "bg-moss" : "bg-cobalt")}
              style={{ width: `${dayPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-bold text-slate-500">
            {doneCount} of {plan.tasks.length} tasks · {minutesLogged}m logged
          </p>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {(Object.keys(TRACKS) as TrackId[]).map((trackKey) => {
          const tasks = grouped[trackKey];
          if (!tasks.length) return null;
          const meta = TRACKS[trackKey];
          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 6 }}
              key={trackKey}
              layout
              transition={{ duration: 0.18 }}
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-ink">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: meta.hex }}
                />
                {meta.label}
              </div>
              <div className="grid gap-2">
                {tasks.map((task) => (
                  <TaskCard
                    completion={completions[task.id]}
                    key={task.id}
                    locked={locked}
                    onMinutes={(value) => setTaskMinutes(task.id, value)}
                    onNote={(value) => setTaskNote(task.id, value)}
                    onToggle={() => handleToggle(task)}
                    task={task}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="mt-6 rounded-[10px] border border-line bg-panel p-3">
        <label className="text-xs font-black uppercase text-slate-500">
          Day reflection
          <textarea
            className="mt-2 min-h-[80px] w-full rounded-[8px] border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
            onChange={(event) => setDayNote(selectedDay, event.target.value)}
            placeholder="One paragraph: what worked, what slipped, what to change tomorrow."
            value={dayNote}
          />
        </label>
      </div>
    </section>
  );
}
