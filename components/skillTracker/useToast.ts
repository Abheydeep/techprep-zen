"use client";

import { useEffect, useRef, useState } from "react";

export type ToastMessage = { id: string; text: string; tone?: "success" | "info" | "warn" };

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (text: string, tone: ToastMessage["tone"] = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: `${Date.now()}-${text}`, text, tone });
    timer.current = setTimeout(() => setToast(null), 1800);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { toast, show };
}
