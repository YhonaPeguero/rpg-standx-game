"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { nextRankThreshold, RANK_THRESHOLDS } from "@/lib/game/ep";
import { getChapters } from "@/lib/content/loader";
import { chapterUnlocked } from "@/lib/game/gates";
import { useGameStore } from "@/store";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { buttonClassName } from "@/components/ui/Button";
import { EPRing } from "./EPRing";
import { RankLabel } from "./RankLabel";

function chapterNumber(id: string): string {
  const match = id.match(/c(\d+)/);
  return match ? match[1] : "";
}

export function TopBar() {
  const t = useTranslations("hud");
  const pathname = usePathname();
  const player = useGameStore((state) => state.player);
  const completedChapters = useGameStore((state) => state.completedChapters);
  const bumpStreak = useGameStore((state) => state.bumpStreak);
  const rollDailyIfNeeded = useGameStore((state) => state.rollDailyIfNeeded);
  const next = nextRankThreshold(player.ep);
  const current = RANK_THRESHOLDS.find((threshold) => threshold.rank === player.rank)?.min ?? 0;
  const inScene = pathname?.startsWith("/play/scene/") ?? false;
  const nextChapter = useMemo(() => {
    if (inScene) return null;
    return (
      getChapters().find(
        (chapter) => !completedChapters.has(chapter.id) && chapterUnlocked(chapter.unlock, player, completedChapters),
      ) ?? null
    );
  }, [inScene, completedChapters, player]);

  useEffect(() => {
    bumpStreak();
    rollDailyIfNeeded();
  }, [bumpStreak, rollDailyIfNeeded]);

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
          {nextChapter ? (
            <Link
              className={buttonClassName("primary", "min-h-0 px-4 py-2 text-[10px]")}
              href={`/play/scene/${nextChapter.id}`}
            >
              {t("continueJourney", { n: chapterNumber(nextChapter.id) })} →
            </Link>
          ) : null}
          <LocaleSwitcher variant="compact" />
        </div>
      </div>
    </header>
  );
}
