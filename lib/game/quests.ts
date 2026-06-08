import type { Quest } from "@/types";
import { getQuestsByKind } from "@/lib/content/quests";

export const DAILY_QUEST_COUNT = 1;

export function utcDayKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function hashSeed(key: string): number {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffle<T>(items: T[], seed: number): T[] {
  const copy = items.slice();
  let state = seed || 1;

  for (let i = copy.length - 1; i > 0; i -= 1) {
    state = Math.imul(state, 1664525) + 1013904223;
    const j = ((state >>> 0) % (i + 1)) | 0;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function rollDailyQuestIds(date = new Date()): string[] {
  const dailies = getQuestsByKind("daily");
  if (dailies.length === 0) return [];
  const seed = hashSeed(utcDayKey(date));
  return shuffle(dailies, seed).slice(0, Math.min(DAILY_QUEST_COUNT, dailies.length)).map((quest) => quest.id);
}

export function hoursUntilUtcMidnight(now = new Date()): number {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  const ms = next - now.getTime();
  return Math.max(0, Math.ceil(ms / 3_600_000));
}

export function questIsReadyToClaim(quest: Quest, progress: number): boolean {
  return progress >= quest.goal;
}
