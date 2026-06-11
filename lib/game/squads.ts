import type { CharacterId, SquadId } from "@/types";

export type SquadMeta = {
  id: SquadId;
  /** Mentor character (null where the MVP has no assigned mentor yet). */
  mentorId: CharacterId | null;
  accent: string;
  /** i18n keys live under squads.list.<id>.name / .desc */
};

// Order shown on the Squads page. Mentors mirror characters.json `mentorOf`.
export const SQUADS: SquadMeta[] = [
  { id: "content_research", mentorId: "jinli", accent: "#9945ff" },
  { id: "creative", mentorId: "dave", accent: "#00e8c8" },
  { id: "outreach", mentorId: "gaboo", accent: "#ff3366" },
  { id: "tech_support", mentorId: null, accent: "#00aaff" },
  { id: "offline", mentorId: null, accent: "#ffb000" },
];

export function getSquadMeta(id: SquadId): SquadMeta {
  return SQUADS.find((squad) => squad.id === id) ?? SQUADS[0];
}
