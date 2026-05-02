"use client";

import confetti from "canvas-confetti";
import { BookOpenCheck, Brain, CheckCircle2, Clock3, Flame, Snowflake, Waypoints } from "lucide-react";
import { curriculum, curriculumStats, algorithmCategoryOrder } from "../lib/curriculum";
import { useTechPrepStore } from "../lib/store";
import type { DailyItinerary, UserProgress } from "../lib/types";
import { percent } from "../lib/utils";
import { ProgressRing } from "./ProgressRing";

type DashboardProps = {
  itinerary: DailyItinerary;
};

export function Dashboard({ itinerary }: DashboardProps) {
  const profile = useTechPrepStore((state) => state.profile);
  const progress = useTechPrepStore((state) => state.progress);
  const completeDailySession = useTechPrepStore((state) => state.completeDailySession);
  const logMinutes = useTechPrepStore((state) => state.logMinutes);
  const selectAlgorithm = useTechPrepStore((state) => state.selectAlgorithm);
  const selectSystem = useTechPrepStore((state) => state.selectSystem);
  const selectQuiz = useTechPrepStore((state) => state.selectQuiz);
  const setActiveView = useTechPrepStore((state) => state.setActiveView);

  const masteredAlgorithms = countMastered(progress, "algorithm");
  const masteredSystems = countMastered(progress, "system");
  const masteredQuizzes = countMastered(progress, "quiz");
  const prepScore = curriculum.algorithmicProblems.reduce(
    (score, problem) => score + (progress[problem.id]?.status === "MASTERED" ? problem.prepScore : 0),
    0
  );

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-cobalt">Today</p>
              <h1 className="mt-1 text-3xl font-black leading-tight text-ink">180-minute focus itinerary</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Retrieval first, algorithms second, architecture last. The cap is intentional: the app
                protects consistency instead of rewarding cramming.
              </p>
            </div>
            <div className="rounded-[8px] border border-line bg-panel px-4 py-3">
              <div className="text-sm font-bold text-slate-500">Logged</div>
              <div className="text-2xl font-black text-ink">{itinerary.minutesLogged}/180m</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {itinerary.blocks.map((block) => (
              <article className="rounded-[8px] border border-line bg-white p-4" key={block.id}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-black text-ink">{block.title}</h2>
                  <span className="rounded-full bg-cobalt/10 px-3 py-1 text-xs font-black text-cobalt">
                    {block.minutes}m
                  </span>
                </div>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{block.cognitiveObjective}</p>
                <div className="mt-4 grid gap-2">
                  {block.items.slice(0, 3).map((item) => {
                    if (item.type === "quiz") {
                      return (
                        <button
                          className="rounded-[8px] border border-line bg-panel px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-cobalt"
                          key={item.quiz.id}
                          onClick={() => selectQuiz(item.quiz.id)}
                        >
                          Quiz: {item.quiz.questionText}
                        </button>
                      );
                    }

                    if (item.type === "algorithm") {
                      return (
                        <button
                          className="rounded-[8px] border border-line bg-panel px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-cobalt"
                          key={`${item.problem.id}-${item.isReview}`}
                          onClick={() => selectAlgorithm(item.problem.id)}
                        >
                          {item.isReview ? "Review" : "Solve"}: {item.problem.title}
                        </button>
                      );
                    }

                    return (
                      <button
                        className="rounded-[8px] border border-line bg-panel px-3 py-2 text-left text-sm font-bold text-ink transition hover:border-cobalt"
                        key={item.module.id}
                        onClick={() => selectSystem(item.module.id)}
                      >
                        Design: {item.module.title}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-ink px-4 text-sm font-black text-white shadow-calm transition hover:-translate-y-0.5"
              onClick={() => {
                logMinutes(30);
              }}
            >
              <Clock3 size={17} aria-hidden="true" />
              Log 30m
            </button>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-moss px-4 text-sm font-black text-white shadow-calm transition hover:-translate-y-0.5"
              disabled={itinerary.cooldownActive}
              onClick={() => {
                const earnedRepair = completeDailySession();
                confetti({
                  particleCount: earnedRepair ? 120 : 70,
                  spread: 62,
                  scalar: 0.85,
                  origin: { y: 0.78 }
                });
              }}
            >
              <CheckCircle2 size={17} aria-hidden="true" />
              Complete Today
            </button>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-[8px] border border-line bg-paper px-4 text-sm font-black text-ink transition hover:border-cobalt"
              onClick={() => setActiveView("roadmap")}
            >
              <Waypoints size={17} aria-hidden="true" />
              Roadmap
            </button>
          </div>
        </div>

        <aside className="grid gap-4">
          <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ProgressRing value={percent(masteredAlgorithms, curriculumStats.algorithmCount)} label="DSA" tone="#245fbc" />
              <ProgressRing value={percent(masteredSystems, curriculumStats.systemModuleCount)} label="System design" tone="#2f6f5e" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Metric icon={<Flame size={18} />} label="Current streak" value={`${profile.currentStreak} days`} />
            <Metric icon={<Snowflake size={18} />} label="Streak repairs" value={String(profile.streakRepairs)} />
            <Metric icon={<Brain size={18} />} label="Prep score" value={`${prepScore}/${curriculumStats.prepScoreTotal}`} />
          </div>
        </aside>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-coral">Pattern closure</p>
              <h2 className="text-xl font-black text-ink">DSA category progress</h2>
            </div>
            <BookOpenCheck className="text-coral" size={22} aria-hidden="true" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {algorithmCategoryOrder.map((category) => {
              const problems = curriculum.algorithmicProblems.filter((problem) => problem.patternCategory === category);
              const done = problems.filter((problem) => progress[problem.id]?.status === "MASTERED").length;
              return (
                <button
                  className="rounded-[8px] border border-line bg-panel p-3 text-left transition hover:-translate-y-0.5 hover:border-cobalt"
                  key={category}
                  onClick={() => selectAlgorithm(problems.find((problem) => progress[problem.id]?.status !== "MASTERED")?.id ?? problems[0].id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-black text-ink">{category}</span>
                    <span className="text-xs font-black text-slate-500">
                      {done}/{problems.length}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div
                      className="h-2 rounded-full bg-cobalt"
                      style={{ width: `${percent(done, problems.length)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <p className="text-sm font-black uppercase tracking-normal text-moss">Assessment</p>
          <h2 className="mt-1 text-xl font-black text-ink">Quiz mastery</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Quizzes unlock spaced recall. Mastered quizzes feed the retrieval block and keep old concepts warm.
          </p>
          <div className="mt-5 rounded-[8px] border border-line bg-panel p-4">
            <div className="flex items-end justify-between gap-2">
              <span className="text-4xl font-black text-ink">{masteredQuizzes}</span>
              <span className="text-sm font-black text-slate-500">of {curriculumStats.quizCount}</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div className="h-2 rounded-full bg-moss" style={{ width: `${percent(masteredQuizzes, curriculumStats.quizCount)}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-line bg-paper p-4 shadow-calm">
      <div className="flex items-center gap-2 text-cobalt">{icon}</div>
      <div className="mt-3 text-sm font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-ink">{value}</div>
    </div>
  );
}

function countMastered(progress: Record<string, UserProgress>, type: UserProgress["itemType"]) {
  return Object.values(progress).filter((item) => item.itemType === type && item.status === "MASTERED").length;
}
