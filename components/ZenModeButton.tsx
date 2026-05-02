"use client";

import { Focus, Moon } from "lucide-react";
import { useTechPrepStore } from "../lib/store";

export function ZenModeButton() {
  const zenMode = useTechPrepStore((state) => state.zenMode);
  const toggleZenMode = useTechPrepStore((state) => state.toggleZenMode);

  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-line bg-paper px-3 text-sm font-black text-ink transition hover:border-cobalt"
      onClick={toggleZenMode}
    >
      {zenMode ? <Moon size={16} aria-hidden="true" /> : <Focus size={16} aria-hidden="true" />}
      {zenMode ? "Exit Zen" : "Zen Mode"}
    </button>
  );
}
