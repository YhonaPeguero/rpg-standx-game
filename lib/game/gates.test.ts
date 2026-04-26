import { describe, expect, it } from "vitest";
import type { Player } from "@/types";
import { chapterUnlocked, gatePassed } from "./gates";

const player: Player = {
  id: "test",
  displayName: "STANDER",
  ep: 1200,
  rank: "consistent",
  squad: "creative",
  squadXP: { creative: 0, content_research: 0, tech_support: 0, outreach: 0, offline: 0 },
  streakDays: 1,
  lastActiveAt: "2026-04-26T00:00:00.000Z",
  mastery: {},
  codexUnlocks: [],
  achievements: [],
  createdAt: "2026-04-26T00:00:00.000Z",
  locale: "en",
};

describe("gates", () => {
  it("passes previous, EP, rank, and squad gates", () => {
    const completed = new Set(["chapter-one"]);

    expect(gatePassed({ type: "previous", chapterId: "chapter-one" }, player, completed)).toBe(true);
    expect(gatePassed({ type: "ep", value: 1000 }, player, completed)).toBe(true);
    expect(gatePassed({ type: "rank", value: "active" }, player, completed)).toBe(true);
    expect(gatePassed({ type: "squad", value: "creative" }, player, completed)).toBe(true);
  });

  it("requires all chapter gates to pass", () => {
    expect(
      chapterUnlocked(
        [
          { type: "previous", chapterId: "chapter-one" },
          { type: "ep", value: 500 },
        ],
        player,
        new Set(["chapter-one"]),
      ),
    ).toBe(true);
    expect(chapterUnlocked([{ type: "ep", value: 2000 }], player, new Set())).toBe(false);
  });
});
