"use client";

import { useEffect, useState } from "react";
import type { MiniGameOutcome } from "@/lib/game/mastery";
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

const cards = [
  {
    id: "a",
    label: "A - DEEP",
    text: "DUSD's delta-neutral architecture means your capital works without directional exposure. Not magic yield - structure. Thread on the mechanisms >",
    outcome: "deep" as const,
    ep: 40,
  },
  {
    id: "b",
    label: "B - HYPE",
    text: "DUSD on StandX is amazing! Passive yield while you sleep! Best DeFi platform!",
    outcome: "hype" as const,
    ep: 5,
  },
  {
    id: "c",
    label: "C - DEEP",
    text: "DUSD vs USDC in perps: delta-neutral vs direct exposure. Real data, honest analysis. >",
    outcome: "deep" as const,
    ep: 35,
  },
];

function resultFor(index: number): ContentResult {
  const card = cards[index];

  if (card.outcome === "deep") {
    return {
      outcome: "deep",
      ep: card.ep,
      title: "SELECTED",
      lesson: "Victor approves - this is the Content Squad standard. It adds real value without pretending structure is magic.",
    };
  }

  return {
    outcome: "hype",
    ep: card.ep,
    title: "NOT SELECTED",
    lesson: "Hype teaches nothing. The team picks what adds real value.",
  };
}

export function ContentPickQTE({ onResult }: ContentPickQTEProps) {
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
    setResult(resultFor(index));
  }

  return (
    <Card className="p-5 md:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">QTE - Content Quality</p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-sx-green">Pick the post Victor would stop for</h2>
      <p className="mt-4 font-semibold leading-7 text-sx-text">Victor: The ask is content about DUSD yield. Depth earns attention. Hype does not.</p>
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
          <p className="mt-3 font-mono text-sx-gold">+{result.ep} EP</p>
          <Button className="mt-4" onClick={() => onResult(result)}>
            Continue
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
