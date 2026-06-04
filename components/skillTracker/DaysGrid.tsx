"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { activeDay, isFutureDay, phaseForDay } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";

type DaysGridProps = {
  startDate: string;
  selectedDay: number;
  onSelect: (day: number) => void;
  dayPct: (day: number) => number;
};

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateFor(startDateIso: string, day: number): Date {
  const [y, m, d] = startDateIso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + day - 1);
  return date;
}

export function DaysGrid({ startDate, selectedDay, onSelect, dayPct }: DaysGridProps) {
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const active = activeDay(startDate);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [selectedDay]);

  const handleKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next = selectedDay;
    if (event.key === "ArrowLeft") next = Math.max(1, selectedDay - 1);
    if (event.key === "ArrowRight") next = Math.min(90, selectedDay + 1);
    if (event.key === "ArrowUp") next = Math.max(1, selectedDay - 5);
    if (event.key === "ArrowDown") next = Math.min(90, selectedDay + 5);
    if (event.key === "Home") next = 1;
    if (event.key === "End") next = 90;
    onSelect(next);
  };

  return (
    <div
      aria-label="90-day grid"
      className="zen-scrollbar grid max-h-[640px] grid-cols-5 gap-2 overflow-y-auto pr-1"
      onKeyDown={handleKey}
      role="grid"
      tabIndex={0}
    >
      {Array.from({ length: 90 }, (_, index) => {
        const day = index + 1;
        const phase = phaseForDay(day);
        const pct = dayPct(day);
        const future = isFutureDay(startDate, day);
        const isSelected = day === selectedDay;
        const isToday = day === active;
        const date = dateFor(startDate, day);
        return (
          <motion.button
            aria-current={isSelected ? "true" : undefined}
            aria-label={`Day ${day}, ${pct}% done${isToday ? ", today" : future ? ", future" : ""}`}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-0.5 rounded-[8px] border bg-paper px-1.5 py-2 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt",
              isSelected ? "border-ink shadow-calm" : "border-line hover:border-cobalt",
              pct === 100 ? "border-moss bg-moss/10" : "",
              future ? "opacity-55" : "",
              isToday ? "ring-1 ring-cobalt/40" : ""
            )}
            initial={false}
            key={day}
            onClick={() => onSelect(day)}
            ref={isSelected ? activeRef : undefined}
            role="gridcell"
            type="button"
            whileTap={{ scale: 0.96 }}
          >
            <span className="text-sm font-black leading-none text-ink">{day}</span>
            <span className="text-[10px] font-bold text-slate-500">
              {WEEKDAY[date.getDay()]} · {pct}%
            </span>
            <span
              className={cn(
                "mt-0.5 inline-flex rounded-full px-1.5 text-[9px] font-black uppercase",
                phase.id === 1
                  ? "bg-cobalt/10 text-cobalt"
                  : phase.id === 2
                    ? "bg-violet/10 text-violet"
                    : "bg-moss/10 text-moss"
              )}
            >
              P{phase.id}
            </span>
            {isToday ? (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 inline-block h-1.5 w-1.5 rounded-full bg-coral"
              />
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}
