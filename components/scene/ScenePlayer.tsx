"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMessages } from "next-intl";
import type { Chapter, Reward } from "@/types";
import { useGameStore } from "@/store";
import { localizeChapter } from "@/lib/content/localize";
import { mergeRewards } from "@/lib/game/rewards";
import { audioEngine } from "@/lib/audio/engine";
import { GameStage } from "./GameStage";
import { RewardScreen } from "./RewardScreen";
import { SceneRouter } from "./SceneRouter";

type MessagesWithChapters = {
  content?: { chapters?: Record<string, unknown> };
};

function hasChapterOverlay(messages: unknown, chapterId: string, locale: string): boolean {
  if (locale.startsWith("en")) return true;
  const overlay = (messages as MessagesWithChapters).content?.chapters?.[chapterId];
  return overlay !== undefined && overlay !== null;
}

type ScenePlayerProps = {
  chapter: Chapter;
};

export function ScenePlayer({ chapter }: ScenePlayerProps) {
  const messages = useMessages();
  const locale = useGameStore((state) => state.locale);
  const localizedChapter = localizeChapter(chapter, messages);
  const isLocalized = hasChapterOverlay(messages, chapter.id, locale);
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
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const scene = localizedChapter.scenes[sceneIndex];

  useEffect(() => {
    setCurrentChapter(localizedChapter.id);
  }, [localizedChapter.id, setCurrentChapter]);

  useEffect(() => {
    audioEngine.startAmbient(localizedChapter.zone);
    return () => audioEngine.stopAmbient();
  }, [localizedChapter.zone]);

  function applyReward(reward: Reward) {
    if (reward.ep) {
      addEP(reward.ep);
      audioEngine.playEp();
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
    audioEngine.stopAmbient();
    audioEngine.playComplete();
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
    <div className="mx-auto max-w-7xl py-2 md:py-4">
      <GameStage
        act={localizedChapter.act}
        mode={scene.kind === "dialog" ? "dialog" : "panel"}
        notLocalized={!isLocalized}
        sceneIndex={sceneIndex}
        sceneTotal={localizedChapter.scenes.length}
        subtitle={localizedChapter.subtitle}
        title={localizedChapter.title}
        zone={localizedChapter.zone}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: 8 }}
            key={scene.id}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <SceneRouter
              scene={scene}
              onReward={applyReward}
              onQuestionReward={(ep) => {
                addEP(ep);
                audioEngine.playEp();
              }}
              onMastery={handleMastery}
              onSquad={handleSquad}
              onComplete={() => completeScene(scene.kind === "reflection" ? { ep: 10 } : {})}
            />
          </motion.div>
        </AnimatePresence>
      </GameStage>
    </div>
  );
}
