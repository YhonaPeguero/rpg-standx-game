/**
 * Single source of truth for Engage Point reward sizes.
 *
 * EP is a *conceptual* learning metric, not StandX's real score. Rewards are
 * intentionally tiered and earned through performance so points feel meaningful:
 *   - SMALL  (30): a solid, deliberate action (good choice, 1-star challenge).
 *   - MEDIUM (50): a strong result (best choice, 2-star challenge).
 *   - LARGE  (80): mastery (3-star challenge).
 *
 * Poor/risky choices and narrative-only beats (reflection, flavor dialog,
 * chapter completion) award 0 EP — their reward is codex/achievement/story.
 */
export const EP = {
  SMALL: 30,
  MEDIUM: 50,
  LARGE: 80,
} as const;

export type EpTier = (typeof EP)[keyof typeof EP];

/** Maps a 0-3 star result to its EP reward. Used by quizzes and mini games. */
export function epForStars(stars: number): number {
  const clamped = Math.max(0, Math.min(3, Math.round(stars)));
  switch (clamped) {
    case 3:
      return EP.LARGE;
    case 2:
      return EP.MEDIUM;
    case 1:
      return EP.SMALL;
    default:
      return 0;
  }
}
