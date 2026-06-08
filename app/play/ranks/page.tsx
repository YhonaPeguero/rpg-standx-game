"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useGameStore } from "@/store";
import { isRankUnlocked, RANK_LADDER } from "@/lib/game/ranks";
import { Card } from "@/components/ui/Card";
import { RankProgress } from "@/components/hud/RankProgress";

export default function RanksPage() {
  const t = useTranslations("ranks");
  const player = useGameStore((state) => state.player);

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-sx-text">{t("intro")}</p>
      </div>

      <RankProgress ep={player.ep} />

      <div className="grid gap-3">
        {RANK_LADDER.map((meta, index) => {
          const unlocked = isRankUnlocked(meta.id, player.rank);
          const isCurrent = player.rank === meta.id;

          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              key={meta.id}
              transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                className={`relative p-5 transition ${
                  isCurrent ? "border-sx-green/60 shadow-glow-green" : unlocked ? "" : "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 bg-sx-bg/60 font-display text-2xl"
                      style={{ borderColor: meta.accent, color: meta.accent }}
                      aria-hidden="true"
                    >
                      {meta.icon}
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-sx-dim">
                        {meta.requirementKey
                          ? t(meta.requirementKey as "req.sprout")
                          : `${meta.minEP} EP`}
                        {meta.discordRole ? " · Discord" : ""}
                      </p>
                      <h3
                        className="mt-1 font-display text-xl font-bold uppercase tracking-[0.18em]"
                        style={{ color: meta.accent }}
                      >
                        {t(`labels.${meta.id}` as `labels.${typeof meta.id}`)}
                      </h3>
                      <p className="mt-2 max-w-xl font-semibold leading-7 text-sx-text">
                        {t(`details.${meta.id}` as `details.${typeof meta.id}`)}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {meta.perks.map((perk) => (
                          <li
                            className="rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sx-text"
                            key={perk}
                          >
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <span
                    className={`rounded-sx border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${
                      unlocked
                        ? "border-sx-green/40 bg-sx-green/10 text-sx-green"
                        : "border-[var(--stroke-soft)] text-sx-dim"
                    }`}
                  >
                    {unlocked ? t("unlocked") : t("locked")}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
