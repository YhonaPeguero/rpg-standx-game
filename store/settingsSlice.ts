import type { StateCreator } from "zustand";
import type { GameStore } from "@/store";

export type SettingsSlice = {
  locale: "en" | "pt-BR";
  audioEnabled: boolean;
  reduceMotion: boolean;
  setLocale: (locale: "en" | "pt-BR") => void;
  toggleAudio: () => void;
  toggleReduceMotion: () => void;
};

export const createSettingsSlice: StateCreator<GameStore, [], [], SettingsSlice> = (set) => ({
  locale: "en",
  audioEnabled: true,
  reduceMotion: false,
  setLocale: (locale) =>
    set((state) => ({
      locale,
      player: { ...state.player, locale },
    })),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
});
