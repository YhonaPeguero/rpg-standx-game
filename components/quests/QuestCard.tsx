"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Quest } from "@/types";
import { Button } from "@/components/ui/Button";

type QuestCardProps = {
  quest: Quest;
  progress: number;
  claimed: boolean;
  unlocked: boolean;
  manualTrigger: boolean;
  onClaim: () => void;
  onIncrement: () => void;
};

export function QuestCard({ quest, progress, claimed, unlocked, manualTrigger, onClaim, onIncrement }: QuestCardProps) {
  const t = useTranslations("quests");
  const tShared = useTranslations();
  const titleKey = `${quest.i18nKey}.title` as const;
  const bodyKey = `${quest.i18nKey}.body` as const;
  const safeProgress = Math.min(quest.goal, progress);
  const ratio = quest.goal === 0 ? 1 : safeProgress / quest.goal;
  const ready = safeProgress >= quest.goal;

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-sx-lg border bg-sx-bg/50 p-5 transition ${
        claimed
          ? "border-[var(--stroke-soft)] opacity-70"
          : ready
            ? "border-sx-green/60 shadow-glow-green"
            : "border-[var(--stroke-brand)] hover:border-sx-green/40"
      }`}
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sx-gold">{quest.kind}</p>
          <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-[0.14em] text-sx-green">
            {tShared(titleKey)}
          </h3>
          <p className="mt-2 font-semibold leading-7 text-sx-text">{tShared(bodyKey)}</p>
        </div>
        <div className="text-right">
          {quest.reward.ep ? (
            <p className="font-mono text-sm text-sx-gold">{t("rewardEp", { ep: quest.reward.ep })}</p>
          ) : null}
          {quest.reward.codex?.length ? (
            <p className="mt-1 font-mono text-xs text-sx-green">{t("rewardCodex")}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            animate={{ width: `${Math.round(ratio * 100)}%` }}
            className="h-full rounded-full bg-sx-green"
            initial={{ width: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="font-mono text-xs text-sx-dim">{t("progress", { done: safeProgress, total: quest.goal })}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {!unlocked ? (
          <span className="rounded-sx border border-[var(--stroke-soft)] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-sx-dim">
            {t("locked")}
          </span>
        ) : (
          <div className="flex items-center gap-2">
            {!ready && manualTrigger ? (
              <Button variant="secondary" onClick={onIncrement}>
                {t("markDone")}
              </Button>
            ) : null}
            {ready ? (
              <Button onClick={onClaim} disabled={claimed}>
                {claimed ? t("claimed") : t("claim")}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );
}
