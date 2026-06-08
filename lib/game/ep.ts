import type { Rank } from "@/types";

export const RANK_THRESHOLDS: { rank: Rank; min: number }[] = [
  { rank: "new_stander", min: 0 },
  { rank: "active", min: 60 },
  { rank: "consistent", min: 150 },
  { rank: "seed_candidate", min: 300 },
  { rank: "seed", min: 500 },
  { rank: "sprout", min: 800 },
  { rank: "flower", min: 1300 },
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
