"use client";

import { motion } from "framer-motion";
import { DOCUMENT_CHECKLIST } from "../../lib/skillTracker";
import { useSkillTrackerStore } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";

export function DocumentChecklist() {
  const docs = useSkillTrackerStore((state) => state.docs);
  const toggleDoc = useSkillTrackerStore((state) => state.toggleDoc);

  const done = Object.values(docs).filter(Boolean).length;
  const pct = Math.round((done / DOCUMENT_CHECKLIST.length) * 100);

  return (
    <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black text-ink">Express Entry checklist</h3>
        <span className="text-xs font-bold text-slate-500">{pct}% · {done}/{DOCUMENT_CHECKLIST.length}</span>
      </div>
      <div className="mb-3 h-1.5 w-full rounded-full bg-panel">
        <div
          className="h-full rounded-full bg-coral transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="zen-scrollbar grid max-h-[360px] gap-1.5 overflow-y-auto pr-1">
        {DOCUMENT_CHECKLIST.map((item, index) => {
          const checked = Boolean(docs[index]);
          return (
            <motion.label
              animate={{ opacity: 1 }}
              className={cn(
                "flex cursor-pointer items-start gap-2 rounded-[8px] border bg-panel p-2 transition focus-within:border-cobalt",
                checked ? "border-moss/60 bg-moss/5" : "border-line"
              )}
              initial={{ opacity: 0 }}
              key={item[0]}
              transition={{ duration: 0.12 }}
              whileHover={{ x: 1 }}
            >
              <input
                aria-label={item[0]}
                checked={checked}
                className="mt-0.5 h-4 w-4 accent-moss"
                onChange={() => toggleDoc(index)}
                type="checkbox"
              />
              <div className="min-w-0">
                <strong className="block text-xs font-black text-ink">{item[0]}</strong>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                  {item[1]}
                </span>
              </div>
            </motion.label>
          );
        })}
      </div>
    </div>
  );
}
