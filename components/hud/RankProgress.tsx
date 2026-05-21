"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { rankProgress } from "@/lib/game/ranks";

type RankProgressProps = {
  ep: number;
};

export function RankProgress({ ep }: RankProgressProps) {
  const t = useTranslations("ranks");
  const { current, next, ratio, remaining } = rankProgress(ep);

  return (
    <div className="rounded-sx-lg border border-[var(--stroke-brand)] bg-sx-bg/60 p-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sx-dim">{t("current")}</p>
          <p className="mt-1 font-display text-lg font-bold uppercase tracking-[0.18em]" style={{ color: current.accent }}>
            <span aria-hidden="true" className="mr-2">{current.icon}</span>
            {t(`labels.${current.id}` as `labels.${typeof current.id}`)}
          </p>
        </div>
        {next ? (
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sx-dim">{t("next")}</p>
            <p className="mt-1 font-display text-sm font-bold uppercase tracking-[0.18em]" style={{ color: next.accent }}>
              {t(`labels.${next.id}` as `labels.${typeof next.id}`)}
            </p>
            <p className="mt-0.5 font-mono text-xs text-sx-gold">{t("remaining", { ep: remaining })}</p>
          </div>
        ) : null}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          animate={{ width: `${Math.round(ratio * 100)}%` }}
          className="h-full rounded-full"
          initial={{ width: 0 }}
          style={{ background: `linear-gradient(90deg, ${current.accent}, ${next?.accent ?? current.accent})` }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
