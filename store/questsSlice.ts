import type { StateCreator } from "zustand";
import type { GameStore } from "@/store";
import { rollDailyQuestIds, utcDayKey } from "@/lib/game/quests";

export type QuestState = {
  activeDaily: string[];
  progress: Record<string, number>;
  claimed: string[];
  lastRollISO: string;
};

export type QuestsSlice = {
  questState: QuestState;
  rollDailyIfNeeded: () => void;
  incrementQuest: (id: string, by?: number) => void;
  markQuestComplete: (id: string) => void;
  claimQuest: (id: string) => void;
  resetQuestsForToday: () => void;
};

function emptyState(): QuestState {
  return { activeDaily: [], progress: {}, claimed: [], lastRollISO: "" };
}

export const createQuestsSlice: StateCreator<GameStore, [], [], QuestsSlice> = (set, get) => ({
  questState: emptyState(),
  rollDailyIfNeeded: () => {
    const today = utcDayKey();
    const { questState } = get();

    if (questState.lastRollISO === today && questState.activeDaily.length > 0) {
      return;
    }

    const carryWeekly = Object.fromEntries(
      Object.entries(questState.progress).filter(([id]) => !questState.activeDaily.includes(id)),
    );
    const carryClaimed = questState.claimed.filter((id) => !questState.activeDaily.includes(id));

    set({
      questState: {
        activeDaily: rollDailyQuestIds(),
        progress: carryWeekly,
        claimed: carryClaimed,
        lastRollISO: today,
      },
    });
  },
  incrementQuest: (id, by = 1) =>
    set((state) => ({
      questState: {
        ...state.questState,
        progress: {
          ...state.questState.progress,
          [id]: (state.questState.progress[id] ?? 0) + by,
        },
      },
    })),
  markQuestComplete: (id) =>
    set((state) => ({
      questState: {
        ...state.questState,
        progress: { ...state.questState.progress, [id]: Number.POSITIVE_INFINITY },
      },
    })),
  claimQuest: (id) =>
    set((state) => ({
      questState: {
        ...state.questState,
        claimed: state.questState.claimed.includes(id)
          ? state.questState.claimed
          : [...state.questState.claimed, id],
      },
    })),
  resetQuestsForToday: () => set({ questState: emptyState() }),
});
