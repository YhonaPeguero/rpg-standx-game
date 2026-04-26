"use client";

import { motion } from "framer-motion";

type EPRingProps = {
  ep: number;
  current: number;
  next: number;
};

export function EPRing({ ep, current, next }: EPRingProps) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = next <= current ? 1 : Math.min(1, Math.max(0, (ep - current) / (next - current)));

  return (
    <svg className="h-14 w-14" viewBox="0 0 56 56" role="img" aria-label={`${ep} Engage Points`}>
      <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
      <motion.circle
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        cx="28"
        cy="28"
        fill="none"
        initial={false}
        r={radius}
        stroke="var(--green-primary)"
        strokeDasharray={circumference}
        strokeLinecap="round"
        strokeWidth="5"
        style={{ rotate: -90, transformOrigin: "50% 50%" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <text x="28" y="31" textAnchor="middle" className="fill-sx-green font-mono text-[10px]">
        EP
      </text>
    </svg>
  );
}
