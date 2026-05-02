"use client";

import * as Accordion from "@radix-ui/react-accordion";
import dynamic from "next/dynamic";
import { CheckCircle2, Code2, ExternalLink, Lightbulb, PlayCircle, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { curriculum } from "../lib/curriculum";
import { difficultyTone, useTechPrepStore } from "../lib/store";
import { useMoodBoost } from "../lib/useMoodBoost";
import { cn } from "../lib/utils";
import { MarkdownBlock } from "./MarkdownBlock";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-sm font-bold text-slate-500">Loading editor...</div>
});

export function StudyWorkspace() {
  const selectedAlgorithmId = useTechPrepStore((state) => state.selectedAlgorithmId);
  const sessionSeconds = useTechPrepStore((state) => state.sessionSeconds);
  const failedAttempts = useTechPrepStore((state) => state.failedAttempts);
  const keystrokes = useTechPrepStore((state) => state.keystrokes);
  const tickSession = useTechPrepStore((state) => state.tickSession);
  const recordKeystroke = useTechPrepStore((state) => state.recordKeystroke);
  const registerSubmission = useTechPrepStore((state) => state.registerSubmission);
  const resetFriction = useTechPrepStore((state) => state.resetFriction);

  const problem = useMemo(
    () => curriculum.algorithmicProblems.find((item) => item.id === selectedAlgorithmId) ?? curriculum.algorithmicProblems[0],
    [selectedAlgorithmId]
  );
  const [code, setCode] = useState(problem.starterCode);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const isLocked = sessionSeconds < 25 * 60;

  useMoodBoost(failedAttempts, sessionSeconds, problem.difficulty, keystrokes);

  useEffect(() => {
    setCode(problem.starterCode);
    setSolutionOpen(false);
  }, [problem.id, problem.starterCode]);

  useEffect(() => {
    const timer = window.setInterval(() => tickSession(1), 1000);
    return () => window.clearInterval(timer);
  }, [tickSession]);

  return (
    <section className="grid h-[calc(100vh-132px)] min-h-[720px] gap-4 lg:flex">
      <aside className="min-w-[320px] resize-x overflow-auto rounded-[8px] border border-line bg-paper p-5 shadow-calm lg:w-[42%]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-cobalt">{problem.patternCategory}</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-ink">{problem.title}</h1>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-black", difficultyTone(problem.difficulty))}>
            {problem.difficulty}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {problem.patternTags.map((tag) => (
            <span className="rounded-full bg-panel px-3 py-1 text-xs font-bold text-slate-600" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <MarkdownBlock content={problem.markdownDescription} className="mt-5" />

        <Accordion.Root className="mt-5 grid gap-3" type="multiple">
          <Accordion.Item className="rounded-[8px] border border-line bg-panel" value="hints">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-black text-ink">
              <span className="inline-flex items-center gap-2">
                <Lightbulb size={17} aria-hidden="true" />
                Hints
              </span>
              <span className="text-xs text-slate-500">{isLocked ? "locked until 25m" : "available"}</span>
            </Accordion.Trigger>
            <Accordion.Content className="border-t border-line px-4 py-3">
              {isLocked ? (
                <p className="text-sm leading-6 text-slate-600">
                  Keep wrestling productively for {Math.ceil((25 * 60 - sessionSeconds) / 60)} more minute
                  {Math.ceil((25 * 60 - sessionSeconds) / 60) === 1 ? "" : "s"}.
                </p>
              ) : (
                <ul className="grid gap-2 text-sm leading-6 text-slate-600">
                  {problem.hints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              )}
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item className="rounded-[8px] border border-line bg-panel" value="tests">
            <Accordion.Trigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-black text-ink">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} aria-hidden="true" />
                Pseudo-tests
              </span>
            </Accordion.Trigger>
            <Accordion.Content className="border-t border-line px-4 py-3">
              <ul className="grid gap-2 text-sm leading-6 text-slate-600">
                {problem.pseudoTests.map((test) => (
                  <li key={test}>{test}</li>
                ))}
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-line bg-paper px-3 text-sm font-black text-ink transition hover:border-cobalt"
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Problem Link
          </a>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-ink px-3 text-sm font-black text-white transition hover:-translate-y-0.5"
            disabled={isLocked}
            onClick={() => setSolutionOpen((value) => !value)}
          >
            <PlayCircle size={16} aria-hidden="true" />
            {solutionOpen ? "Hide" : "Show"} Solution
          </button>
        </div>

        {solutionOpen ? (
          <div className="mt-4 rounded-[8px] border border-cobalt/30 bg-cobalt/5 p-4">
            <MarkdownBlock content={problem.optimalSolution} />
            <div className="mt-4 overflow-hidden rounded-[8px] border border-line bg-black">
              <iframe className="aspect-video w-full" src={problem.embeddedVideoUrl} title={`${problem.title} video`} />
            </div>
          </div>
        ) : null}
      </aside>

      <div className="grid min-w-0 flex-1 grid-rows-[auto_1fr_auto] overflow-hidden rounded-[8px] border border-line bg-[#101421] shadow-focus">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <Code2 size={18} aria-hidden="true" />
            <span className="text-sm font-black">Guided Monaco Workspace</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            <TimerReset size={15} aria-hidden="true" />
            {formatTimer(sessionSeconds)}
          </div>
        </div>
        <MonacoEditor
          height="100%"
          language="typescript"
          theme="vs-dark"
          value={code}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            padding: { top: 18 },
            scrollBeyondLastLine: false
          }}
          onChange={(value) => {
            setCode(value ?? "");
            recordKeystroke();
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#151a2a] px-4 py-3">
          <p className="text-sm font-bold text-slate-300">
            Guided mode records attempts and mastery; it does not execute arbitrary code.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="h-10 rounded-[8px] border border-white/15 px-3 text-sm font-black text-white transition hover:bg-white/10"
              onClick={() => registerSubmission(false)}
            >
              Record Failing Attempt
            </button>
            <button
              className="h-10 rounded-[8px] bg-moss px-3 text-sm font-black text-white transition hover:-translate-y-0.5"
              onClick={() => {
                registerSubmission(true);
                resetFriction();
              }}
            >
              Mark Mastered
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
