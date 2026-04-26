"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { QuizQuestion } from "@/types";
import { quizStars } from "@/lib/game/mastery";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type QuizSceneProps = {
  sceneId: string;
  questions: QuizQuestion[];
  passingScore: number;
  onQuestionReward: (ep: number) => void;
  onMastery: (sceneId: string, stars: number) => void;
  onComplete: () => void;
};

export function QuizScene({ sceneId, questions, passingScore, onQuestionReward, onMastery, onComplete }: QuizSceneProps) {
  const t = useTranslations("scene.quiz");
  const [index, setIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [failedCurrent, setFailedCurrent] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const question = questions[index];
  const progress = `${index + 1}/${questions.length}`;

  function answer(correct: boolean) {
    if (correct) {
      if (!failedCurrent) {
        setScore((value) => value + 1);
        onQuestionReward(question.ep);
      }

      setFeedback(t("correct"));
      return;
    }

    setWrongAnswers((value) => value + 1);
    setFailedCurrent(true);
    setFeedback(`${t("miraPrefix")} ${question.explanation}`);
  }

  function next() {
    setFeedback(null);
    setFailedCurrent(false);

    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      return;
    }

    const finalScore = score + (failedCurrent ? 0 : 1);
    const stars = quizStars(finalScore, wrongAnswers, passingScore);
    onMastery(sceneId, stars);
    onComplete();
  }

  return (
    <Card className="p-5 md:p-7">
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full bg-sx-green transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-sx-gold">{progress}</p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.12em] text-sx-green">{question.prompt}</h2>

      <div className="mt-6 grid gap-3">
        {question.options.map((option) => (
          <button
            className="rounded-sx border border-[var(--stroke-brand)] bg-white/[0.02] p-4 text-left text-lg font-semibold text-sx-text transition hover:border-sx-green hover:bg-sx-green/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={feedback === t("correct")}
            key={option.id}
            type="button"
            onClick={() => answer(option.correct)}
          >
            {option.text}
          </button>
        ))}
      </div>

      {feedback ? (
        <div className="mt-6 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4">
          <p className="font-semibold text-sx-text">{feedback}</p>
          {feedback === t("correct") ? (
            <Button className="mt-4" onClick={next}>
              {index < questions.length - 1 ? t("next") : t("finish")}
            </Button>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
