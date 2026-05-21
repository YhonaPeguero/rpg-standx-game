import type { Locale } from "@/lib/i18n/config";

export type { Locale };

export type SquadId = "creative" | "content_research" | "tech_support" | "outreach" | "offline";

export type Rank =
  | "new_stander"
  | "active"
  | "consistent"
  | "seed_candidate"
  | "seed"
  | "sprout"
  | "flower";

export type ZoneId =
  | "void"
  | "discord_plaza"
  | "event_arena"
  | "content_district"
  | "moderator_gate"
  | "seed_hall";

export type CharacterId =
  | "sistema"
  | "mira"
  | "arttifex"
  | "gaboo"
  | "jovan"
  | "aifilho"
  | "dias"
  | "dan"
  | "victor"
  | "stander";

export type QuestKind = "daily" | "weekly" | "community";

export type Player = {
  id: string;
  displayName: string;
  ep: number;
  rank: Rank;
  squad: SquadId | null;
  squadXP: Record<SquadId, number>;
  streakDays: number;
  lastActiveAt: string;
  mastery: Record<string, number>;
  codexUnlocks: string[];
  achievements: string[];
  createdAt: string;
  locale: Locale;
};

export type Reward = {
  ep?: number;
  stars?: number;
  codex?: string[];
  achievement?: string;
};

export type DialogLine = {
  character: CharacterId;
  text: string;
  pose?: "idle" | "happy" | "concerned" | "excited";
};

export type Choice = {
  id: string;
  label: string;
  tag?: "EP" | "LEARN" | "RISK" | "DEEP" | "GENUINE" | "SQUAD";
  reward: Reward;
  squad?: SquadId;
  feedback?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
  ep: number;
};

export type Scene =
  | { id: string; kind: "dialog"; lines: DialogLine[]; choices?: Choice[]; educational?: boolean }
  | { id: string; kind: "quiz"; questions: QuizQuestion[]; passingScore: number }
  | { id: string; kind: "minigame"; gameId: "trade_timing" | "content_pick"; config: Record<string, unknown> }
  | { id: string; kind: "reflection"; prompt: string; options?: string[] };

export type Gate =
  | { type: "previous"; chapterId: string }
  | { type: "ep"; value: number }
  | { type: "rank"; value: Rank }
  | { type: "squad"; value: SquadId };

export type Chapter = {
  id: string;
  act: 1 | 2 | 3;
  zone: ZoneId;
  title: string;
  subtitle?: string;
  scenes: Scene[];
  unlock: Gate[];
  reward: Reward;
};

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  color: string;
  bio: string;
  mentorOf?: SquadId;
};

export type LocalizedText = Partial<Record<Locale, string>> & { "en-US": string };

export type CodexEntry = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  category: "growth" | "community" | "trading" | "content" | "squads";
};

export type Achievement = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type Quest = {
  id: string;
  kind: QuestKind;
  i18nKey: string;
  reward: Reward;
  goal: number;
  unlock?: Gate[];
  category?: "engage" | "content" | "consistency" | "community" | "trading";
};
