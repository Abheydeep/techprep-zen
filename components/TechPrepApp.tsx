"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, BrainCircuit, ClipboardCheck, LayoutDashboard, Library, LogOut, Route, ServerCog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { curriculum } from "../lib/curriculum";
import { generateDailyItinerary } from "../lib/scheduler";
import { selectTodayMinutes, useTechPrepStore } from "../lib/store";
import { AdminGate } from "./AdminGate";
import { Dashboard } from "./Dashboard";
import { MoodBoostModal } from "./MoodBoostModal";
import { QuizPanel } from "./QuizPanel";
import { Resources } from "./Resources";
import { Roadmap } from "./Roadmap";
import { StudyWorkspace } from "./StudyWorkspace";
import { SystemWorkspace } from "./SystemWorkspace";
import { ZenModeButton } from "./ZenModeButton";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "roadmap", label: "Roadmap", icon: Route },
  { id: "dsa", label: "DSA", icon: BookOpen },
  { id: "system", label: "Design", icon: ServerCog },
  { id: "quiz", label: "Quizzes", icon: ClipboardCheck },
  { id: "resources", label: "Resources", icon: Library }
] as const;

export function TechPrepApp() {
  const [mounted, setMounted] = useState(false);
  const authenticated = useTechPrepStore((state) => state.authenticated);
  const profile = useTechPrepStore((state) => state.profile);
  const progress = useTechPrepStore((state) => state.progress);
  const activeView = useTechPrepStore((state) => state.activeView);
  const zenMode = useTechPrepStore((state) => state.zenMode);
  const setActiveView = useTechPrepStore((state) => state.setActiveView);
  const signOut = useTechPrepStore((state) => state.signOut);

  useEffect(() => setMounted(true), []);

  const itinerary = useMemo(() => generateDailyItinerary(profile, progress, curriculum), [profile, progress]);
  const todayMinutes = selectTodayMinutes(profile);

  if (!mounted) {
    return <div className="min-h-screen bg-panel" />;
  }

  if (!authenticated) {
    return <AdminGate />;
  }

  return (
    <main className={zenMode ? "min-h-screen bg-slate-950 p-3 text-white" : "min-h-screen px-4 py-4 text-ink sm:px-5"}>
      <AnimatePresence>
        {!zenMode ? (
          <motion.header
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-4 flex max-w-[1720px] flex-wrap items-center justify-between gap-3 rounded-[8px] border border-line bg-paper/95 p-3 shadow-calm backdrop-blur"
            exit={{ opacity: 0, y: -18 }}
            initial={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-ink text-white">
                <BrainCircuit size={23} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black leading-tight text-ink">TechPrep Zen</p>
                <p className="truncate text-xs font-bold text-slate-500">
                  {todayMinutes}/180 minutes logged today
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-2" aria-label="Primary">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    className={`inline-flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm font-black transition ${
                      activeView === item.id
                        ? "bg-ink text-white"
                        : "border border-line bg-paper text-ink hover:border-cobalt"
                    }`}
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                  >
                    <Icon size={16} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
              <ZenModeButton />
              <button
                className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-line bg-paper px-3 text-sm font-black text-ink transition hover:border-coral"
                onClick={signOut}
              >
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </button>
            </nav>
          </motion.header>
        ) : null}
      </AnimatePresence>

      {zenMode ? (
        <div className="fixed right-4 top-4 z-30">
          <ZenModeButton />
        </div>
      ) : null}

      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className={zenMode ? "mx-auto max-w-[1720px]" : "mx-auto max-w-[1720px]"}
        initial={{ opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.18 }}
      >
        {activeView === "dashboard" ? <Dashboard itinerary={itinerary} /> : null}
        {activeView === "roadmap" ? <Roadmap /> : null}
        {activeView === "dsa" ? <StudyWorkspace /> : null}
        {activeView === "system" ? <SystemWorkspace /> : null}
        {activeView === "quiz" ? <QuizPanel /> : null}
        {activeView === "resources" ? <Resources /> : null}
      </motion.div>

      <MoodBoostModal />
    </main>
  );
}
