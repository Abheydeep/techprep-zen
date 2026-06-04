"use client";

import { Search } from "lucide-react";
import { useMemo } from "react";
import { TRACKS, searchTasks } from "../../lib/skillTracker";
import { useSkillTrackerStore } from "../../lib/skillTracker";

type SearchBarProps = {
  onJumpToDay: (day: number) => void;
};

export function SearchBar({ onJumpToDay }: SearchBarProps) {
  const state = useSkillTrackerStore();
  const searchQuery = state.searchQuery;
  const setSearchQuery = state.setSearchQuery;

  const results = useMemo(() => searchTasks(state, searchQuery), [state, searchQuery]);

  return (
    <div className="rounded-[10px] border border-line bg-paper p-3 shadow-calm">
      <label className="flex items-center gap-2 rounded-[8px] border border-line bg-panel px-2.5 py-1.5">
        <Search aria-hidden="true" className="text-slate-400" size={14} />
        <input
          aria-label="Search tasks"
          className="h-7 w-full border-0 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search 90 days of tasks…"
          value={searchQuery}
        />
        {searchQuery ? (
          <button
            className="text-[10px] font-black text-slate-400 transition hover:text-coral"
            onClick={() => setSearchQuery("")}
            type="button"
          >
            CLEAR
          </button>
        ) : null}
      </label>
      {searchQuery ? (
        <div className="zen-scrollbar mt-2 grid max-h-[220px] gap-1 overflow-y-auto pr-1">
          {results.length === 0 ? (
            <p className="px-2 py-3 text-xs text-slate-500">No matches.</p>
          ) : (
            results.map((task) => (
              <button
                className="grid grid-cols-[40px_1fr] gap-2 rounded-[8px] border border-line bg-panel p-2 text-left transition hover:border-cobalt focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                key={task.id}
                onClick={() => onJumpToDay(task.day)}
                type="button"
              >
                <span className="grid place-items-center rounded-[6px] bg-paper text-xs font-black text-ink">
                  {task.day}
                </span>
                <span className="min-w-0">
                  <span
                    className="block text-xs font-black"
                    style={{ color: TRACKS[task.track].hex }}
                  >
                    {TRACKS[task.track].shortLabel}
                  </span>
                  <span className="block truncate text-xs text-ink">{task.title}</span>
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
