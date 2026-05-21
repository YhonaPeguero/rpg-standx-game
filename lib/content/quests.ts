import questsJson from "@content/quests.json";
import { z } from "zod";
import type { Quest } from "@/types";
import { gateSchema, rewardSchema } from "./schemas";

const questSchema = z.object({
  id: z.string(),
  kind: z.enum(["daily", "weekly", "community"]),
  i18nKey: z.string(),
  goal: z.number().int().positive(),
  category: z.enum(["engage", "content", "consistency", "community", "trading"]).optional(),
  reward: rewardSchema,
  unlock: z.array(gateSchema).optional(),
});

const questsSchema = z.array(questSchema).min(1);

export const quests: Quest[] = questsSchema.parse(questsJson);

export function getQuests(): Quest[] {
  return quests;
}

export function getQuestById(id: string): Quest | null {
  return quests.find((quest) => quest.id === id) ?? null;
}

export function getQuestsByKind(kind: Quest["kind"]): Quest[] {
  return quests.filter((quest) => quest.kind === kind);
}
