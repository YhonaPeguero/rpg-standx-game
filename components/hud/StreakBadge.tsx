type StreakBadgeProps = {
  days: number;
  label: string;
};

export function StreakBadge({ days, label }: StreakBadgeProps) {
  return (
    <div className="rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 px-3 py-2">
      <p className="font-mono text-lg leading-none text-sx-gold">{days}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-sx-dim">{label}</p>
    </div>
  );
}
