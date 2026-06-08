"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { miniGameStars, type MiniGameOutcome } from "@/lib/game/mastery";
import { epForStars } from "@/lib/game/epTiers";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ContentResult = {
  outcome: MiniGameOutcome;
  ep: number;
  title: string;
  lesson: string;
};

type ContentPickQTEProps = {
  onResult: (result: ContentResult) => void;
};

type ContentCard = { id: string; label: string; text: string; outcome: "deep" | "hype" };

function resultFor(index: number, cards: ContentCard[], t: ReturnType<typeof useTranslations<"minigames.content">>): ContentResult {
  const card = cards[index];

  if (card.outcome === "deep") {
    return {
      outcome: "deep",
      ep: epForStars(miniGameStars("deep")),
      title: t("deepTitle"),
      lesson: t("deepLesson"),
    };
  }

  return {
    outcome: "hype",
    ep: epForStars(miniGameStars("hype")),
    title: t("hypeTitle"),
    lesson: t("hypeLesson"),
  };
}

export function ContentPickQTE({ onResult }: ContentPickQTEProps) {
  const t = useTranslations("minigames.content");
  const cards: ContentCard[] = [
    { id: "a", label: t("cards.a.label"), text: t("cards.a.text"), outcome: "deep" },
    { id: "b", label: t("cards.b.label"), text: t("cards.b.text"), outcome: "hype" },
    { id: "c", label: t("cards.c.label"), text: t("cards.c.text"), outcome: "deep" },
  ];
  const [remaining, setRemaining] = useState(6);
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<ContentResult | null>(null);

  useEffect(() => {
    if (result) {
      return;
    }

    const started = Date.now();
    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, 6 - (Date.now() - started) / 1000));
    }, 100);
    const timeout = window.setTimeout(() => pick(1), 6000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [result]);

  function pick(index: number) {
    if (result) {
      return;
    }

    setPicked(index);
    setResult(resultFor(index, cards, t));
  }

  return (
    <Card className="p-5 md:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("title")}</h2>
      <p className="mt-4 font-semibold leading-7 text-sx-text">{t("mentor")}</p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full bg-sx-green transition-all" style={{ width: `${(remaining / 6) * 100}%` }} />
      </div>
      <div className="mt-6 grid gap-3">
        {cards.map((card, index) => (
          <button
            className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4 text-left transition hover:border-sx-green data-[picked=true]:border-sx-green data-[picked=true]:bg-sx-green/10 disabled:opacity-45"
            data-picked={picked === index}
            disabled={Boolean(result)}
            key={card.id}
            type="button"
            onClick={() => pick(index)}
          >
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-sx-gold">{card.label}</p>
            <p className="mt-2 font-semibold leading-7 text-sx-text">{card.text}</p>
          </button>
        ))}
      </div>
      {result ? (
        <div className="mt-6 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4">
          <p className="font-display text-xl font-bold uppercase tracking-[0.16em] text-sx-green">{result.title}</p>
          <p className="mt-3 font-semibold leading-7 text-sx-text">{result.lesson}</p>
          {result.ep > 0 ? <p className="mt-3 font-mono text-sx-gold">+{result.ep} EP</p> : null}
          <Button className="mt-4" onClick={() => onResult(result)}>
            {t("continue")}
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
