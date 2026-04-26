"use client";

import type { Reward, Scene, SquadId } from "@/types";
import { DialogScene } from "./DialogScene";
import { MiniGameScene } from "./MiniGameScene";
import { QuizScene } from "./QuizScene";
import { ReflectionScene } from "./ReflectionScene";

type SceneRouterProps = {
  scene: Scene;
  onReward: (reward: Reward) => void;
  onQuestionReward: (ep: number) => void;
  onMastery: (sceneId: string, stars: number) => void;
  onSquad: (squad: SquadId) => void;
  onComplete: () => void;
};

export function SceneRouter({ scene, onReward, onQuestionReward, onMastery, onSquad, onComplete }: SceneRouterProps) {
  switch (scene.kind) {
    case "dialog":
      return (
        <DialogScene
          lines={scene.lines}
          choices={scene.choices}
          educational={scene.educational}
          onReward={onReward}
          onSquad={onSquad}
          onComplete={onComplete}
        />
      );
    case "quiz":
      return (
        <QuizScene
          sceneId={scene.id}
          questions={scene.questions}
          passingScore={scene.passingScore}
          onQuestionReward={onQuestionReward}
          onMastery={onMastery}
          onComplete={onComplete}
        />
      );
    case "reflection":
      return <ReflectionScene prompt={scene.prompt} options={scene.options} onComplete={onComplete} />;
    case "minigame":
      return <MiniGameScene {...scene} onReward={onReward} onMastery={onMastery} onComplete={onComplete} />;
  }
}
