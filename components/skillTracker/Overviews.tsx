"use client";

import { PHASES, TRACKS } from "../../lib/skillTracker";
import type { PhaseId, TrackId } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";

type PhaseOverviewProps = {
  byPhase: Record<PhaseId, { done: number; total: number }>;
};

export function PhaseOverview({ byPhase }: PhaseOverviewProps) {
  return (
    <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black text-ink">Phase overview</h3>
        <span className="text-xs font-bold text-slate-500">30 days each</span>
      </div>
      <div className="grid gap-2">
        {PHASES.map((phase) => {
          const stats = byPhase[phase.id];
          const pct = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
          return (
            <div
              className="rounded-[8px] border border-line bg-panel p-3"
              key={phase.id}
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm text-ink">
                  Phase {phase.id}: {phase.name}
                </strong>
                <span className="text-xs font-black text-slate-500">{pct}%</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Days {phase.range[0]}–{phase.range[1]} · {phase.description}
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-paper">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-300",
                    phase.id === 1 ? "bg-cobalt" : phase.id === 2 ? "bg-violet" : "bg-moss"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TrackProgressProps = {
  byTrack: Record<TrackId, { done: number; total: number }>;
};

export function TrackProgress({ byTrack }: TrackProgressProps) {
  return (
    <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black text-ink">Track progress</h3>
        <span className="text-xs font-bold text-slate-500">Five parallel lanes</span>
      </div>
      <div className="grid gap-2">
        {(Object.keys(TRACKS) as TrackId[]).map((id) => {
          const meta = TRACKS[id];
          const stats = byTrack[id];
          const pct = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
          return (
            <div className="rounded-[8px] border border-line bg-panel p-3" key={id}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-black text-ink">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: meta.hex }}
                  />
                  {meta.label}
                </span>
                <span className="text-xs font-black text-slate-500">
                  {stats.done}/{stats.total} · {pct}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-paper">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{ width: `${pct}%`, background: meta.hex }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
