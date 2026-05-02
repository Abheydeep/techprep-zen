type ProgressRingProps = {
  value: number;
  label: string;
  tone?: string;
};

export function ProgressRing({ value, label, tone = "#245fbc" }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-16 w-16 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${tone} ${clamped}%, rgba(18, 22, 33, 0.1) ${clamped}% 100%)`
        }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-paper text-sm font-black text-ink">
          {clamped}%
        </div>
      </div>
      <div>
        <p className="text-sm font-black text-ink">{label}</p>
        <p className="text-xs font-bold text-slate-500">completion</p>
      </div>
    </div>
  );
}
