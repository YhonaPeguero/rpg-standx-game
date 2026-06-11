import { describe, expect, it } from "vitest";
import type { Player } from "@/types";
import type { QuestState } from "@/store/questsSlice";
import { applyQuestEvent } from "./questEvents";

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    id: "test",
    displayName: "STANDER",
    ep: 0,
    rank: "new_stander",
    squad: null,
    squadXP: { creative: 0, content_research: 0, tech_support: 0, outreach: 0, offline: 0 },
    streakDays: 0,
    lastActiveAt: "2026-04-26T00:00:00.000Z",
    mastery: {},
    codexUnlocks: [],
    achievements: [],
    createdAt: "2026-04-26T00:00:00.000Z",
    locale: "en-US",
    ...overrides,
  };
}

function makeState(overrides: Partial<QuestState> = {}): QuestState {
  return {
    activeDaily: [],
    progress: {},
    claimed: [],
    lastRollISO: "2026-04-26",
    ...overrides,
  };
}

describe("applyQuestEvent", () => {
  it("ignores scene_complete (there are no daily quests)", () => {
    const before = makeState();
    const after = applyQuestEvent(
      before,
      { type: "scene_complete", sceneId: "s1-1", chapterId: "act1-c1-awakening" },
      makePlayer(),
      new Set(),
    );

    expect(after).toBe(before);
  });

  it("ignores codex_unlock (no quest is wired to it)", () => {
    const before = makeState();
    const after = applyQuestEvent(
      before,
      { type: "codex_unlock", codexId: "ep_basics" },
      makePlayer(),
      new Set(),
    );

    expect(after).toBe(before);
  });

  it("bumps weekly_event when a community-event chapter completes", () => {
    const next = applyQuestEvent(
      makeState(),
      { type: "chapter_complete", chapterId: "act1-c2-discord-plaza" },
      makePlayer({ rank: "new_stander", ep: 200 }),
      new Set(["act1-c2-discord-plaza"]),
    );

    expect(next.progress.weekly_event).toBe(1);
  });

  it("ignores chapter_complete for unrelated chapters", () => {
    const before = makeState();
    const after = applyQuestEvent(
      before,
      { type: "chapter_complete", chapterId: "act1-c1-awakening" },
      makePlayer(),
      new Set(["act1-c1-awakening"]),
    );

    expect(after).toBe(before);
  });

  it("bumps weekly_quality only when mastery hits the 3-star content scene", () => {
    const player = makePlayer({ ep: 1100, rank: "new_stander" });
    const ok = applyQuestEvent(
      makeState(),
      { type: "mastery", sceneId: "s4-2-content-pick", stars: 3 },
      player,
      new Set(),
    );
    expect(ok.progress.weekly_quality).toBe(1);

    const skip = applyQuestEvent(
      makeState(),
      { type: "mastery", sceneId: "s4-2-content-pick", stars: 2 },
      player,
      new Set(),
    );
    expect(skip.progress.weekly_quality).toBeUndefined();
  });

  it("sets weekly_streak progress to current streak days, never decreasing", () => {
    const player = makePlayer({ streakDays: 3 });
    const day3 = applyQuestEvent(
      makeState(),
      { type: "streak_day", days: 3 },
      player,
      new Set(),
    );
    expect(day3.progress.weekly_streak).toBe(3);

    const sameDay = applyQuestEvent(
      day3,
      { type: "streak_day", days: 2 },
      player,
      new Set(),
    );
    expect(sameDay.progress.weekly_streak).toBe(3);
  });

  it("clamps progress to the quest goal", () => {
    let state = makeState({ progress: { weekly_streak: 6 } });
    state = applyQuestEvent(state, { type: "streak_day", days: 12 }, makePlayer(), new Set());
    expect(state.progress.weekly_streak).toBe(7);
  });

  it("skips EP-locked weekly quests until the EP gate passes", () => {
    const blocked = applyQuestEvent(
      makeState(),
      { type: "mastery", sceneId: "s4-2-content-pick", stars: 3 },
      makePlayer({ rank: "new_stander", ep: 100 }),
      new Set(),
    );
    expect(blocked.progress.weekly_quality).toBeUndefined();
  });

  it("does not bump quests that are already claimed", () => {
    const before = makeState({ claimed: ["weekly_quality"] });
    const after = applyQuestEvent(
      before,
      { type: "mastery", sceneId: "s4-2-content-pick", stars: 3 },
      makePlayer({ ep: 1100 }),
      new Set(),
    );
    expect(after).toBe(before);
  });

  it("bumps community_thread when the content district chapter completes for a seed player", () => {
    const after = applyQuestEvent(
      makeState(),
      { type: "chapter_complete", chapterId: "act1-c4-content-district" },
      makePlayer({ rank: "seed", ep: 1200 }),
      new Set(["act1-c4-content-district"]),
    );
    expect(after.progress.community_thread).toBe(1);
  });
});
