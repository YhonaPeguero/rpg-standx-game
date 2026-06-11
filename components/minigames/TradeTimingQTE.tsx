"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { miniGameStars, type MiniGameOutcome } from "@/lib/game/mastery";
import { epForStars } from "@/lib/game/epTiers";
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

function resultFor(position: number, t: ReturnType<typeof useTranslations<"minigames.trade">>): TradeResult {
  if (position >= perfect.from && position <= perfect.to) {
    return {
      outcome: "perfect",
      ep: epForStars(miniGameStars("perfect")),
      title: t("perfectTitle"),
      lesson: t("perfectLesson"),
    };
  }

  if (position >= ok.from && position <= ok.to) {
    return {
      outcome: "ok",
      ep: epForStars(miniGameStars("ok")),
      title: t("okTitle"),
      lesson: t("okLesson"),
    };
  }

  return {
    outcome: "miss",
    ep: epForStars(miniGameStars("miss")),
    title: t("missTitle"),
    lesson: t("missLesson"),
  };
}

export function TradeTimingQTE({ onResult }: TradeTimingQTEProps) {
  const t = useTranslations("minigames.trade");
  const [position, setPosition] = useState(0);
  const [result, setResult] = useState<TradeResult | null>(null);
  const positionRef = useRef(0);
  const directionRef = useRef(1);
  const resultRef = useRef<HTMLDivElement>(null);

  // Feedback can render below the visible stage; keep it reachable.
  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

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

    setResult(resultFor(positionRef.current, t));
  }

  return (
    <Card className="p-5 md:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("title")}</h2>
      <div className="mt-5 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4">
        <p className="font-semibold leading-7 text-sx-text">{t("mentor")}</p>
      </div>
      <div className="relative mt-8 h-8 rounded-full border border-[var(--stroke-soft)] bg-white/5">
        <div className="absolute top-0 h-full rounded-full bg-sx-gold/15" style={{ left: `${ok.from}%`, width: `${ok.to - ok.from}%` }} />
        <div className="absolute top-0 h-full rounded-full bg-sx-green/30" style={{ left: `${perfect.from}%`, width: `${perfect.to - perfect.from}%` }} />
        <div className="absolute -top-2 h-12 w-1 rounded-full bg-sx-gold shadow-glow-gold" style={{ left: `${position}%` }} />
      </div>
      <Button className="mt-8" onClick={press} disabled={Boolean(result)}>
        {t("action")}
      </Button>
      {result ? (
        <div className="mt-6 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4" ref={resultRef}>
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
