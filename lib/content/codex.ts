import codexJson from "@content/codex.json";
import achievementsJson from "@content/achievements.json";
import type { Achievement, CodexEntry } from "@/types";
import { achievementsSchema, codexSchema } from "./schemas";

export const codexEntries: CodexEntry[] = codexSchema.parse(codexJson);
export const achievements: Achievement[] = achievementsSchema.parse(achievementsJson);

export function getCodexEntries() {
  return codexEntries;
}

export function getAchievements() {
  return achievements;
}
