"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Rank } from "@/types";
import { rankOrder } from "@/lib/game/ep";
import { getRankMeta } from "@/lib/game/ranks";
import { audioEngine } from "@/lib/audio/engine";
import { useGameStore } from "@/store";
import { formatRank } from "@/components/hud/RankLabel";
import { MascotCanvas } from "./MascotCanvas";

export function EvolutionCelebration() {
  const rank = useGameStore((state) => state.player.rank);
  const audioEnabled = useGameStore((state) => state.audioEnabled);
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const t = useTranslations("hud");
  const previousRank = useRef<Rank>(rank);
  const [celebrating, setCelebrating] = useState<Rank | null>(null);

  useEffect(() => {
    const previous = previousRank.current;
    previousRank.current = rank;

    if (rankOrder(rank) <= rankOrder(previous)) {
      return;
    }

    setCelebrating(rank);

    if (audioEnabled) {
      audioEngine.playRankUp();
    }

    const id = window.setTimeout(() => setCelebrating(null), reduceMotion ? 2600 : 3200);
    return () => window.clearTimeout(id);
  }, [audioEnabled, rank, reduceMotion]);

  if (!celebrating) {
    return null;
  }

  const meta = getRankMeta(celebrating);

  // Reduced-motion users still get a clear, calm progression cue.
  if (reduceMotion) {
    return (
      <div className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4" role="status">
        <div
          className="flex items-center gap-3 rounded-sx-lg border px-5 py-3 backdrop-blur"
          style={{ borderColor: meta.accent, background: "var(--bg-overlay)" }}
        >
          <span aria-hidden="true" className="font-display text-2xl" style={{ color: meta.accent }}>
            {meta.icon}
          </span>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-sx-gold">{t("rankUp")}</p>
            <p className="font-display text-lg font-bold uppercase tracking-[0.16em]" style={{ color: meta.accent }}>
              {formatRank(celebrating)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-sx-bg/75 backdrop-blur-sm" role="status">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, index) => {
          const angle = (index / 24) * Math.PI * 2;
          const distance = 130 + (index % 4) * 26;

          return (
            <motion.span
              animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0, scale: 0.2 }}
              className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              key={index}
              style={{ background: meta.accent, boxShadow: `0 0 14px ${meta.accent}` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          );
        })}
      </div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        className="text-center"
        initial={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <MascotCanvas stage={celebrating} className="h-72 w-72 md:h-80 md:w-80" />
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs uppercase tracking-[0.45em] text-sx-gold"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          {t("rankUp")}
        </motion.p>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-display text-3xl font-black uppercase tracking-[0.22em] md:text-4xl"
          initial={{ opacity: 0, y: 10 }}
          style={{ color: meta.accent, textShadow: `0 0 24px ${meta.accent}66` }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <span aria-hidden="true" className="mr-3">{meta.icon}</span>
          {formatRank(celebrating)}
        </motion.p>
      </motion.div>
    </div>
  );
}
