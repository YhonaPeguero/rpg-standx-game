"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { onOpenGuide } from "@/lib/game/guidePulse";
import { useGameStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Mascot } from "@/components/mascot/Mascot";

const STORAGE_KEY = "standx-rpg-onboarding";
const FIRST_CHAPTER_ID = "act1-c1-awakening";
const STEP_ICONS: IconName[] = ["seed", "quests", "ranks", "squads", "play"];
const STEP_COUNT = STEP_ICONS.length;

export function Onboarding() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("STANDER");
  const setDisplayName = useGameStore((state) => state.setDisplayName);

  useEffect(() => {
    const done = window.localStorage.getItem(STORAGE_KEY) === "complete";
    if (!done) {
      setFirstRun(true);
      setOpen(true);
    }
    return onOpenGuide(() => {
      setStep(0);
      setFirstRun(window.localStorage.getItem(STORAGE_KEY) !== "complete");
      setOpen(true);
    });
  }, []);

  function finish(startChapter: boolean) {
    setDisplayName(name);
    window.localStorage.setItem(STORAGE_KEY, "complete");
    setOpen(false);
    if (startChapter) {
      router.push(`/play/scene/${FIRST_CHAPTER_ID}`);
    }
  }

  if (!open) {
    return null;
  }

  const isLast = step === STEP_COUNT - 1;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--bg-overlay)] p-4 backdrop-blur-sm">
      <Card className="relative w-full max-w-xl p-6 md:p-8">
        <div className="pointer-events-none absolute -top-16 right-4 hidden h-28 w-28 sm:block">
          <Mascot className="h-full w-full drop-shadow-[0_0_16px_rgba(0,232,50,0.35)]" pose={isLast ? "cheer" : "idle"} />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <div className="flex gap-1.5">
            {STEP_ICONS.map((_, i) => (
              <span
                className={`h-1.5 w-6 rounded-full transition ${i <= step ? "bg-sx-green" : "bg-white/10"}`}
                key={i}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sx border border-sx-green/40 bg-sx-green/10 text-sx-green shadow-[0_0_16px_rgba(0,232,50,0.25)]">
            <Icon name={STEP_ICONS[step]} size={24} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.14em] text-sx-green">{t(`steps.${step}.title`)}</h2>
            <p className="mt-3 text-base font-semibold leading-7 text-sx-text">{t(`steps.${step}.body`)}</p>
          </div>
        </div>

        {step === 0 ? (
          <input
            aria-label={t("steps.0.title")}
            className="mt-5 w-full rounded-sx border border-[var(--stroke-brand)] bg-sx-bg px-4 py-3 font-mono text-sx-text outline-none focus:border-sx-green"
            maxLength={24}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        ) : null}

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            className="font-mono text-xs uppercase tracking-[0.2em] text-sx-dim transition hover:text-sx-text"
            onClick={() => finish(false)}
            type="button"
          >
            {t("skip")}
          </button>
          <div className="flex gap-3">
            {step > 0 ? (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                {t("back")}
              </Button>
            ) : null}
            {isLast ? (
              <Button onClick={() => finish(firstRun)}>{firstRun ? t("startChapter1") : t("done")}</Button>
            ) : (
              <Button onClick={() => setStep((s) => s + 1)}>{t("next")}</Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
