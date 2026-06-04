import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SkillTracker } from "../../components/skillTracker";

export const metadata: Metadata = {
  title: "90-Day Skill Tracker · TechPrep Zen",
  description:
    "Five parallel lanes — English/IELTS, coding fundamentals, website reconstruction, Express Entry, and interview readiness — over 90 days."
};

export default function SkillTrackerPage() {
  return (
    <main className="min-h-screen bg-panel px-4 py-4 text-ink sm:px-6">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line bg-paper px-3 text-xs font-black text-ink transition hover:border-cobalt focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
            href="/"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to TechPrep Zen
          </Link>
          <span className="text-[11px] font-black uppercase tracking-normal text-slate-500">
            Standalone · local-first · /skill-tracker
          </span>
        </div>
        <SkillTracker />
      </div>
    </main>
  );
}
