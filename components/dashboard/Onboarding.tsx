"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store";

const STORAGE_KEY = "standx-rpg-onboarding";
const FIRST_CHAPTER_ID = "act1-c1-awakening";

export function Onboarding() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("STANDER");
  const setDisplayName = useGameStore((state) => state.setDisplayName);

  useEffect(() => {
    setOpen(window.localStorage.getItem(STORAGE_KEY) !== "complete");
  }, []);

  function persist() {
    setDisplayName(name);
    window.localStorage.setItem(STORAGE_KEY, "complete");
    setOpen(false);
  }

  function skip() {
    persist();
  }

  function startChapter() {
    persist();
    router.push(`/play/scene/${FIRST_CHAPTER_ID}`);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] p-4">
      <Card className="w-full max-w-xl p-6 md:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.14em] text-sx-green">{t(`steps.${step}.title`)}</h2>
        <p className="mt-4 text-lg font-semibold leading-8 text-sx-text">{t(`steps.${step}.body`)}</p>

        {step === 0 ? (
          <input
            className="mt-6 w-full rounded-sx border border-[var(--stroke-brand)] bg-sx-bg px-4 py-3 font-mono text-sx-text outline-none focus:border-sx-green"
            maxLength={24}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        ) : null}

        <div className="mt-7 flex justify-end gap-3">
          <Button variant="secondary" onClick={skip}>
            {t("skip")}
          </Button>
          {step === 0 ? (
            <Button onClick={() => setStep(1)}>{t("next")}</Button>
          ) : (
            <Button onClick={startChapter}>{t("startChapter1")}</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
