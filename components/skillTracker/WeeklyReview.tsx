"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { weeklyRollup } from "../../lib/skillTracker";
import type { SkillTrackerState } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";

export function WeeklyReview({ state }: { state: SkillTrackerState }) {
  const rollups = useMemo(() => weeklyRollup(state), [state]);

  return (
    <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black text-ink">Weekly rollup</h3>
        <span className="text-xs font-bold text-slate-500">13 weeks · 90 days</span>
      </div>
      <div className="zen-scrollbar grid max-h-[280px] gap-2 overflow-y-auto pr-1">
        {rollups.map((week) => {
          const pct = week.total === 0 ? 0 : Math.round((week.done / week.total) * 100);
          const minutesPct =
            week.minutesPlanned === 0
              ? 0
              : Math.min(100, Math.round((week.minutesLogged / week.minutesPlanned) * 100));
          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-[8px] border bg-panel p-3",
                pct === 100 ? "border-moss/60" : "border-line"
              )}
              initial={{ opacity: 0, y: 4 }}
              key={week.week}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm text-ink">Week {week.week}</strong>
                <span className="text-xs font-black text-slate-500">{week.rangeLabel}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-black text-slate-500">Tasks</div>
                  <div className="mt-0.5 text-ink">
                    {week.done}/{week.total} · {pct}%
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-paper">
                    <div className="h-full rounded-full bg-cobalt" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="font-black text-slate-500">Minutes</div>
                  <div className="mt-0.5 text-ink">
                    {week.minutesLogged}/{week.minutesPlanned}
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-moss"
                      style={{ width: `${minutesPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
