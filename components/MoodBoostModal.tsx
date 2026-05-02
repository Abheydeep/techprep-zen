"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { HeartPulse, Lightbulb, X } from "lucide-react";
import { useTechPrepStore } from "../lib/store";

export function MoodBoostModal() {
  const moodBoost = useTechPrepStore((state) => state.moodBoost);
  const setMoodBoost = useTechPrepStore((state) => state.setMoodBoost);

  return (
    <Dialog.Root open={Boolean(moodBoost)} onOpenChange={(open) => !open && setMoodBoost(undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-line bg-paper p-5 shadow-focus">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-coral/10 text-coral">
              <HeartPulse size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-xl font-black text-ink">{moodBoost?.title}</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600">
                {moodBoost?.body}
              </Dialog.Description>
            </div>
            <Dialog.Close className="grid h-9 w-9 place-items-center rounded-[8px] text-slate-500 transition hover:bg-panel">
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Dialog.Close className="h-10 rounded-[8px] border border-line bg-paper px-4 text-sm font-black text-ink transition hover:border-coral">
              I can continue
            </Dialog.Close>
            <Dialog.Close className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-coral px-4 text-sm font-black text-white transition hover:-translate-y-0.5">
              <Lightbulb size={16} aria-hidden="true" />
              {moodBoost?.actionLabel ?? "Show hint"}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
