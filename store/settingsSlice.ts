import type { StateCreator } from "zustand";
import type { Locale } from "@/lib/i18n/config";
import { defaultLocale } from "@/lib/i18n/config";
import type { GameStore } from "@/store";

export type SettingsSlice = {
  locale: Locale;
  audioEnabled: boolean;
  reduceMotion: boolean;
  volume: number;
  setLocale: (locale: Locale) => void;
  toggleAudio: () => void;
  toggleReduceMotion: () => void;
  setVolume: (volume: number) => void;
};

export const createSettingsSlice: StateCreator<GameStore, [], [], SettingsSlice> = (set) => ({
  locale: defaultLocale,
  audioEnabled: true,
  reduceMotion: false,
  volume: 0.4,
  setLocale: (locale) =>
    set((state) => ({
      locale,
      player: { ...state.player, locale },
    })),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  toggleReduceMotion: () => set((state) => ({ reduceMotion: !state.reduceMotion })),
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
});
