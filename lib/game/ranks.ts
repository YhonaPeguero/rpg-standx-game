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
  /** Optional i18n key for a custom requirement label (overrides "<minEP> EP"). */
  requirementKey?: string;
  /** Static perks shown on the ranks page (already short and rank-neutral) */
  perks: string[];
};

/** EP threshold per rank, derived from the single source of truth in ep.ts. */
const MIN_EP: Record<Rank, number> = RANK_THRESHOLDS.reduce(
  (acc, { rank, min }) => {
    acc[rank] = min;
    return acc;
  },
  {} as Record<Rank, number>,
);

// Brand colors per tier: SEED = green, SPROUT = light sky blue, FLOWER = pink.
export const RANK_META: Record<Rank, RankMeta> = {
  new_stander: {
    id: "new_stander",
    minEP: MIN_EP.new_stander,
    labelKey: "ranks.labels.new_stander",
    detailKey: "ranks.details.new_stander",
    icon: "○",
    accent: "#3a5070",
    discordRole: false,
    perks: ["Act I unlocked", "Daily quests roll"],
  },
  seed: {
    id: "seed",
    minEP: MIN_EP.seed,
    labelKey: "ranks.labels.seed",
    detailKey: "ranks.details.seed",
    icon: "❂",
    accent: "#00e832",
    discordRole: true,
    perks: ["Squad selection", "Squad mentor channels"],
  },
  sprout: {
    id: "sprout",
    minEP: MIN_EP.sprout,
    labelKey: "ranks.labels.sprout",
    detailKey: "ranks.details.sprout",
    icon: "✿",
    accent: "#6fd2ff",
    discordRole: true,
    requirementKey: "req.sprout",
    perks: ["Weekly highlight slot", "Mentor tasks"],
  },
  flower: {
    id: "flower",
    minEP: MIN_EP.flower,
    labelKey: "ranks.labels.flower",
    detailKey: "ranks.details.flower",
    icon: "❀",
    accent: "#ff6ba9",
    discordRole: true,
    requirementKey: "req.flower",
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
