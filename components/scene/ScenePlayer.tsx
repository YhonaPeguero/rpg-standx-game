"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMessages } from "next-intl";
import type { Chapter, Reward } from "@/types";
import { useGameStore } from "@/store";
import { localizeChapter } from "@/lib/content/localize";
import { epForStars } from "@/lib/game/epTiers";
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
  const advancingRef = useRef(false);
  // Totals accumulated across this chapter run, shown on the reward screen.
  const earnedEpRef = useRef(0);
  const earnedStarsRef = useRef(0);
  const earnedCodexRef = useRef<Set<string>>(new Set());
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
    advancingRef.current = false;
  }, [sceneIndex]);

  useEffect(() => {
    setCurrentChapter(localizedChapter.id);
  }, [localizedChapter.id, setCurrentChapter]);

  useEffect(() => {
    audioEngine.startAmbient(localizedChapter.zone);
    return () => audioEngine.stopAmbient();
  }, [localizedChapter.zone]);

  function grantEp(amount: number) {
    if (amount <= 0) return;
    addEP(amount);
    earnedEpRef.current += amount;
    audioEngine.playEp();
  }

  function applyReward(reward: Reward) {
    grantEp(reward.ep ?? 0);

    reward.codex?.forEach((id) => {
      addCodex(id);
      earnedCodexRef.current.add(id);
    });

    if (reward.achievement) {
      unlockAchievement(reward.achievement);
    }
  }

  function completeScene() {
    if (advancingRef.current) {
      return;
    }
    advancingRef.current = true;

    markSceneComplete(scene.id);

    if (scene.kind === "reflection") {
      unlockAchievement("first_reflection");
    }

    if (sceneIndex < localizedChapter.scenes.length - 1) {
      setSceneIndex((value) => value + 1);
      return;
    }

    // Chapter completion grants codex/achievement/story — EP is earned through
    // the chapter's graded scenes and choices, not handed out at the end.
    applyReward(localizedChapter.reward);
    unlockAchievement(`${localizedChapter.id}_complete`);

    if (localizedChapter.id === "act1-c6-seed-hall") {
      unlockAchievement("act1_complete");
    }

    markChapterComplete(localizedChapter.id);
    audioEngine.stopAmbient();
    audioEngine.playComplete();
    setCompleteReward({
      ep: earnedEpRef.current,
      stars: earnedStarsRef.current,
      codex: Array.from(earnedCodexRef.current),
      achievement: localizedChapter.reward.achievement,
    });
  }

  function handleMastery(sceneId: string, stars: number) {
    setMastery(sceneId, stars);
    earnedStarsRef.current += stars;
    grantEp(epForStars(stars));

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

  if (!scene) {
    return null;
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
              onMastery={handleMastery}
              onSquad={handleSquad}
              onComplete={completeScene}
            />
          </motion.div>
        </AnimatePresence>
      </GameStage>
    </div>
  );
}
