"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { onEpGain } from "@/lib/game/epPulse";
import { useGameStore } from "@/store";

type Pop = { id: number; amount: number };

export function FloatingEP() {
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const [pops, setPops] = useState<Pop[]>([]);

  useEffect(() => {
    let counter = 0;
    return onEpGain((amount) => {
      const id = counter++;
      setPops((current) => [...current, { id, amount }]);
      window.setTimeout(() => {
        setPops((current) => current.filter((pop) => pop.id !== id));
      }, 1400);
    });
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-1 md:bottom-10">
      <AnimatePresence>
        {pops.map((pop) => (
          <motion.div
            key={pop.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.8 }}
            animate={{ opacity: 1, y: reduceMotion ? 0 : -8, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -40, scale: reduceMotion ? 1 : 0.9 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-full border border-sx-green/50 bg-sx-bg/90 px-4 py-1.5 font-mono text-lg font-bold text-sx-green shadow-glow-green"
          >
            +{pop.amount} EP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
