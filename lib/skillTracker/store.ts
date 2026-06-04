"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { todayIso } from "./plan";
import type { SkillTrackerState, SkillTrackerStore } from "./types";

const STORAGE_KEY = "abhey:skill-tracker:v1";

const DEFAULT_START_DATE = "2026-06-04";

export function makeDefaultState(): SkillTrackerState {
  return {
    schemaVersion: 1,
    startDate: DEFAULT_START_DATE,
    completions: {},
    dayNotes: {},
    docs: {},
    applications: [],
    lastSelectedDay: 1,
    searchQuery: "",
    onboardingDismissed: false
  };
}

function randomId(): string {
  return `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useSkillTrackerStore = create<SkillTrackerStore>()(
  persist(
    (set) => ({
      ...makeDefaultState(),
      setStartDate: (iso) => set({ startDate: iso || todayIso() }),
      toggleTask: (taskId) =>
        set((state) => {
          const next = { ...state.completions };
          if (next[taskId]) {
            delete next[taskId];
          } else {
            next[taskId] = { taskId, completedAt: new Date().toISOString() };
          }
          return { completions: next };
        }),
      setTaskMinutes: (taskId, minutes) =>
        set((state) => {
          const existing = state.completions[taskId];
          if (!existing) return state;
          return {
            completions: {
              ...state.completions,
              [taskId]: { ...existing, minutesActual: minutes }
            }
          };
        }),
      setTaskNote: (taskId, note) =>
        set((state) => {
          const existing = state.completions[taskId] ?? {
            taskId,
            completedAt: new Date().toISOString()
          };
          const cleaned = note.trim();
          return {
            completions: {
              ...state.completions,
              [taskId]: { ...existing, note: cleaned || undefined }
            }
          };
        }),
      setDayNote: (day, note) =>
        set((state) => {
          const next = { ...state.dayNotes };
          const cleaned = note.trim();
          if (cleaned) next[day] = cleaned;
          else delete next[day];
          return { dayNotes: next };
        }),
      toggleDoc: (index) =>
        set((state) => {
          const next = { ...state.docs };
          if (next[index]) delete next[index];
          else next[index] = true;
          return { docs: next };
        }),
      addApplication: (input) =>
        set((state) => ({
          applications: [...state.applications, { ...input, id: randomId() }]
        })),
      updateApplication: (id, patch) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...patch } : app
          )
        })),
      removeApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id)
        })),
      setLastSelectedDay: (day) => set({ lastSelectedDay: day }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      dismissOnboarding: () => set({ onboardingDismissed: true }),
      resetAll: () => set(makeDefaultState()),
      importState: (next) => set({ ...next })
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== "object") return makeDefaultState();
        return persisted as SkillTrackerState;
      },
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        startDate: state.startDate,
        completions: state.completions,
        dayNotes: state.dayNotes,
        docs: state.docs,
        applications: state.applications,
        lastSelectedDay: state.lastSelectedDay,
        searchQuery: state.searchQuery,
        onboardingDismissed: state.onboardingDismissed
      })
    }
  )
);
