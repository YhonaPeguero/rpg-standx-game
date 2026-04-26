import type { Chapter } from "@/types";

type LocalizedScene = {
  lines?: string[];
  choices?: { label?: string; feedback?: string }[];
  prompt?: string;
  options?: string[];
  questions?: { prompt?: string; options?: string[]; explanation?: string }[];
};

type LocalizedChapter = {
  title?: string;
  subtitle?: string;
  scenes?: Record<string, LocalizedScene>;
};

type LocalizedMessages = {
  content?: {
    chapters?: Record<string, LocalizedChapter>;
  };
};

export function localizeChapter(chapter: Chapter, messages: unknown): Chapter {
  const localizedMessages = messages as LocalizedMessages;
  const overlay = localizedMessages.content?.chapters?.[chapter.id];

  if (!overlay) {
    return chapter;
  }

  return {
    ...chapter,
    title: overlay.title ?? chapter.title,
    subtitle: overlay.subtitle ?? chapter.subtitle,
    scenes: chapter.scenes.map((scene) => {
      const sceneOverlay = overlay.scenes?.[scene.id];

      if (!sceneOverlay) {
        return scene;
      }

      if (scene.kind === "dialog") {
        return {
          ...scene,
          lines: scene.lines.map((line, index) => ({ ...line, text: sceneOverlay.lines?.[index] ?? line.text })),
          choices: scene.choices?.map((choice, index) => ({
            ...choice,
            label: sceneOverlay.choices?.[index]?.label ?? choice.label,
            feedback: sceneOverlay.choices?.[index]?.feedback ?? choice.feedback,
          })),
        };
      }

      if (scene.kind === "quiz") {
        return {
          ...scene,
          questions: scene.questions.map((question, index) => ({
            ...question,
            prompt: sceneOverlay.questions?.[index]?.prompt ?? question.prompt,
            explanation: sceneOverlay.questions?.[index]?.explanation ?? question.explanation,
            options: question.options.map((option, optionIndex) => ({
              ...option,
              text: sceneOverlay.questions?.[index]?.options?.[optionIndex] ?? option.text,
            })),
          })),
        };
      }

      if (scene.kind === "reflection") {
        return {
          ...scene,
          prompt: sceneOverlay.prompt ?? scene.prompt,
          options: sceneOverlay.options ?? scene.options,
        };
      }

      return scene;
    }),
  };
}
