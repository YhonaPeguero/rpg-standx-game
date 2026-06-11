import type { Rank } from "@/types";

// Only the real StandX Growth Path tiers — no synthetic in-game ranks.
// Act I awards roughly 500 EP, so the game is the on-ramp toward SEED (3,000).
// SPROUT additionally needs 2 real Discord contributions; FLOWER's path is TBD
// (8,000 is a placeholder until the team defines it).
export const RANK_THRESHOLDS: { rank: Rank; min: number }[] = [
  { rank: "new_stander", min: 0 },
  { rank: "seed", min: 3000 },
  { rank: "sprout", min: 4000 },
  { rank: "flower", min: 8000 },
];

export function rankFromEP(ep: number): Rank {
  let current: Rank = "new_stander";

  for (const threshold of RANK_THRESHOLDS) {
    if (ep >= threshold.min) {
      current = threshold.rank;
    }
  }

  return current;
}

export function nextRankThreshold(ep: number) {
  return RANK_THRESHOLDS.find((threshold) => threshold.min > ep) ?? null;
}

export function rankOrder(rank: Rank): number {
  return RANK_THRESHOLDS.findIndex((threshold) => threshold.rank === rank);
}
