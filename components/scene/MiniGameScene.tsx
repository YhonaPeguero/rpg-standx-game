"use client";

import type { Scene } from "@/types";
import { miniGameStars } from "@/lib/game/mastery";
import { ContentPickQTE } from "@/components/minigames/ContentPickQTE";
import { TradeTimingQTE } from "@/components/minigames/TradeTimingQTE";

type MiniGameSceneProps = Extract<Scene, { kind: "minigame" }> & {
  onMastery: (sceneId: string, stars: number) => void;
  onComplete: () => void;
};

// EP is granted from the star result inside ScenePlayer's mastery handler, so
// mini games only need to report how well the player did.
export function MiniGameScene({ id, gameId, onMastery, onComplete }: MiniGameSceneProps) {
  function finish(outcome: Parameters<typeof miniGameStars>[0]) {
    onMastery(id, miniGameStars(outcome));
    onComplete();
  }

  if (gameId === "trade_timing") {
    return <TradeTimingQTE onResult={(result) => finish(result.outcome)} />;
  }

  return <ContentPickQTE onResult={(result) => finish(result.outcome)} />;
}
