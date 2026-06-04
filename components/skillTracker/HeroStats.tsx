"use client";

import { Flame, Sparkles, Target } from "lucide-react";
import { cn } from "../../lib/utils";

type HeroStatsProps = {
  overallPct: number;
  doneTasks: number;
  totalTasks: number;
  streak: number;
  minutesLogged: number;
  minutesPlanned: number;
};

export function HeroStats({
  overallPct,
  doneTasks,
  totalTasks,
  streak,
  minutesLogged,
  minutesPlanned
}: HeroStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        accent="bg-cobalt/10 text-cobalt"
        icon={<Target size={18} aria-hidden="true" />}
        label="Overall progress"
        value={`${overallPct}%`}
        sub={`${doneTasks} of ${totalTasks} tasks done`}
      >
        <ProgressTrack value={overallPct} />
      </StatCard>
      <StatCard
        accent="bg-coral/10 text-coral"
        icon={<Flame size={18} aria-hidden="true" />}
        label="Current streak"
        value={`${streak} ${streak === 1 ? "day" : "days"}`}
        sub="Consecutive days where every task was completed."
      />
      <StatCard
        accent="bg-moss/10 text-moss"
        icon={<Sparkles size={18} aria-hidden="true" />}
        label="Minutes logged"
        value={`${minutesLogged}m`}
        sub={`Plan called for ${minutesPlanned}m so far`}
      >
        <ProgressTrack
          value={minutesPlanned === 0 ? 0 : Math.min(100, Math.round((minutesLogged / minutesPlanned) * 100))}
        />
      </StatCard>
    </div>
  );
}

function StatCard({
  accent,
  icon,
  label,
  value,
  sub,
  children
}: {
  accent: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[10px] border border-line bg-paper p-4 shadow-calm">
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[8px]", accent)}>
          {icon}
        </span>
        <span className="text-xs font-black uppercase tracking-normal text-slate-500">{label}</span>
      </div>
      <div className="mt-3 text-3xl font-black leading-none text-ink">{value}</div>
      <p className="mt-1 text-xs font-bold text-slate-500">{sub}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function ProgressTrack({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-panel" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-moss via-cobalt to-coral transition-[width] duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
