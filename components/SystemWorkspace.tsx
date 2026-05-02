"use client";

import dynamic from "next/dynamic";
import { Check, ExternalLink, Network, PenLine } from "lucide-react";
import { useMemo } from "react";
import { curriculum } from "../lib/curriculum";
import { useTechPrepStore } from "../lib/store";
import { MarkdownBlock } from "./MarkdownBlock";

const ExcalidrawCanvas = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm font-bold text-slate-500">Loading whiteboard...</div>
});

export function SystemWorkspace() {
  const selectedSystemId = useTechPrepStore((state) => state.selectedSystemId);
  const markProgress = useTechPrepStore((state) => state.markProgress);
  const module = useMemo(
    () => curriculum.systemDesignModules.find((item) => item.id === selectedSystemId) ?? curriculum.systemDesignModules[0],
    [selectedSystemId]
  );

  return (
    <section className="grid min-h-[760px] gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-moss">{module.frameworkCategory}</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-ink">{module.title}</h1>
          </div>
          <span className="rounded-full border border-moss/20 bg-moss/10 px-3 py-1 text-xs font-black text-moss">
            {module.estimatedMinutes}m
          </span>
        </div>

        <p className="mt-3 rounded-[8px] border border-line bg-panel p-3 text-sm font-bold leading-6 text-slate-600">
          Signal: {module.senioritySignal}
        </p>

        <MarkdownBlock content={module.markdownContent} className="mt-5" />

        <div className="mt-5 rounded-[8px] border border-line bg-panel p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-black text-ink">
            <Check size={17} aria-hidden="true" />
            RESHADED checklist
          </div>
          <div className="grid gap-2">
            {module.reshadedChecklist.map((item) => (
              <label className="flex items-start gap-2 text-sm leading-6 text-slate-600" key={item}>
                <input className="mt-1 accent-cobalt" type="checkbox" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-line bg-paper px-3 text-sm font-black text-ink transition hover:border-moss"
            href={module.resourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Source Primer
          </a>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-moss px-3 text-sm font-black text-white transition hover:-translate-y-0.5"
            onClick={() => markProgress(module.id, "system", "MASTERED")}
          >
            <Check size={16} aria-hidden="true" />
            Mark Mastered
          </button>
        </div>
      </aside>

      <div className="grid min-w-0 grid-rows-[auto_minmax(440px,1fr)_auto] overflow-hidden rounded-[8px] border border-line bg-paper shadow-focus">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2 text-ink">
            <PenLine size={18} aria-hidden="true" />
            <span className="text-sm font-black">Architecture whiteboard</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cobalt/10 px-3 py-1 text-xs font-black text-cobalt">
            <Network size={15} aria-hidden="true" />
            RESHADED canvas
          </div>
        </div>
        <div className="min-h-[440px]">
          <ExcalidrawCanvas
            initialData={{
              appState: {
                viewBackgroundColor: "#ffffff"
              },
              elements: []
            }}
          />
        </div>
        <div className="border-t border-line bg-panel p-4">
          <p className="text-sm font-bold leading-6 text-slate-600">
            Sketch first, compare second. Keep the diagram focused on request flow, storage ownership,
            bottlenecks, and failure boundaries.
          </p>
        </div>
      </div>
    </section>
  );
}
