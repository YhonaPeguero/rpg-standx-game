"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ReflectionSceneProps = {
  prompt: string;
  options?: string[];
  onComplete: () => void;
};

export function ReflectionScene({ prompt, options, onComplete }: ReflectionSceneProps) {
  const t = useTranslations("scene.reflection");
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Card className="p-5 md:p-7">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-sx-gold">{t("badge")}</p>
      <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.12em] text-sx-green">{prompt}</h2>

      <div className="mt-6 grid gap-3">
        {options?.map((option) => (
          <button
            className="rounded-sx border border-[var(--stroke-brand)] bg-white/[0.02] p-4 text-left text-lg font-semibold text-sx-text transition hover:border-sx-green hover:bg-sx-green/10 data-[selected=true]:border-sx-green data-[selected=true]:bg-sx-green/10"
            data-selected={selected === option}
            key={option}
            type="button"
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <Button className="mt-6" disabled={Boolean(options?.length) && !selected} onClick={onComplete}>
        {t("complete")}
      </Button>
    </Card>
  );
}
