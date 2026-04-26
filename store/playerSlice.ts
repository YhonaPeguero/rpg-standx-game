import type { StateCreator } from "zustand";
import type { Player, Rank, SquadId } from "@/types";
import type { GameStore } from "@/store";

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
    squadXP: initialSquadXP,
    streakDays: 0,
    lastActiveAt: now,
    mastery: {},
    codexUnlocks: [],
    achievements: [],
    createdAt: now,
    locale: "en",
  };
}

export const createPlayerSlice: StateCreator<GameStore, [], [], PlayerSlice> = (set) => ({
  player: createDefaultPlayer(),
  setDisplayName: (name) =>
    set((state) => ({
      player: { ...state.player, displayName: name.trim() || "STANDER" },
    })),
  addEP: (delta) =>
    set((state) => ({
      player: { ...state.player, ep: Math.max(0, state.player.ep + delta) },
    })),
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
    set((state) => ({
      player: {
        ...state.player,
        streakDays: state.player.streakDays + 1,
        lastActiveAt: new Date().toISOString(),
      },
    })),
});
