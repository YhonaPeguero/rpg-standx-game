"use client";

import { useEffect, useState } from "react";
import { useMessages } from "next-intl";
import type { Chapter, Reward } from "@/types";
import { useGameStore } from "@/store";
import { localizeChapter } from "@/lib/content/localize";
import { mergeRewards } from "@/lib/game/rewards";
import { Card } from "@/components/ui/Card";
import { RewardScreen } from "./RewardScreen";
import { SceneRouter } from "./SceneRouter";

type ScenePlayerProps = {
  chapter: Chapter;
};

export function ScenePlayer({ chapter }: ScenePlayerProps) {
  const messages = useMessages();
  const localizedChapter = localizeChapter(chapter, messages);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [completeReward, setCompleteReward] = useState<Reward | null>(null);
  const addEP = useGameStore((state) => state.addEP);
  const addCodex = useGameStore((state) => state.addCodex);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);
  const setSquad = useGameStore((state) => state.setSquad);
  const setMastery = useGameStore((state) => state.setMastery);
  const markSceneComplete = useGameStore((state) => state.markSceneComplete);
  const markChapterComplete = useGameStore((state) => state.markChapterComplete);
  const setCurrentChapter = useGameStore((state) => state.setCurrentChapter);
  const scene = localizedChapter.scenes[sceneIndex];

  useEffect(() => {
    setCurrentChapter(localizedChapter.id);
  }, [localizedChapter.id, setCurrentChapter]);

  function applyReward(reward: Reward) {
    if (reward.ep) {
      addEP(reward.ep);
    }

    reward.codex?.forEach(addCodex);

    if (reward.achievement) {
      unlockAchievement(reward.achievement);
    }
  }

  function completeScene(extraReward: Reward = {}) {
    markSceneComplete(scene.id);

    if (extraReward.ep || extraReward.stars || extraReward.codex?.length || extraReward.achievement) {
      applyReward(extraReward);
    }

    if (scene.kind === "reflection") {
      unlockAchievement("first_reflection");
    }

    if (sceneIndex < localizedChapter.scenes.length - 1) {
      setSceneIndex((value) => value + 1);
      return;
    }

    const reward = mergeRewards(extraReward, localizedChapter.reward);
    applyReward(localizedChapter.reward);
    unlockAchievement(`${localizedChapter.id}_complete`);

    if (localizedChapter.id === "act1-c6-seed-hall") {
      unlockAchievement("act1_complete");
    }

    markChapterComplete(localizedChapter.id);
    setCompleteReward(reward);
  }

  function handleMastery(sceneId: string, stars: number) {
    setMastery(sceneId, stars);

    if (sceneId === "s3-2-trade-timing" && stars === 3) {
      unlockAchievement("trade_setup_master");
    }

    if (sceneId === "s4-2-content-pick" && stars === 3) {
      unlockAchievement("content_depth_pick");
    }
  }

  function handleSquad(squad: Parameters<typeof setSquad>[0]) {
    setSquad(squad);
    unlockAchievement("squad_selected");
  }

  if (completeReward) {
    return <RewardScreen reward={completeReward} />;
  }

  return (
    <div className="mx-auto max-w-4xl py-4 md:py-10">
      <Card className="mb-5 p-4 md:p-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sx-gold">Act {localizedChapter.act}</p>
        <h1 className="mt-2 font-display text-2xl font-black uppercase tracking-[0.14em] text-sx-green md:text-4xl">
          {localizedChapter.title}
        </h1>
        {localizedChapter.subtitle ? <p className="mt-1 font-semibold text-sx-text">{localizedChapter.subtitle}</p> : null}
      </Card>
      <SceneRouter
        scene={scene}
        onReward={applyReward}
        onQuestionReward={(ep) => addEP(ep)}
        onMastery={handleMastery}
        onSquad={handleSquad}
        onComplete={() => completeScene(scene.kind === "reflection" ? { ep: 10 } : {})}
      />
    </div>
  );
}
