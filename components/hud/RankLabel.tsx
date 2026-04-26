import type { Rank } from "@/types";
import { cn } from "@/lib/utils";

type RankLabelProps = {
  rank: Rank;
  className?: string;
};

export function formatRank(rank: Rank) {
  return rank
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function RankLabel({ rank, className }: RankLabelProps) {
  return (
    <span
      className={cn(
        "rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-sx-green",
        className,
      )}
    >
      {formatRank(rank)}
    </span>
  );
}
