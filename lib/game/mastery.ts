export type MiniGameOutcome = "perfect" | "ok" | "miss" | "deep" | "hype" | "timeout";

export function quizStars(score: number, wrongAnswers: number, passingScore: number) {
  if (score < passingScore) {
    return 0;
  }

  if (wrongAnswers === 0) {
    return 3;
  }

  if (wrongAnswers === 1) {
    return 2;
  }

  return 1;
}

export function miniGameStars(outcome: MiniGameOutcome) {
  switch (outcome) {
    case "perfect":
    case "deep":
      return 3;
    case "ok":
      return 2;
    case "miss":
    case "hype":
    case "timeout":
      return 0;
  }
}
