"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Rank } from "@/types";
import { rankOrder } from "@/lib/game/ep";
import { useGameStore } from "@/store";
import { formatRank } from "@/components/hud/RankLabel";
import { MascotCanvas } from "./MascotCanvas";

export function EvolutionCelebration() {
  const rank = useGameStore((state) => state.player.rank);
  const audioEnabled = useGameStore((state) => state.audioEnabled);
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const previousRank = useRef<Rank>(rank);
  const [celebrating, setCelebrating] = useState<Rank | null>(null);

  useEffect(() => {
    const previous = previousRank.current;

    if (rankOrder(rank) > rankOrder(previous)) {
      if (reduceMotion) {
        previousRank.current = rank;
        return;
      }

      setCelebrating(rank);

      if (audioEnabled) {
        try {
          const context = new AudioContext();
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.frequency.value = 660;
          oscillator.connect(gain);
          gain.connect(context.destination);
          gain.gain.setValueAtTime(0.0001, context.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);
          oscillator.start();
          oscillator.stop(context.currentTime + 0.55);
        } catch {
          // Audio is optional and may be blocked by browser policy.
        }
      }

      window.setTimeout(() => setCelebrating(null), 3000);
    }

    previousRank.current = rank;
  }, [audioEnabled, rank, reduceMotion]);

  if (!celebrating) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-sx-bg/70 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, index) => {
          const angle = (index / 20) * Math.PI * 2;
          const distance = 120 + (index % 4) * 22;

          return (
            <motion.span
              animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0, scale: 0.2 }}
              className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full bg-sx-green shadow-glow-green"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              key={index}
              transition={{ duration: 0.9, ease: "easeOut" }}
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
        <MascotCanvas stage={celebrating} className="h-80 w-80" />
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-black uppercase tracking-[0.24em] text-sx-gold drop-shadow-[0_0_24px_rgba(255,230,0,0.45)]"
          initial={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          {formatRank(celebrating)}
        </motion.p>
      </motion.div>
    </div>
  );
}
