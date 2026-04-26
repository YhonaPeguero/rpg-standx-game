"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store";

const colors = ["#00e832", "#ffe600", "#00aaff"] as const;

export function Onboarding() {
  const t = useTranslations("onboarding");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("STANDER");
  const [color, setColor] = useState<(typeof colors)[number]>(colors[0]);
  const setDisplayName = useGameStore((state) => state.setDisplayName);

  useEffect(() => {
    setOpen(window.localStorage.getItem("standx-rpg-onboarding") !== "complete");
  }, []);

  function finish() {
    setDisplayName(name);
    window.localStorage.setItem("standx-rpg-onboarding", "complete");
    setOpen(false);
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

        {step === 1 ? (
          <div className="mt-6 flex gap-3">
            {colors.map((option) => (
              <button
                aria-label={option}
                className="h-14 w-14 rounded-full border-2 transition data-[selected=true]:scale-110"
                data-selected={color === option}
                key={option}
                style={{ background: option, borderColor: color === option ? "#ffffff" : option }}
                type="button"
                onClick={() => setColor(option)}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-7 flex justify-end gap-3">
          <Button variant="secondary" onClick={finish}>
            {t("skip")}
          </Button>
          <Button onClick={() => (step < 2 ? setStep((value) => value + 1) : finish())}>{step < 2 ? t("next") : t("finish")}</Button>
        </div>
      </Card>
    </div>
  );
}
