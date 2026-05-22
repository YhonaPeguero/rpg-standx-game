import { describe, expect, it } from "vitest";
import enUS from "@/messages/en-US.json";
import enGB from "@/messages/en-GB.json";
import esES from "@/messages/es-ES.json";
import ptBR from "@/messages/pt-BR.json";
import koKR from "@/messages/ko-KR.json";
import { getChapters } from "./loader";

type SceneOverlay = {
  lines?: unknown[];
  choices?: unknown[];
  questions?: { options?: unknown[] }[];
  options?: unknown[];
};

type ChapterOverlay = {
  title?: string;
  subtitle?: string;
  scenes?: Record<string, SceneOverlay>;
};

type MessagesShape = {
  content?: { chapters?: Record<string, ChapterOverlay> };
};

const locales: Record<string, MessagesShape> = {
  "en-US": enUS as MessagesShape,
  "en-GB": enGB as MessagesShape,
  "es-ES": esES as MessagesShape,
  "pt-BR": ptBR as MessagesShape,
  "ko-KR": koKR as MessagesShape,
};

const localizableSceneKinds = new Set(["dialog", "quiz", "reflection"]);

describe("chapter localization parity", () => {
  const canonical = getChapters();

  for (const [locale, messages] of Object.entries(locales)) {
    const overlay = messages.content?.chapters;

    if (!overlay) {
      it(`${locale}: no content.chapters overlay — falls back to canonical (skipped)`, () => {
        expect(overlay).toBeUndefined();
      });
      continue;
    }

    it(`${locale}: covers every canonical chapter id`, () => {
      const canonicalIds = canonical.map((c) => c.id).sort();
      const overlayIds = Object.keys(overlay).sort();
      expect(overlayIds).toEqual(canonicalIds);
    });

    for (const chapter of canonical) {
      const chapterOverlay = overlay[chapter.id];
      if (!chapterOverlay) continue;

      it(`${locale}: ${chapter.id} has matching scene shapes`, () => {
        const scenes = chapterOverlay.scenes ?? {};

        for (const scene of chapter.scenes) {
          const sceneOverlay = scenes[scene.id];
          if (!sceneOverlay) {
            if (localizableSceneKinds.has(scene.kind)) {
              throw new Error(`${locale}/${chapter.id}/${scene.id}: missing overlay for ${scene.kind} scene`);
            }
            continue;
          }

          if (scene.kind === "dialog") {
            expect(
              sceneOverlay.lines?.length,
              `${locale}/${chapter.id}/${scene.id}: dialog lines count`,
            ).toBe(scene.lines.length);

            if (scene.choices?.length) {
              expect(
                sceneOverlay.choices?.length,
                `${locale}/${chapter.id}/${scene.id}: choices count`,
              ).toBe(scene.choices.length);
            }
          }

          if (scene.kind === "quiz") {
            expect(
              sceneOverlay.questions?.length,
              `${locale}/${chapter.id}/${scene.id}: questions count`,
            ).toBe(scene.questions.length);

            scene.questions.forEach((question, index) => {
              const overlayQuestion = sceneOverlay.questions?.[index];
              expect(
                overlayQuestion?.options?.length,
                `${locale}/${chapter.id}/${scene.id}/q${index}: options count`,
              ).toBe(question.options.length);
            });
          }

          if (scene.kind === "reflection" && sceneOverlay.options) {
            const canonical = scene.options ?? [];
            expect(
              sceneOverlay.options.length,
              `${locale}/${chapter.id}/${scene.id}: reflection options count`,
            ).toBe(canonical.length);
          }
        }
      });
    }
  }
});
