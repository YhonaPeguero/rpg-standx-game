"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { streakRewardEP } from "@/lib/game/streak";
import { useGameStore } from "@/store";

function utcDayKey(date: Date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

export function DailyClaim() {
  const t = useTranslations("hud");
  const streakDays = useGameStore((state) => state.player.streakDays);
  const addEP = useGameStore((state) => state.addEP);
  const [claimed, setClaimed] = useState(true);
  const reward = streakRewardEP(streakDays);

  useEffect(() => {
    setClaimed(window.localStorage.getItem("standx-rpg-daily-claim") === utcDayKey(new Date()));
  }, [streakDays]);

  function claim() {
    if (claimed || reward <= 0) {
      return;
    }

    addEP(reward);
    window.localStorage.setItem("standx-rpg-daily-claim", utcDayKey(new Date()));
    setClaimed(true);
  }

  return (
    <button
      className="rounded-sx border border-[var(--stroke-soft)] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green disabled:opacity-45"
      disabled={claimed || reward <= 0}
      type="button"
      onClick={claim}
    >
      {claimed ? t("claimed") : t("claim", { ep: reward })}
    </button>
  );
}
