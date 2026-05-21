import type { StateCreator } from "zustand";
import type { Player, Rank, SquadId } from "@/types";
import type { GameStore } from "@/store";
import { defaultLocale } from "@/lib/i18n/config";
import { rankFromEP } from "@/lib/game/ep";
import { nextStreakDays } from "@/lib/game/streak";

export type PlayerSlice = {
  player: Player;
  setDisplayName: (name: string) => void;
  addEP: (delta: number) => void;
  setRank: (rank: Rank) => void;
  setSquad: (squad: SquadId) => void;
  addCodex: (id: string) => void;
  unlockAchievement: (id: string) => void;
  setMastery: (sceneId: string, stars: number) => void;
  bumpStreak: () => void;
};

const initialSquadXP: Record<SquadId, number> = {
  creative: 0,
  content_research: 0,
  tech_support: 0,
  outreach: 0,
  offline: 0,
};

export function createDefaultPlayer(): Player {
  const now = new Date().toISOString();

  return {
    id: "local-stander",
    displayName: "STANDER",
    ep: 0,
    rank: "new_stander",
    squad: null,
    squadXP: { ...initialSquadXP },
    streakDays: 0,
    lastActiveAt: now,
    mastery: {},
    codexUnlocks: [],
    achievements: [],
    createdAt: now,
    locale: defaultLocale,
  };
}

export const createPlayerSlice: StateCreator<GameStore, [], [], PlayerSlice> = (set) => ({
  player: createDefaultPlayer(),
  setDisplayName: (name) =>
    set((state) => ({
      player: { ...state.player, displayName: name.trim() || "STANDER" },
    })),
  addEP: (delta) =>
    set((state) => {
      const ep = Math.max(0, state.player.ep + delta);

      return {
        player: { ...state.player, ep, rank: rankFromEP(ep) },
      };
    }),
  setRank: (rank) =>
    set((state) => ({
      player: { ...state.player, rank },
    })),
  setSquad: (squad) =>
    set((state) => ({
      player: { ...state.player, squad },
    })),
  addCodex: (id) =>
    set((state) => ({
      player: state.player.codexUnlocks.includes(id)
        ? state.player
        : { ...state.player, codexUnlocks: [...state.player.codexUnlocks, id] },
    })),
  unlockAchievement: (id) =>
    set((state) => ({
      player: state.player.achievements.includes(id)
        ? state.player
        : { ...state.player, achievements: [...state.player.achievements, id] },
    })),
  setMastery: (sceneId, stars) =>
    set((state) => ({
      player: {
        ...state.player,
        mastery: { ...state.player.mastery, [sceneId]: Math.max(0, Math.min(3, stars)) },
      },
    })),
  bumpStreak: () =>
    set((state) => {
      const now = new Date();
      const streakDays = nextStreakDays(state.player.lastActiveAt, state.player.streakDays, now);

      if (streakDays === state.player.streakDays) {
        return state;
      }

      return {
        player: {
          ...state.player,
          streakDays,
          lastActiveAt: now.toISOString(),
        },
      };
    }),
});
