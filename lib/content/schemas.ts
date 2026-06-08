import { z } from "zod";
import { locales } from "@/lib/i18n/config";

export const squadIdSchema = z.enum(["creative", "content_research", "tech_support", "outreach", "offline"]);

export const rankSchema = z.enum([
  "new_stander",
  "active",
  "consistent",
  "seed_candidate",
  "seed",
  "sprout",
  "flower",
]);

export const zoneIdSchema = z.enum([
  "void",
  "discord_plaza",
  "event_arena",
  "content_district",
  "moderator_gate",
  "seed_hall",
]);

export const characterIdSchema = z.enum([
  "sistema",
  "mira",
  "arttifex",
  "gaboo",
  "dave",
  "jinli",
  "doula",
  "stander",
]);

export const rewardSchema = z.object({
  ep: z.number().int().nonnegative().optional(),
  stars: z.number().int().min(0).max(3).optional(),
  codex: z.array(z.string()).optional(),
  achievement: z.string().optional(),
});

export const dialogLineSchema = z.object({
  character: characterIdSchema,
  text: z.string().min(1),
  pose: z.enum(["idle", "happy", "concerned", "excited"]).optional(),
});

export const choiceSchema = z.object({
  id: z.string(),
  label: z.string(),
  tag: z.enum(["EP", "LEARN", "RISK", "DEEP", "GENUINE", "SQUAD"]).optional(),
  reward: rewardSchema,
  squad: squadIdSchema.optional(),
  feedback: z.string().optional(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        correct: z.boolean(),
      }),
    )
    .min(2),
  explanation: z.string(),
});

export const sceneSchema = z.discriminatedUnion("kind", [
  z.object({
    id: z.string(),
    kind: z.literal("dialog"),
    lines: z.array(dialogLineSchema).min(1),
    choices: z.array(choiceSchema).optional(),
    educational: z.boolean().optional(),
  }),
  z.object({
    id: z.string(),
    kind: z.literal("quiz"),
    questions: z.array(quizQuestionSchema).min(1),
    passingScore: z.number().int().min(0),
  }),
  z.object({
    id: z.string(),
    kind: z.literal("minigame"),
    gameId: z.enum(["trade_timing", "content_pick"]),
    config: z.record(z.unknown()),
  }),
  z.object({
    id: z.string(),
    kind: z.literal("reflection"),
    prompt: z.string(),
    options: z.array(z.string()).optional(),
  }),
]);

export const gateSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("previous"), chapterId: z.string() }),
  z.object({ type: z.literal("ep"), value: z.number().int().nonnegative() }),
  z.object({ type: z.literal("rank"), value: rankSchema }),
  z.object({ type: z.literal("squad"), value: squadIdSchema }),
]);

export const chapterSchema = z.object({
  id: z.string(),
  act: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  zone: zoneIdSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  scenes: z.array(sceneSchema).min(1),
  unlock: z.array(gateSchema),
  reward: rewardSchema,
});

export const characterSchema = z.object({
  id: characterIdSchema,
  name: z.string(),
  role: z.string(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  bio: z.string(),
  mentorOf: squadIdSchema.optional(),
});

export const charactersSchema = z.array(characterSchema).min(1);

const localeFields = locales.reduce<Record<string, z.ZodOptional<z.ZodString>>>((acc, locale) => {
  acc[locale] = z.string().min(1).optional();
  return acc;
}, {});

export const localizedTextSchema = z
  .object({ "en-US": z.string().min(1), ...localeFields })
  .passthrough();

export const codexEntrySchema = z.object({
  id: z.string(),
  title: localizedTextSchema,
  body: localizedTextSchema,
  category: z.enum(["growth", "community", "trading", "content", "squads"]),
});

export const achievementSchema = z.object({
  id: z.string(),
  title: localizedTextSchema,
  description: localizedTextSchema,
});

export const codexSchema = z.array(codexEntrySchema).min(1);
export const achievementsSchema = z.array(achievementSchema).min(1);

export type ChapterContent = z.infer<typeof chapterSchema>;
export type CharacterContent = z.infer<typeof characterSchema>;
