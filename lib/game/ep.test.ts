import { describe, expect, it } from "vitest";
import { nextRankThreshold, rankFromEP, rankOrder } from "./ep";

describe("ep", () => {
  it("maps EP to the highest unlocked rank", () => {
    expect(rankFromEP(0)).toBe("new_stander");
    expect(rankFromEP(60)).toBe("active");
    expect(rankFromEP(550)).toBe("seed_candidate");
    expect(rankFromEP(3000)).toBe("seed");
  });

  it("returns the next threshold above the current EP", () => {
    expect(nextRankThreshold(59)).toEqual({ rank: "active", min: 60 });
    expect(nextRankThreshold(550)).toEqual({ rank: "seed", min: 3000 });
    expect(nextRankThreshold(8000)).toBeNull();
  });

  it("returns deterministic rank order", () => {
    expect(rankOrder("new_stander")).toBeLessThan(rankOrder("seed"));
    expect(rankOrder("flower")).toBe(6);
  });
});
