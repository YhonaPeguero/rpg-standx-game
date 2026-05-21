import type { StateCreator } from "zustand";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import type { GameStore } from "@/store";

export type SettingsSlice = {
  locale: Locale;
  audioEnabled: boolean;
  reduceMotion: boolean;
  setLocale: (locale: Locale) => void;
  toggleAudio: () => void;
  toggleReduceMotion: () => void;
};

export const createSettingsSlice: StateCreator<GameStore, [], [], SettingsSlice> = (set) => ({
  locale: defaultLocale,
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
