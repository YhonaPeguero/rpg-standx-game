import type { Rank } from "@/types";

// The intermediate ranks are reachable inside the game (Act I awards roughly
// 500 EP, so a thorough run finishes as Seed Candidate). SEED, SPROUT and
// FLOWER are the *real* StandX Growth Path goals — they take real Discord
// activity over time, so the in-game EP only gets you to the doorstep.
// SPROUT additionally needs 2 real contributions; FLOWER's path is still TBD.
export const RANK_THRESHOLDS: { rank: Rank; min: number }[] = [
  { rank: "new_stander", min: 0 },
  { rank: "active", min: 60 },
  { rank: "consistent", min: 150 },
  { rank: "seed_candidate", min: 300 },
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
