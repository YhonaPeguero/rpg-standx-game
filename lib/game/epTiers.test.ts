import { describe, expect, it } from "vitest";
import { EP, epForStars } from "./epTiers";

describe("epTiers", () => {
  it("uses the 30/50/80 tier scale", () => {
    expect(EP).toEqual({ SMALL: 30, MEDIUM: 50, LARGE: 80 });
  });

  it("maps stars to EP, awarding nothing below one star", () => {
    expect(epForStars(0)).toBe(0);
    expect(epForStars(1)).toBe(EP.SMALL);
    expect(epForStars(2)).toBe(EP.MEDIUM);
    expect(epForStars(3)).toBe(EP.LARGE);
  });

  it("clamps out-of-range star counts", () => {
    expect(epForStars(-2)).toBe(0);
    expect(epForStars(7)).toBe(EP.LARGE);
  });
});
