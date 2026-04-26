import type { Reward } from "@/types";

export function mergeRewards(...rewards: Reward[]): Reward {
  const codex = new Set<string>();
  let ep = 0;
  let stars = 0;
  let achievement: string | undefined;

  for (const reward of rewards) {
    ep += reward.ep ?? 0;
    stars += reward.stars ?? 0;
    achievement = reward.achievement ?? achievement;
    reward.codex?.forEach((entry) => codex.add(entry));
  }

  return {
    ...(ep > 0 ? { ep } : {}),
    ...(stars > 0 ? { stars } : {}),
    ...(codex.size > 0 ? { codex: Array.from(codex) } : {}),
    ...(achievement ? { achievement } : {}),
  };
}
