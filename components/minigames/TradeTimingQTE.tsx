"use client";

import { useEffect, useRef, useState } from "react";
import type { MiniGameOutcome } from "@/lib/game/mastery";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type TradeResult = {
  outcome: MiniGameOutcome;
  ep: number;
  title: string;
  lesson: string;
};

type TradeTimingQTEProps = {
  onResult: (result: TradeResult) => void;
};

const perfect = { from: 38, to: 56 };
const ok = { from: 28, to: 68 };

function resultFor(position: number): TradeResult {
  if (position >= perfect.from && position <= perfect.to) {
    return {
      outcome: "perfect",
      ep: 250,
      title: "PERFECT TIMING",
      lesson: "Hit the exact setup. Consolidation plus negative funding means the market is positioned wrong. That's the edge.",
    };
  }

  if (position >= ok.from && position <= ok.to) {
    return {
      outcome: "ok",
      ep: 120,
      title: "CLEAN ENOUGH",
      lesson: "Close. Slightly early or late. In practice, more slippage and a tighter stop.",
    };
  }

  return {
    outcome: "miss",
    ep: 40,
    title: "FORCED ENTRY",
    lesson: "Outside the setup zone. FOMO, not analysis. Jovan: wait for confirmation, always.",
  };
}

export function TradeTimingQTE({ onResult }: TradeTimingQTEProps) {
  const [position, setPosition] = useState(0);
  const [result, setResult] = useState<TradeResult | null>(null);
  const positionRef = useRef(0);
  const directionRef = useRef(1);

  useEffect(() => {
    if (result) {
      return;
    }

    let frame = 0;
    let last = performance.now();

    function animate(now: number) {
      const delta = (now - last) / 16;
      last = now;
      const next = positionRef.current + directionRef.current * 1.6 * delta;

      if (next >= 100) {
        positionRef.current = 100;
        directionRef.current = -1;
      } else if (next <= 0) {
        positionRef.current = 0;
        directionRef.current = 1;
      } else {
        positionRef.current = next;
      }

      setPosition(positionRef.current);
      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [result]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code === "Space") {
        event.preventDefault();
        press();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function press() {
    if (result) {
      return;
    }

    setResult(resultFor(positionRef.current));
  }

  return (
    <Card className="p-5 md:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">QTE - Trade Execution</p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-sx-green">Press in the setup zone</h2>
      <div className="mt-5 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4">
        <p className="font-semibold leading-7 text-sx-text">
          Jovan: Support tested 3x. Funding rate negative. Volume growing. Green zone is the ideal.
        </p>
      </div>
      <div className="relative mt-8 h-8 rounded-full border border-[var(--stroke-soft)] bg-white/5">
        <div className="absolute top-0 h-full rounded-full bg-sx-gold/15" style={{ left: `${ok.from}%`, width: `${ok.to - ok.from}%` }} />
        <div className="absolute top-0 h-full rounded-full bg-sx-green/30" style={{ left: `${perfect.from}%`, width: `${perfect.to - perfect.from}%` }} />
        <div className="absolute -top-2 h-12 w-1 rounded-full bg-sx-gold shadow-glow-gold" style={{ left: `${position}%` }} />
      </div>
      <Button className="mt-8" onClick={press} disabled={Boolean(result)}>
        Trade
      </Button>
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
