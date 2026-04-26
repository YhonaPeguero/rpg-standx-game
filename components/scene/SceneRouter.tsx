"use client";

import type { Reward, Scene } from "@/types";
import { DialogScene } from "./DialogScene";
import { QuizScene } from "./QuizScene";
import { ReflectionScene } from "./ReflectionScene";

type SceneRouterProps = {
  scene: Scene;
  onReward: (reward: Reward) => void;
  onQuestionReward: (ep: number) => void;
  onMastery: (sceneId: string, stars: number) => void;
  onComplete: () => void;
};

export function SceneRouter({ scene, onReward, onQuestionReward, onMastery, onComplete }: SceneRouterProps) {
  switch (scene.kind) {
    case "dialog":
      return (
        <DialogScene
          lines={scene.lines}
          choices={scene.choices}
          educational={scene.educational}
          onReward={onReward}
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
      return null;
  }
}
