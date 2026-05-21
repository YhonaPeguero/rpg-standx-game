import type { Rank } from "@/types";
import { RANK_THRESHOLDS, nextRankThreshold, rankFromEP, rankOrder } from "./ep";

export type RankMeta = {
  id: Rank;
  minEP: number;
  /** i18n key under ranks.labels.<id> */
  labelKey: string;
  /** i18n key under ranks.details.<id> */
  detailKey: string;
  /** Symbol used in nav and rank badge */
  icon: string;
  /** Accent color for visual differentiation */
  accent: string;
  /** Whether this rank is recognized as a Discord role */
  discordRole: boolean;
  /** Static perks shown on the ranks page (already short and rank-neutral) */
  perks: string[];
};

export const RANK_META: Record<Rank, RankMeta> = {
  new_stander: {
    id: "new_stander",
    minEP: 0,
    labelKey: "ranks.labels.new_stander",
    detailKey: "ranks.details.new_stander",
    icon: "○",
    accent: "#3a5070",
    discordRole: false,
    perks: ["Chapter 1 unlocked", "Daily quests roll"],
  },
  active: {
    id: "active",
    minEP: 500,
    labelKey: "ranks.labels.active",
    detailKey: "ranks.details.active",
    icon: "·",
    accent: "#00aaff",
    discordRole: false,
    perks: ["Chapter 2", "+1 daily quest"],
  },
  consistent: {
    id: "consistent",
    minEP: 1000,
    labelKey: "ranks.labels.consistent",
    detailKey: "ranks.details.consistent",
    icon: "✦",
    accent: "#00e832",
    discordRole: false,
    perks: ["Weekly quests", "Streak multiplier"],
  },
  seed_candidate: {
    id: "seed_candidate",
    minEP: 2000,
    labelKey: "ranks.labels.seed_candidate",
    detailKey: "ranks.details.seed_candidate",
    icon: "✺",
    accent: "#ffe600",
    discordRole: false,
    perks: ["Moderator Gate", "Community quest tier"],
  },
  seed: {
    id: "seed",
    minEP: 3000,
    labelKey: "ranks.labels.seed",
    detailKey: "ranks.details.seed",
    icon: "❂",
    accent: "#00b020",
    discordRole: true,
    perks: ["Squad selection", "Squad mentor channels"],
  },
  sprout: {
    id: "sprout",
    minEP: 4000,
    labelKey: "ranks.labels.sprout",
    detailKey: "ranks.details.sprout",
    icon: "✿",
    accent: "#9945ff",
    discordRole: true,
    perks: ["Weekly highlight slot", "Mentor tasks"],
  },
  flower: {
    id: "flower",
    minEP: 8000,
    labelKey: "ranks.labels.flower",
    detailKey: "ranks.details.flower",
    icon: "❀",
    accent: "#ff3366",
    discordRole: true,
    perks: ["Standards-setter", "Pillar status"],
  },
};

export const RANK_LADDER: RankMeta[] = RANK_THRESHOLDS.map((threshold) => RANK_META[threshold.rank]);

export function getRankMeta(rank: Rank): RankMeta {
  return RANK_META[rank];
}

export function rankProgress(ep: number) {
  const current = rankFromEP(ep);
  const meta = RANK_META[current];
  const next = nextRankThreshold(ep);
  const span = next ? next.min - meta.minEP : 0;
  const within = Math.max(0, ep - meta.minEP);
  const ratio = span > 0 ? Math.min(1, within / span) : 1;

  return {
    current: meta,
    next: next ? RANK_META[next.rank] : null,
    span,
    within,
    ratio,
    remaining: next ? Math.max(0, next.min - ep) : 0,
  };
}

export function isRankUnlocked(rank: Rank, current: Rank): boolean {
  return rankOrder(current) >= rankOrder(rank);
}
