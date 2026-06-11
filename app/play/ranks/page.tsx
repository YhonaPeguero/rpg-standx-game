"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useGameStore } from "@/store";
import { isRankUnlocked, RANK_LADDER } from "@/lib/game/ranks";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Mascot } from "@/components/mascot/Mascot";
import { RankProgress } from "@/components/hud/RankProgress";

// One accent per real-world roadmap step (join → EP → SEED → squad → SPROUT → FLOWER),
// matching the tier identity colors: SEED green, SPROUT sky, FLOWER pink.
const ROADMAP_ACCENTS = ["#00aaff", "#ffe600", "#00e832", "#9945ff", "#6fd2ff", "#ff6ba9"];

export default function RanksPage() {
  const t = useTranslations("ranks");
  const player = useGameStore((state) => state.player);

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 break-words font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-5xl">
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
                        {[0, 1].map((i) => (
                          <li
                            className="rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sx-text"
                            key={i}
                          >
                            {t(`perks.${meta.id}.${i}` as "perks.seed.0")}
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

      <section className="pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("roadmap.badge")}</p>
        <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-[0.16em] text-sx-green md:text-4xl">
          {t("roadmap.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-lg font-semibold leading-8 text-sx-text">{t("roadmap.intro")}</p>

        <div className="relative mt-8">
          <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-px bg-[var(--stroke-brand)]" />
          <ol className="space-y-7">
            {ROADMAP_ACCENTS.map((accent, index) => (
              <motion.li
                animate={{ opacity: 1, x: 0 }}
                className="relative flex gap-5"
                initial={{ opacity: 0, x: -14 }}
                key={accent}
                transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 bg-sx-bg font-display text-sm font-bold"
                  style={{ borderColor: accent, color: accent, boxShadow: `0 0 16px ${accent}40` }}
                >
                  {index + 1}
                </span>
                <div className="pt-0.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-sx-dim">
                    {t(`roadmap.steps.${index}.tag` as "roadmap.steps.0.tag")}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>
                    {t(`roadmap.steps.${index}.title` as "roadmap.steps.0.title")}
                  </h3>
                  <p className="mt-2 max-w-2xl font-semibold leading-7 text-sx-text">
                    {t(`roadmap.steps.${index}.body` as "roadmap.steps.0.body")}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-sx-lg border border-sx-gold/40 bg-sx-gold/5 p-5">
          <Mascot className="h-20 w-20 shrink-0 drop-shadow-[0_0_14px_rgba(255,230,0,0.25)]" pose="cheer" still />
          <p className="font-semibold leading-7 text-sx-text">{t("roadmap.flowerNote")}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em]" style={{ color: "#ff3366" }}>
              <Icon name="x" size={16} />
              {t("roadmap.failTitle")}
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <li className="flex items-start gap-2.5 font-semibold leading-6 text-sx-text" key={i}>
                  <Icon className="mt-1 shrink-0" name="x" size={14} style={{ color: "#ff3366" }} />
                  {t(`roadmap.fails.${i}` as "roadmap.fails.0")}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-sx-green">
              <Icon name="check" size={16} />
              {t("roadmap.workTitle")}
            </h3>
            <ul className="mt-4 grid gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <li className="flex items-start gap-2.5 font-semibold leading-6 text-sx-text" key={i}>
                  <Icon className="mt-1 shrink-0 text-sx-green" name="check" size={14} />
                  {t(`roadmap.works.${i}` as "roadmap.works.0")}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </main>
  );
}
