import { describe, expect, it } from "vitest";
import { nextRankThreshold, rankFromEP, rankOrder } from "./ep";

describe("ep", () => {
  it("maps EP to the highest unlocked rank", () => {
    expect(rankFromEP(0)).toBe("new_stander");
    expect(rankFromEP(550)).toBe("new_stander");
    expect(rankFromEP(3000)).toBe("seed");
    expect(rankFromEP(4000)).toBe("sprout");
    expect(rankFromEP(9000)).toBe("flower");
  });

  it("returns the next threshold above the current EP", () => {
    expect(nextRankThreshold(550)).toEqual({ rank: "seed", min: 3000 });
    expect(nextRankThreshold(3500)).toEqual({ rank: "sprout", min: 4000 });
    expect(nextRankThreshold(8000)).toBeNull();
  });

  it("returns deterministic rank order", () => {
    expect(rankOrder("new_stander")).toBeLessThan(rankOrder("seed"));
    expect(rankOrder("flower")).toBe(3);
  });
});
