"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Reward } from "@/types";
import { useGameStore } from "@/store";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShareCard } from "@/components/ui/ShareCard";
import { formatRank } from "@/components/hud/RankLabel";

type RewardScreenProps = {
  reward: Reward;
};

function useCountUp(target: number, enabled: boolean): number {
  const [value, setValue] = useState(enabled ? 0 : target);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);

  return value;
}

export function RewardScreen({ reward }: RewardScreenProps) {
  const t = useTranslations("scene.reward");
  const player = useGameStore((state) => state.player);
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const epCount = useCountUp(reward.ep ?? 0, !reduceMotion);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col justify-center gap-5 py-6"
    >
      <Card className="p-6 text-center sm:p-8 md:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-sx-gold sm:text-xs">{t("badge")}</p>
        <h2 className="mt-4 font-display text-3xl font-black uppercase tracking-[0.14em] text-sx-green sm:text-4xl">{t("title")}</h2>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
          <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] px-2 py-4 sm:px-4">
            <p className="font-mono text-3xl text-sx-green sm:text-4xl">+{epCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sx-dim sm:text-xs sm:tracking-[0.22em]">{t("ep")}</p>
          </div>
          <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] px-2 py-4 sm:px-4">
            <p className="font-mono text-3xl text-sx-gold sm:text-4xl">{reward.stars ?? 0}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sx-dim sm:text-xs sm:tracking-[0.22em]">{t("stars")}</p>
          </div>
          <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] px-2 py-4 sm:px-4">
            <p className="font-mono text-3xl text-sx-text sm:text-4xl">{reward.codex?.length ?? 0}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sx-dim sm:text-xs sm:tracking-[0.22em]">{t("codex")}</p>
          </div>
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-sx-dim">
          {t("rankNow")} <span className="text-sx-green">{formatRank(player.rank)}</span>
        </p>
        <Link className={buttonClassName("primary", "mt-6 w-full sm:w-auto")} href="/play">
          {t("back")}
        </Link>
      </Card>
      <ShareCard run={{ displayName: player.displayName, ep: player.ep, rank: formatRank(player.rank), squad: player.squad ?? t("noSquad") }} />
    </motion.div>
  );
}
