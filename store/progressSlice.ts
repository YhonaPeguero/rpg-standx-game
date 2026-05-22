import type { StateCreator } from "zustand";
import type { GameStore } from "@/store";

export type ProgressSlice = {
  completedScenes: Set<string>;
  completedChapters: Set<string>;
  currentChapterId: string | null;
  markSceneComplete: (id: string) => void;
  markChapterComplete: (id: string) => void;
  setCurrentChapter: (id: string) => void;
};

export const createProgressSlice: StateCreator<GameStore, [], [], ProgressSlice> = (set, get) => ({
  completedScenes: new Set<string>(),
  completedChapters: new Set<string>(),
  currentChapterId: null,
  markSceneComplete: (id) => {
    set((state) => ({
      completedScenes: new Set(state.completedScenes).add(id),
    }));
    get().recordQuestEvent({
      type: "scene_complete",
      sceneId: id,
      chapterId: get().currentChapterId,
    });
  },
  markChapterComplete: (id) => {
    set((state) => ({
      completedChapters: new Set(state.completedChapters).add(id),
    }));
    get().recordQuestEvent({ type: "chapter_complete", chapterId: id });
  },
  setCurrentChapter: (id) => set({ currentChapterId: id }),
});
