"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  CalendarPlus,
  FileText,
  RefreshCcw,
  Sparkles,
  Zap
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DOCUMENT_CHECKLIST,
  activeDay,
  dayProgress,
  exportCsv,
  exportIcs,
  exportJson,
  overallStats,
  phaseProgress,
  streak,
  todayIso,
  trackProgress,
  useSkillTrackerStore
} from "../../lib/skillTracker";
import { ApplicationTracker } from "./ApplicationTracker";
import { DayPanel } from "./DayPanel";
import { DaysGrid } from "./DaysGrid";
import { DocumentChecklist } from "./DocumentChecklist";
import { HeroStats } from "./HeroStats";
import { PhaseOverview, TrackProgress } from "./Overviews";
import { SearchBar } from "./SearchBar";
import { Toast } from "./Toast";
import { WeeklyReview } from "./WeeklyReview";
import { useToast } from "./useToast";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function SkillTracker() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const state = useSkillTrackerStore();
  const { toast, show } = useToast();

  const selectedDay = state.lastSelectedDay;
  const setSelectedDay = state.setLastSelectedDay;

  // Snap selection to "today" the first time we hydrate, so a session starts focused.
  useEffect(() => {
    if (!hydrated) return;
    if (state.lastSelectedDay <= 0) {
      setSelectedDay(activeDay(state.startDate));
    }
  }, [hydrated, state.lastSelectedDay, state.startDate, setSelectedDay]);

  const overall = useMemo(() => overallStats(state), [state]);
  const byTrack = useMemo(() => trackProgress(state), [state]);
  const byPhase = useMemo(() => phaseProgress(state), [state]);
  const streakDays = useMemo(() => streak(state), [state]);
  const dayPct = useCallback((day: number) => dayProgress(state, day).pct, [state]);

  const celebrate = useCallback(() => {
    confetti({ particleCount: 90, spread: 65, scalar: 0.85, origin: { y: 0.78 } });
    show("Day complete. Banked.");
  }, [show]);

  const jumpToToday = () => {
    const today = activeDay(state.startDate);
    setSelectedDay(today);
    show(`Jumped to day ${today}`, "info");
  };

  const handleExportJson = () => {
    download(`skill-tracker-${todayIso()}.json`, exportJson(state), "application/json");
    show("JSON exported.");
  };

  const handleExportCsv = () => {
    download(`skill-tracker-${todayIso()}.csv`, exportCsv(state), "text/csv;charset=utf-8");
    show("CSV exported.");
  };

  const handleExportIcs = () => {
    download(`skill-tracker-${todayIso()}.ics`, exportIcs(state), "text/calendar;charset=utf-8");
    show("Calendar (.ics) exported.", "info");
  };

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(
        "Reset every task, document, application, and note for the 90-day tracker?"
      );
      if (!ok) return;
    }
    state.resetAll();
    setSelectedDay(1);
    show("Fresh start. Day 1 is waiting.", "info");
  };

  // While Zustand rehydrates from localStorage we render a skeleton to keep SSR/CSR consistent.
  if (!hydrated) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="rounded-[10px] border border-line bg-paper px-5 py-3 text-sm font-black text-slate-500 shadow-calm">
          Loading skill tracker…
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-[10px] border border-line bg-paper p-5 shadow-calm">
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-normal text-moss">
              <Sparkles size={14} aria-hidden="true" /> 90-day rebuild command center
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">
              Five lanes. Ninety days. Receipts for every claim.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              English/IELTS, coding fundamentals, website reconstruction, Express Entry, and
              interview readiness — generated against your real projects and reviewed for
              consistency every Saturday.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-ink px-3 text-xs font-black text-white transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                onClick={jumpToToday}
                type="button"
              >
                <Zap size={14} aria-hidden="true" /> Jump to today
              </button>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line bg-paper px-3 text-xs font-black text-ink transition hover:border-cobalt focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                onClick={handleExportJson}
                type="button"
              >
                <ArrowDownToLine size={14} aria-hidden="true" /> Export JSON
              </button>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line bg-paper px-3 text-xs font-black text-ink transition hover:border-cobalt focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                onClick={handleExportCsv}
                type="button"
              >
                <FileText size={14} aria-hidden="true" /> Export CSV
              </button>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line bg-paper px-3 text-xs font-black text-ink transition hover:border-cobalt focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                onClick={handleExportIcs}
                type="button"
              >
                <CalendarPlus size={14} aria-hidden="true" /> Export .ics
              </button>
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-coral/40 bg-coral/10 px-3 text-xs font-black text-coral transition hover:border-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                onClick={handleReset}
                type="button"
              >
                <RefreshCcw size={14} aria-hidden="true" /> Reset
              </button>
            </div>
            <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-[8px] border border-line bg-panel p-2">
              <label className="text-xs font-black text-slate-500">
                Start date
                <input
                  className="ml-2 h-8 rounded-[6px] border border-line bg-paper px-2 text-xs text-ink outline-none focus:border-cobalt"
                  onChange={(event) =>
                    state.setStartDate(event.target.value || todayIso())
                  }
                  type="date"
                  value={state.startDate}
                />
              </label>
              <span className="text-[11px] text-slate-500">
                Day 1 = your start date. Future days stay read-only.
              </span>
            </div>
          </div>
          <HeroStats
            doneTasks={overall.done}
            minutesLogged={overall.minutesLogged}
            minutesPlanned={overall.minutesPlanned}
            overallPct={overall.pct}
            streak={streakDays}
            totalTasks={overall.total}
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="grid gap-3">
          <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black text-ink">90 days</h2>
              <span className="text-xs font-bold text-slate-500">
                Day {activeDay(state.startDate)} active
              </span>
            </div>
            <DaysGrid
              dayPct={dayPct}
              onSelect={(day) => setSelectedDay(day)}
              selectedDay={selectedDay}
              startDate={state.startDate}
            />
          </div>
          <SearchBar onJumpToDay={(day) => setSelectedDay(day)} />
        </aside>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4"
          initial={{ opacity: 0, y: 6 }}
          key={selectedDay}
          transition={{ duration: 0.18 }}
        >
          <DayPanel onCelebrate={celebrate} selectedDay={selectedDay} />
          <div className="grid gap-4 md:grid-cols-2">
            <PhaseOverview byPhase={byPhase} />
            <TrackProgress byTrack={byTrack} />
          </div>
          <WeeklyReview state={state} />
        </motion.div>

        <aside className="grid gap-3">
          <DocumentChecklist />
          <ApplicationTracker />
        </aside>
      </section>

      <p className="text-center text-[11px] text-slate-400">
        Local-first. {Object.keys(state.completions).length} completions ·{" "}
        {Object.values(state.docs).filter(Boolean).length}/{DOCUMENT_CHECKLIST.length} docs ·{" "}
        {state.applications.length} apps — synced to this browser only.
      </p>

      <Toast toast={toast} />
    </div>
  );
}
