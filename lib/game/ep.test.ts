import { describe, expect, it } from "vitest";
import { nextRankThreshold, rankFromEP, rankOrder } from "./ep";

describe("ep", () => {
  it("maps EP to the highest unlocked rank", () => {
    expect(rankFromEP(0)).toBe("new_stander");
    expect(rankFromEP(500)).toBe("active");
    expect(rankFromEP(3499)).toBe("seed");
  });

  it("returns the next threshold above the current EP", () => {
    expect(nextRankThreshold(499)).toEqual({ rank: "active", min: 500 });
    expect(nextRankThreshold(8000)).toBeNull();
  });

  it("returns deterministic rank order", () => {
    expect(rankOrder("new_stander")).toBeLessThan(rankOrder("seed"));
    expect(rankOrder("flower")).toBe(6);
  });
});
