import type { Player, Quest } from "@/types";
import type { QuestState } from "@/store/questsSlice";
import { quests as ALL_QUESTS } from "@/lib/content/quests";
import { chapterUnlocked } from "@/lib/game/gates";

export type QuestEvent =
  | { type: "scene_complete"; sceneId: string; chapterId: string | null }
  | { type: "chapter_complete"; chapterId: string }
  | { type: "codex_unlock"; codexId: string }
  | { type: "mastery"; sceneId: string; stars: number }
  | { type: "streak_day"; days: number };

const COMMUNITY_EVENT_CHAPTERS = new Set([
  "act1-c2-discord-plaza",
  "act1-c3-event-arena",
]);

const COMMUNITY_THREAD_CHAPTERS = new Set(["act1-c4-content-district"]);

const QUALITY_MASTERY: Record<string, number> = {
  "s4-2-content-pick": 3,
};

type ProgressDelta = {
  questId: string;
  /** When `set` is provided it overrides any existing value (clamped to goal). Otherwise `by` is added. */
  by?: number;
  set?: number;
};

function deltasForEvent(event: QuestEvent): ProgressDelta[] {
  switch (event.type) {
    case "scene_complete":
      return [{ questId: "daily_reaction", by: 1 }];
    case "chapter_complete": {
      const out: ProgressDelta[] = [];
      if (COMMUNITY_EVENT_CHAPTERS.has(event.chapterId)) {
        out.push({ questId: "daily_event", by: 1 });
      }
      if (COMMUNITY_THREAD_CHAPTERS.has(event.chapterId)) {
        out.push({ questId: "community_thread", by: 1 });
      }
      return out;
    }
    case "codex_unlock":
      return [{ questId: "daily_content", by: 1 }];
    case "mastery": {
      const threshold = QUALITY_MASTERY[event.sceneId];
      if (threshold && event.stars >= threshold) {
        return [{ questId: "weekly_quality", by: 1 }];
      }
      return [];
    }
    case "streak_day":
      return [{ questId: "weekly_streak", set: event.days }];
  }
}

function questPasses(quest: Quest, player: Player, completed: Set<string>): boolean {
  if (!quest.unlock || quest.unlock.length === 0) return true;
  return chapterUnlocked(quest.unlock, player, completed);
}

function questEligible(
  quest: Quest,
  state: QuestState,
  player: Player,
  completed: Set<string>,
): boolean {
  if (state.claimed.includes(quest.id)) return false;
  if (quest.kind === "daily" && !state.activeDaily.includes(quest.id)) return false;
  return questPasses(quest, player, completed);
}

export function applyQuestEvent(
  state: QuestState,
  event: QuestEvent,
  player: Player,
  completed: Set<string>,
): QuestState {
  const deltas = deltasForEvent(event);
  if (deltas.length === 0) return state;

  let progress = state.progress;
  let mutated = false;

  for (const delta of deltas) {
    const quest = ALL_QUESTS.find((q) => q.id === delta.questId);
    if (!quest) continue;
    if (!questEligible(quest, state, player, completed)) continue;

    const current = progress[delta.questId] ?? 0;
    const desired = delta.set !== undefined ? delta.set : current + (delta.by ?? 0);
    const next = Math.min(quest.goal, Math.max(current, desired));

    if (next !== current) {
      if (!mutated) {
        progress = { ...progress };
        mutated = true;
      }
      progress[delta.questId] = next;
    }
  }

  if (!mutated) return state;

  return { ...state, progress };
}
