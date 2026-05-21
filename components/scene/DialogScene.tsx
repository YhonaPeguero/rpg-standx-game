"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Choice, DialogLine, SquadId } from "@/types";
import { getCharacterById } from "@/lib/content/loader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type DialogSceneProps = {
  sceneId: string;
  lines: DialogLine[];
  choices?: Choice[];
  educational?: boolean;
  onReward: (reward: Choice["reward"]) => void;
  onSquad: (squad: SquadId) => void;
  onComplete: () => void;
};

export function DialogScene({ sceneId, lines, choices, educational = false, onReward, onSquad, onComplete }: DialogSceneProps) {
  const t = useTranslations("scene");
  const [index, setIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const current = lines[index] ?? lines[0];
  const character = current ? getCharacterById(current.character) : null;
  const text = current?.text ?? "";
  const complete = visibleText.length >= text.length;
  const characterColor = character?.color ?? "var(--green-primary)";

  useEffect(() => {
    setIndex(0);
    setVisibleText("");
    setFeedback(null);
  }, [sceneId]);

  useEffect(() => {
    setVisibleText("");
    let pointer = 0;
    const id = window.setInterval(() => {
      pointer += 1;
      setVisibleText(text.slice(0, pointer));

      if (pointer >= text.length) {
        window.clearInterval(id);
      }
    }, 16);

    return () => window.clearInterval(id);
  }, [text]);

  const showChoices = complete && index === lines.length - 1 && choices && choices.length > 0 && !feedback;

  const role = useMemo(() => character?.role ?? t("unknownRole"), [character?.role, t]);

  function advance() {
    if (!complete) {
      setVisibleText(text);
      return;
    }

    if (index < lines.length - 1) {
      setIndex((value) => value + 1);
      return;
    }

    if (!choices?.length) {
      onComplete();
    }
  }

  function choose(choice: Choice) {
    if (choice.squad) {
      onSquad(choice.squad);
    }

    onReward(choice.reward);
    setFeedback(choice.feedback ?? t("choiceRecorded"));
  }

  return (
    <div className="absolute inset-x-0 bottom-0">
      <div className="pointer-events-none absolute inset-x-0 bottom-full h-40 bg-gradient-to-t from-sx-bg to-transparent" />
      <Card className="rounded-none border-x-0 border-b-0 bg-[linear-gradient(0deg,rgba(4,8,15,0.99)_78%,rgba(4,8,15,0.7))] p-4 md:p-6">
      <div className="flex items-end gap-4">
        <div
          className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 bg-sx-bg font-display text-lg font-bold shadow-[0_0_18px_currentColor] md:h-20 md:w-20"
          style={{ borderColor: characterColor, color: characterColor }}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.16),transparent_36%),radial-gradient(circle,rgba(0,232,50,0.12),transparent_70%)]" />
          {character?.name.slice(0, 1) ?? "?"}
        </div>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.22em]" style={{ color: characterColor }}>
            {character?.name ?? current?.character ?? "?"}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-sx-dim">{role}</p>
        </div>
      </div>

      <button type="button" className="mt-6 block w-full text-left" onClick={advance}>
        <p className="min-h-24 max-w-6xl text-xl font-semibold leading-8 text-sx-text md:text-2xl md:leading-9">
          {visibleText}
          {!complete ? <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-sx-green" /> : null}
        </p>
        <p className="mt-4 text-right font-mono text-xs uppercase tracking-[0.25em] text-sx-dim">{t("tap")}</p>
      </button>

      {showChoices ? (
        <div className="mt-6 grid gap-3">
          {choices.map((choice) => (
            <button
              className="flex items-center justify-between gap-4 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4 text-left font-semibold text-sx-text transition hover:border-sx-green hover:bg-sx-green/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sx-green"
              key={choice.id}
              type="button"
              onClick={() => choose(choice)}
            >
              <span>{choice.label}</span>
              {choice.tag ? <span className="font-mono text-xs uppercase text-sx-gold">{choice.tag}</span> : null}
            </button>
          ))}
        </div>
      ) : null}

      {feedback ? (
        <div className="mt-6 rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4">
          <p className="font-semibold text-sx-text">{feedback}</p>
          <Button className="mt-4" onClick={onComplete}>
            {t("continue")}
          </Button>
        </div>
      ) : null}

      {educational ? <p className="mt-6 border-t border-[var(--stroke-soft)] pt-4 font-mono text-xs text-sx-dim">{t("nfa")}</p> : null}
      </Card>
    </div>
  );
}
