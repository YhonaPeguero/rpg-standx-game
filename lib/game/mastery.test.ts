import { describe, expect, it } from "vitest";
import { miniGameStars, quizStars } from "./mastery";

describe("mastery", () => {
  it("scores quiz mastery from wrong answers and passing score", () => {
    expect(quizStars(3, 0, 2)).toBe(3);
    expect(quizStars(3, 1, 2)).toBe(2);
    expect(quizStars(2, 3, 2)).toBe(1);
    expect(quizStars(1, 0, 2)).toBe(0);
  });

  it("scores mini-game outcomes", () => {
    expect(miniGameStars("perfect")).toBe(3);
    expect(miniGameStars("deep")).toBe(3);
    expect(miniGameStars("ok")).toBe(2);
    expect(miniGameStars("miss")).toBe(0);
    expect(miniGameStars("timeout")).toBe(0);
  });
});
