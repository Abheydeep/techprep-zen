"use client";

import { Database, Route, ServerCog } from "lucide-react";
import { algorithmCategoryOrder, curriculum } from "../lib/curriculum";
import { difficultyTone, useTechPrepStore } from "../lib/store";
import { cn, percent } from "../lib/utils";

export function Roadmap() {
  const progress = useTechPrepStore((state) => state.progress);
  const selectAlgorithm = useTechPrepStore((state) => state.selectAlgorithm);
  const selectSystem = useTechPrepStore((state) => state.selectSystem);

  return (
    <section className="grid gap-5">
      <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="flex items-center gap-3">
          <Route className="text-cobalt" size={22} aria-hidden="true" />
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-cobalt">Roadmap</p>
            <h1 className="text-2xl font-black text-ink">Topological prep sequence</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <div className="mb-4 flex items-center gap-2">
            <Database className="text-cobalt" size={19} aria-hidden="true" />
            <h2 className="text-lg font-black text-ink">NeetCode 150</h2>
          </div>
          <div className="grid gap-4">
            {algorithmCategoryOrder.map((category) => {
              const problems = curriculum.algorithmicProblems.filter((problem) => problem.patternCategory === category);
              const mastered = problems.filter((problem) => progress[problem.id]?.status === "MASTERED").length;
              return (
                <article className="rounded-[8px] border border-line bg-panel p-4" key={category}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-black text-ink">{category}</h3>
                    <span className="text-sm font-black text-slate-500">
                      {mastered}/{problems.length}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white">
                    <div className="h-2 rounded-full bg-cobalt" style={{ width: `${percent(mastered, problems.length)}%` }} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {problems.map((problem) => (
                      <button
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-black transition hover:-translate-y-0.5",
                          progress[problem.id]?.status === "MASTERED"
                            ? "border-moss bg-moss/10 text-moss"
                            : difficultyTone(problem.difficulty)
                        )}
                        key={problem.id}
                        onClick={() => selectAlgorithm(problem.id)}
                      >
                        {problem.title}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <div className="mb-4 flex items-center gap-2">
            <ServerCog className="text-moss" size={19} aria-hidden="true" />
            <h2 className="text-lg font-black text-ink">System Design</h2>
          </div>
          <div className="grid gap-3">
            {curriculum.systemDesignModules.map((module) => (
              <button
                className={cn(
                  "rounded-[8px] border p-3 text-left transition hover:-translate-y-0.5 hover:border-moss",
                  progress[module.id]?.status === "MASTERED" ? "border-moss bg-moss/10" : "border-line bg-panel"
                )}
                key={module.id}
                onClick={() => selectSystem(module.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-ink">{module.title}</span>
                  <span className="text-xs font-black text-slate-500">{module.estimatedMinutes}m</span>
                </div>
                <p className="mt-1 text-xs font-bold text-slate-500">{module.frameworkCategory}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
