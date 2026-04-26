import { describe, expect, it } from "vitest";
import { mergeRewards } from "./rewards";

describe("rewards", () => {
  it("merges EP, stars, codex entries, and latest achievement", () => {
    expect(
      mergeRewards(
        { ep: 10, stars: 1, codex: ["a", "b"] },
        { ep: 15, stars: 2, codex: ["b", "c"], achievement: "done" },
      ),
    ).toEqual({ ep: 25, stars: 3, codex: ["a", "b", "c"], achievement: "done" });
  });

  it("omits empty reward fields", () => {
    expect(mergeRewards({})).toEqual({});
  });
});
