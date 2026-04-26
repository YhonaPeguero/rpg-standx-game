"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { nextRankThreshold, RANK_THRESHOLDS } from "@/lib/game/ep";
import { useGameStore } from "@/store";
import { EPRing } from "./EPRing";
import { RankLabel } from "./RankLabel";
import { StreakBadge } from "./StreakBadge";

export function TopBar() {
  const t = useTranslations("hud");
  const player = useGameStore((state) => state.player);
  const locale = useGameStore((state) => state.locale);
  const audioEnabled = useGameStore((state) => state.audioEnabled);
  const setLocale = useGameStore((state) => state.setLocale);
  const toggleAudio = useGameStore((state) => state.toggleAudio);
  const bumpStreak = useGameStore((state) => state.bumpStreak);
  const next = nextRankThreshold(player.ep);
  const current = RANK_THRESHOLDS.find((threshold) => threshold.rank === player.rank)?.min ?? 0;

  useEffect(() => {
    bumpStreak();
  }, [bumpStreak]);

  return (
    <header className="sticky top-0 z-40 mb-5 rounded-sx-lg border border-[var(--stroke-brand)] bg-[var(--bg-overlay)] px-4 py-3 backdrop-blur md:px-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <EPRing ep={player.ep} current={current} next={next?.min ?? player.ep} />
          <div>
            <p className="font-mono text-xl leading-none text-sx-green">{player.ep}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-sx-dim">{t("ep")}</p>
          </div>
          <RankLabel rank={player.rank} />
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge days={player.streakDays} label={t("streak")} />
          <button
            className="rounded-sx border border-[var(--stroke-soft)] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green"
            type="button"
            onClick={() => setLocale(locale === "en" ? "pt-BR" : "en")}
          >
            {locale}
          </button>
          <button
            className="rounded-sx border border-[var(--stroke-soft)] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green"
            type="button"
            onClick={toggleAudio}
          >
            {audioEnabled ? t("audioOn") : t("audioOff")}
          </button>
        </div>
      </div>
    </header>
  );
}
