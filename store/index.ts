import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Player } from "@/types";
import { normalizeLocale } from "@/lib/i18n/config";
import { createPlayerSlice, type PlayerSlice } from "./playerSlice";
import { createProgressSlice, type ProgressSlice } from "./progressSlice";
import { createQuestsSlice, type QuestsSlice, type QuestState } from "./questsSlice";
import { createSettingsSlice, type SettingsSlice } from "./settingsSlice";

export type GameStore = PlayerSlice & ProgressSlice & SettingsSlice & QuestsSlice;

type PersistedGameStore = {
  player: Player;
  completedScenes: string[];
  completedChapters: string[];
  currentChapterId: string | null;
  questState: QuestState;
};

const createGameStore: StateCreator<GameStore, [], [], GameStore> = (...args) => ({
  ...createPlayerSlice(...args),
  ...createProgressSlice(...args),
  ...createSettingsSlice(...args),
  ...createQuestsSlice(...args),
});

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function persistedFromUnknown(value: unknown): PersistedGameStore | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Partial<Record<keyof PersistedGameStore, unknown>>;
  if (!record.player || typeof record.player !== "object") {
    return null;
  }

  const player = record.player as Player & { locale?: unknown };
  const normalizedLocale = normalizeLocale(typeof player.locale === "string" ? player.locale : null);

  return {
    player: { ...player, locale: normalizedLocale } as Player,
    completedScenes: stringArray(record.completedScenes),
    completedChapters: stringArray(record.completedChapters),
    currentChapterId: typeof record.currentChapterId === "string" ? record.currentChapterId : null,
    questState:
      record.questState && typeof record.questState === "object"
        ? (record.questState as QuestState)
        : { activeDaily: [], progress: {}, claimed: [], lastRollISO: "" },
  };
}

export const useGameStore = create<GameStore>()(
  persist<GameStore, [], [], PersistedGameStore>(createGameStore, {
    name: "standx-rpg-store",
    storage: createJSONStorage<PersistedGameStore>(() => localStorage),
    partialize: (state) => ({
      player: state.player,
      completedScenes: Array.from(state.completedScenes),
      completedChapters: Array.from(state.completedChapters),
      currentChapterId: state.currentChapterId,
      questState: state.questState,
    }),
    merge: (persistedState, currentState) => {
      const persisted = persistedFromUnknown(persistedState);

      if (!persisted) {
        return currentState;
      }

      return {
        ...currentState,
        player: persisted.player,
        locale: persisted.player.locale,
        completedScenes: new Set(persisted.completedScenes),
        completedChapters: new Set(persisted.completedChapters),
        currentChapterId: persisted.currentChapterId,
        questState: persisted.questState,
      };
    },
  }),
);
