"use client";

import type { Scene } from "@/types";
import { miniGameStars } from "@/lib/game/mastery";
import { ContentPickQTE } from "@/components/minigames/ContentPickQTE";
import { TradeTimingQTE } from "@/components/minigames/TradeTimingQTE";

type MiniGameSceneProps = Extract<Scene, { kind: "minigame" }> & {
  onReward: (reward: { ep?: number; stars?: number }) => void;
  onMastery: (sceneId: string, stars: number) => void;
  onComplete: () => void;
};

export function MiniGameScene({ id, gameId, onReward, onMastery, onComplete }: MiniGameSceneProps) {
  if (gameId === "trade_timing") {
    return (
      <TradeTimingQTE
        onResult={(result) => {
          const stars = miniGameStars(result.outcome);
          onReward({ ep: result.ep, stars });
          onMastery(id, stars);
          onComplete();
        }}
      />
    );
  }

  return (
    <ContentPickQTE
      onResult={(result) => {
        const stars = miniGameStars(result.outcome);
        onReward({ ep: result.ep, stars });
        onMastery(id, stars);
        onComplete();
      }}
    />
  );
}
