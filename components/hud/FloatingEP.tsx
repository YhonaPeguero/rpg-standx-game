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
            className="relative rounded-full border border-sx-green/50 bg-sx-bg/90 px-4 py-1.5 font-mono text-lg font-bold text-sx-green shadow-glow-green"
          >
            {reduceMotion
              ? null
              : Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i / 8) * Math.PI * 2;
                  return (
                    <motion.span
                      animate={{ x: Math.cos(angle) * 46, y: Math.sin(angle) * 34, opacity: 0, scale: 0.4 }}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-sx-green"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      key={i}
                      style={{ boxShadow: "0 0 8px rgba(0,232,50,0.8)" }}
                      transition={{ duration: 0.75, ease: "easeOut" }}
                    />
                  );
                })}
            +{pop.amount} EP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
