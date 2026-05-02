"use client";

import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { curriculum } from "../lib/curriculum";
import { useTechPrepStore } from "../lib/store";
import { cn } from "../lib/utils";

export function QuizPanel() {
  const selectedQuizId = useTechPrepStore((state) => state.selectedQuizId);
  const answerQuiz = useTechPrepStore((state) => state.answerQuiz);
  const selectQuiz = useTechPrepStore((state) => state.selectQuiz);
  const quiz = useMemo(
    () => curriculum.quizItems.find((item) => item.id === selectedQuizId) ?? curriculum.quizItems[0],
    [selectedQuizId]
  );
  const [selected, setSelected] = useState<number | null>(null);
  const submitted = selected !== null;
  const correct = selected === quiz.correctAnswerIndex;

  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <aside className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <p className="text-sm font-black uppercase tracking-normal text-violet">Assessment</p>
        <h1 className="mt-1 text-2xl font-black text-ink">Recall queue</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These questions test judgment and pattern recognition. Passing one marks the item as mastered
          for spaced retrieval.
        </p>
        <div className="mt-5 grid max-h-[620px] gap-2 overflow-auto pr-1 zen-scrollbar">
          {curriculum.quizItems.map((item) => (
            <button
              className={cn(
                "rounded-[8px] border p-3 text-left text-sm font-bold transition hover:border-violet",
                item.id === quiz.id ? "border-violet bg-violet/10 text-violet" : "border-line bg-panel text-ink"
              )}
              key={item.id}
              onClick={() => {
                selectQuiz(item.id);
                setSelected(null);
              }}
            >
              {item.questionText}
            </button>
          ))}
        </div>
      </aside>

      <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-violet/10 text-violet">
            <HelpCircle size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-violet">Active recall</p>
            <h2 className="mt-1 text-2xl font-black leading-tight text-ink">{quiz.questionText}</h2>
          </div>
        </div>

        <div className="grid gap-3">
          {quiz.options.map((option, index) => {
            const isSelected = selected === index;
            const isCorrect = submitted && index === quiz.correctAnswerIndex;
            const isWrong = submitted && isSelected && !isCorrect;
            return (
              <button
                className={cn(
                  "flex min-h-14 items-center justify-between gap-3 rounded-[8px] border px-4 py-3 text-left text-sm font-bold transition",
                  isCorrect
                    ? "border-moss bg-moss/10 text-moss"
                    : isWrong
                      ? "border-coral bg-coral/10 text-coral"
                      : isSelected
                        ? "border-violet bg-violet/10 text-violet"
                        : "border-line bg-panel text-ink hover:border-violet"
                )}
                key={option.id}
                onClick={() => {
                  setSelected(index);
                  answerQuiz(quiz.id, index === quiz.correctAnswerIndex);
                }}
              >
                <span>{option.label}</span>
                {isCorrect ? <CheckCircle2 size={18} aria-hidden="true" /> : null}
                {isWrong ? <XCircle size={18} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        {submitted ? (
          <div className="mt-5 rounded-[8px] border border-line bg-panel p-4">
            <p className={cn("text-sm font-black", correct ? "text-moss" : "text-coral")}>
              {correct ? "Correct" : "Not quite"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{quiz.educationalExplanation}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
