import { describe, expect, it } from "vitest";
import { nextStreakDays, streakRewardEP } from "./streak";

describe("streak", () => {
  it("starts a streak for first-day activity", () => {
    expect(nextStreakDays("2026-04-26T01:00:00.000Z", 0, new Date("2026-04-26T23:00:00.000Z"))).toBe(1);
  });

  it("keeps the streak unchanged on the same UTC day", () => {
    expect(nextStreakDays("2026-04-26T01:00:00.000Z", 4, new Date("2026-04-26T23:00:00.000Z"))).toBe(4);
  });

  it("increments on consecutive UTC days", () => {
    expect(nextStreakDays("2026-04-25T23:00:00.000Z", 4, new Date("2026-04-26T01:00:00.000Z"))).toBe(5);
  });

  it("resets after a gap larger than one UTC day or invalid input", () => {
    expect(nextStreakDays("2026-04-20T00:00:00.000Z", 4, new Date("2026-04-26T00:00:00.000Z"))).toBe(1);
    expect(nextStreakDays("invalid", 4, new Date("2026-04-26T00:00:00.000Z"))).toBe(1);
  });

  it("awards daily streak EP only after a valid streak exists", () => {
    expect(streakRewardEP(0)).toBe(0);
    expect(streakRewardEP(1)).toBe(100);
  });
});
