"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ToastMessage } from "./useToast";

const toneClasses: Record<NonNullable<ToastMessage["tone"]>, string> = {
  success: "bg-moss text-white border-moss",
  info: "bg-cobalt text-white border-cobalt",
  warn: "bg-coral text-white border-coral"
};

export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <AnimatePresence>
      {toast ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className={`pointer-events-none fixed bottom-5 right-5 z-50 rounded-[10px] border px-4 py-2 text-sm font-black shadow-focus ${
            toneClasses[toast.tone ?? "success"]
          }`}
          exit={{ opacity: 0, y: 16 }}
          initial={{ opacity: 0, y: 16 }}
          key={toast.id}
          transition={{ duration: 0.18 }}
        >
          {toast.text}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
