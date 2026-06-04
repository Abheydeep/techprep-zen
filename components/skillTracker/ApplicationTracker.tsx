"use client";

import { motion } from "framer-motion";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSkillTrackerStore } from "../../lib/skillTracker";
import type { ApplicationStage } from "../../lib/skillTracker";
import { cn } from "../../lib/utils";

const STAGES: ApplicationStage[] = ["Applied", "OA", "Interview", "Offer", "Rejected"];

const stageTone: Record<ApplicationStage, string> = {
  Applied: "bg-cobalt/10 text-cobalt",
  OA: "bg-violet/10 text-violet",
  Interview: "bg-gold/10 text-gold",
  Offer: "bg-moss/10 text-moss",
  Rejected: "bg-coral/10 text-coral"
};

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ApplicationTracker() {
  const applications = useSkillTrackerStore((state) => state.applications);
  const addApplication = useSkillTrackerStore((state) => state.addApplication);
  const updateApplication = useSkillTrackerStore((state) => state.updateApplication);
  const removeApplication = useSkillTrackerStore((state) => state.removeApplication);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState(todayIso());
  const [stage, setStage] = useState<ApplicationStage>("Applied");
  const [link, setLink] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!company.trim() || !role.trim() || !date) return;
    addApplication({
      company: company.trim(),
      role: role.trim(),
      date,
      stage,
      link: link.trim() || undefined
    });
    setCompany("");
    setRole("");
    setLink("");
    setStage("Applied");
    setDate(todayIso());
  };

  return (
    <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black text-ink">Application tracker</h3>
        <span className="text-xs font-bold text-slate-500">
          {applications.length} {applications.length === 1 ? "app" : "apps"}
        </span>
      </div>

      <form className="grid gap-2" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Company"
            className="h-9 rounded-[8px] border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Company"
            required
            value={company}
          />
          <input
            aria-label="Role"
            className="h-9 rounded-[8px] border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
            onChange={(event) => setRole(event.target.value)}
            placeholder="Role"
            required
            value={role}
          />
        </div>
        <input
          aria-label="Link"
          className="h-9 rounded-[8px] border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
          onChange={(event) => setLink(event.target.value)}
          placeholder="Job posting link (optional)"
          type="url"
          value={link}
        />
        <div className="grid grid-cols-[1fr_120px] gap-2">
          <select
            aria-label="Stage"
            className="h-9 rounded-[8px] border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
            onChange={(event) => setStage(event.target.value as ApplicationStage)}
            value={stage}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            aria-label="Date"
            className="h-9 rounded-[8px] border border-line bg-panel px-2 text-sm text-ink outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
            onChange={(event) => setDate(event.target.value)}
            required
            type="date"
            value={date}
          />
        </div>
        <button
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] bg-ink px-3 text-xs font-black text-white transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
          type="submit"
        >
          <Plus size={14} aria-hidden="true" />
          Log application
        </button>
      </form>

      <div className="zen-scrollbar mt-3 grid max-h-[260px] gap-2 overflow-y-auto pr-1">
        {applications.length === 0 ? (
          <div className="rounded-[8px] border border-dashed border-line bg-panel p-3 text-center text-xs text-slate-500">
            <Briefcase aria-hidden="true" className="mx-auto mb-1 text-slate-400" size={18} />
            No applications yet. Aim for 5 per week from week 5 onward.
          </div>
        ) : (
          applications
            .slice()
            .reverse()
            .map((app) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[8px] border border-line bg-panel p-2.5"
                initial={{ opacity: 0, y: 4 }}
                key={app.id}
                layout
                transition={{ duration: 0.18 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <strong className="block truncate text-sm text-ink">{app.company}</strong>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {app.role} · {app.date}
                    </p>
                    {app.link ? (
                      <a
                        className="mt-0.5 inline-block truncate text-[11px] font-bold text-cobalt underline decoration-cobalt/30 underline-offset-2"
                        href={app.link}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Job posting
                      </a>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <select
                      aria-label={`Stage for ${app.company}`}
                      className={cn(
                        "h-7 rounded-full border-none px-2 text-[10px] font-black uppercase",
                        stageTone[app.stage]
                      )}
                      onChange={(event) =>
                        updateApplication(app.id, { stage: event.target.value as ApplicationStage })
                      }
                      value={app.stage}
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      aria-label={`Remove ${app.company}`}
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper text-slate-400 transition hover:border-coral hover:text-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                      onClick={() => removeApplication(app.id)}
                      type="button"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
