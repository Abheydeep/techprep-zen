"use client";

import { motion } from "framer-motion";
import { Check, Clock3, MessageSquare } from "lucide-react";
import { useState } from "react";
import { TRACKS } from "../../lib/skillTracker";
import type { Task, TaskCompletion } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";

type TaskCardProps = {
  task: Task;
  completion?: TaskCompletion;
  locked: boolean;
  onToggle: () => void;
  onMinutes: (minutes: number | undefined) => void;
  onNote: (note: string) => void;
};

export function TaskCard({ task, completion, locked, onToggle, onMinutes, onNote }: TaskCardProps) {
  const track = TRACKS[task.track];
  const done = Boolean(completion);
  const [open, setOpen] = useState(false);
  const [minutesValue, setMinutesValue] = useState(
    completion?.minutesActual?.toString() ?? ""
  );
  const [noteValue, setNoteValue] = useState(completion?.note ?? "");

  const commitMinutes = (raw: string) => {
    setMinutesValue(raw);
    if (raw.trim() === "") {
      onMinutes(undefined);
      return;
    }
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 0 && parsed < 1000) {
      onMinutes(parsed);
    }
  };

  const commitNote = (raw: string) => {
    setNoteValue(raw);
    onNote(raw);
  };

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-[10px] border bg-paper p-3 shadow-calm transition",
        done ? "border-moss/60 bg-moss/5" : "border-line",
        locked ? "opacity-65" : ""
      )}
      initial={{ opacity: 0, y: 6 }}
      layout
      transition={{ duration: 0.18 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-normal",
                track.tone
              )}
            >
              {track.shortLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-line bg-panel px-2 py-0.5 text-[10px] font-black text-slate-500">
              <Clock3 size={11} aria-hidden="true" />
              {task.minutesPlanned}m
            </span>
            {completion?.minutesActual !== undefined ? (
              <span className="inline-flex items-center rounded-full bg-cobalt/10 px-2 py-0.5 text-[10px] font-black text-cobalt">
                logged {completion.minutesActual}m
              </span>
            ) : null}
            {completion?.note ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet/10 px-2 py-0.5 text-[10px] font-black text-violet">
                <MessageSquare size={11} aria-hidden="true" /> note
              </span>
            ) : null}
          </div>
          <h3
            className={cn(
              "mt-2 text-sm font-black leading-snug text-ink",
              done ? "line-through decoration-2 decoration-moss/60" : ""
            )}
          >
            {task.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{task.description}</p>
        </div>
        <div className="flex flex-col items-stretch gap-2">
          <button
            aria-pressed={done}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border px-3 text-xs font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
              done
                ? "border-moss bg-moss text-white"
                : "border-line bg-panel text-ink hover:border-cobalt",
              locked ? "cursor-not-allowed" : ""
            )}
            disabled={locked}
            onClick={onToggle}
            type="button"
          >
            <Check size={14} aria-hidden="true" />
            {done ? "Done" : "Mark done"}
          </button>
          <button
            aria-expanded={open}
            className="inline-flex h-7 items-center justify-center rounded-[6px] border border-line bg-panel px-2 text-[10px] font-black uppercase text-slate-500 transition hover:border-cobalt hover:text-cobalt focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? "Hide" : "Notes"}
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 grid gap-2 border-t border-line pt-3 sm:grid-cols-[120px_1fr]"
          initial={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.18 }}
        >
          <label className="text-xs font-black text-slate-500">
            Minutes actual
            <input
              className="mt-1 h-9 w-full rounded-[8px] border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
              inputMode="numeric"
              onChange={(event) => commitMinutes(event.target.value)}
              placeholder={String(task.minutesPlanned)}
              value={minutesValue}
            />
          </label>
          <label className="text-xs font-black text-slate-500">
            Reflection
            <textarea
              className="mt-1 min-h-[60px] w-full rounded-[8px] border border-line bg-panel px-2 py-1.5 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
              onChange={(event) => commitNote(event.target.value)}
              placeholder="What clicked, what stuck, what to retry tomorrow."
              value={noteValue}
            />
          </label>
        </motion.div>
      ) : null}
    </motion.article>
  );
}
