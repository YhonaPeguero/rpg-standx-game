"use client";

import { useId } from "react";
import type { Rank } from "@/types";
import { useGameStore } from "@/store";
import { cn } from "@/lib/utils";

export type MascotPose = "idle" | "point" | "peek" | "meh" | "cheer";

type MascotProps = {
  pose?: MascotPose;
  /** Growth stage drawn on the sprout (extra leaves, bud, flower). */
  stage?: Rank;
  className?: string;
  /** Force-disable idle motion regardless of settings (e.g. tiny avatars). */
  still?: boolean;
};

const OUTLINE = "#07090c";
const BODY_DARK = "#171c22";
const SCLERA = "#f2f4e6";
const SMILE = "#e8efe2";
const BLUSH = "#d98545";
const GOLD = "#ffd900";
const LEAF_LIGHT = "#46b14a";
const LEAF_DARK = "#1e7e2f";

function stageIndex(stage: Rank) {
  return ["new_stander", "active", "consistent", "seed_candidate", "seed", "sprout", "flower"].indexOf(stage);
}

/** Outlined capsule limb: a round-cap stroke drawn twice (outline + body fill). */
function Limb({ d, width = 10 }: { d: string; width?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth={width + 5.5} />
      <path d={d} fill="none" stroke={BODY_DARK} strokeLinecap="round" strokeWidth={width} />
    </>
  );
}

const GAZE: Record<MascotPose, { ix: number; iy: number; px: number; py: number; hx: number; hy: number }> = {
  idle: { ix: 102, iy: 109, px: 106, py: 113, hx: 92, hy: 97 },
  point: { ix: 106, iy: 103, px: 111, py: 98, hx: 96, hy: 92 },
  cheer: { ix: 102, iy: 107, px: 105, py: 109, hx: 92, hy: 96 },
  meh: { ix: 102, iy: 112, px: 105, py: 116, hx: 92, hy: 100 },
  peek: { ix: 94, iy: 110, px: 89, py: 113, hx: 86, hy: 99 },
};

const PETALS = ["#00e832", "#ffe600", "#00aaff", "#9945ff", "#ff3366", "#00e8c8"];

export function Mascot({ pose = "idle", stage = "new_stander", className, still }: MascotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const animated = !still && !reduceMotion;
  const growth = Math.max(0, stageIndex(stage));
  const gaze = GAZE[pose];
  const lidded = pose === "meh" || pose === "peek";

  return (
    <svg aria-label="Stander mascot" className={cn("block", className)} role="img" viewBox="0 0 200 200">
      <defs>
        <radialGradient cx="38%" cy="28%" id={`${uid}-body`} r="80%">
          <stop offset="0%" stopColor="#2c333b" />
          <stop offset="55%" stopColor="#1a2026" />
          <stop offset="100%" stopColor="#10141a" />
        </radialGradient>
        <radialGradient cx="40%" cy="32%" id={`${uid}-iris`} r="75%">
          <stop offset="0%" stopColor="#67cf6e" />
          <stop offset="55%" stopColor="#1f9e42" />
          <stop offset="100%" stopColor="#0b6325" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} r="50%">
          <stop offset="0%" stopColor="rgba(0,232,50,0.3)" />
          <stop offset="100%" stopColor="rgba(0,232,50,0)" />
        </radialGradient>
        <clipPath id={`${uid}-mouth`}>
          <path d="M80 142 Q100 136 120 142 Q118 166 100 168 Q82 166 80 142 Z" />
        </clipPath>
      </defs>

      {/* Grounding glow */}
      <ellipse cx="100" cy="180" fill={`url(#${uid}-glow)`} rx="52" ry="11" />

      {pose === "cheer" ? (
        <g aria-hidden="true">
          {[
            { x: 30, y: 64, s: 1 },
            { x: 172, y: 54, s: 0.9 },
            { x: 22, y: 132, s: 0.85 },
            { x: 178, y: 126, s: 1 },
          ].map((p, i) => (
            <text
              className={animated ? "sx-m-spark" : undefined}
              fill={GOLD}
              fontFamily="var(--font-mono), monospace"
              fontSize={26 * p.s}
              fontWeight={800}
              key={`d${i}`}
              paintOrder="stroke"
              stroke="#8f6c00"
              strokeWidth="1.4"
              style={animated ? { animationDelay: `${i * 0.22}s` } : { opacity: 0.92 }}
              textAnchor="middle"
              x={p.x}
              y={p.y}
            >
              $
            </text>
          ))}
          {[
            { x: 44, y: 30, s: 1 },
            { x: 158, y: 24, s: 0.8 },
            { x: 14, y: 94, s: 0.7 },
            { x: 186, y: 90, s: 0.8 },
            { x: 136, y: 12, s: 0.6 },
          ].map((p, i) => (
            <g key={`s${i}`} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
              <path
                className={animated ? "sx-m-spark" : undefined}
                d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z"
                fill={GOLD}
                stroke="#8f6c00"
                strokeWidth="1"
                style={animated ? { animationDelay: `${0.1 + i * 0.18}s` } : { opacity: 0.92 }}
              />
            </g>
          ))}
        </g>
      ) : null}

      <g className={animated ? (pose === "cheer" ? "sx-m-bounce" : "sx-m-bob") : undefined}>
        {/* Feet */}
        {pose !== "peek" ? (
          <>
            <ellipse cx="84" cy="171" fill={BODY_DARK} rx="9" ry="8" stroke={OUTLINE} strokeWidth="4" />
            <ellipse cx="116" cy="171" fill={BODY_DARK} rx="9" ry="8" stroke={OUTLINE} strokeWidth="4" />
          </>
        ) : null}

        {/* Arms behind/around the body */}
        {pose === "idle" ? (
          <>
            <Limb d="M58 124 L40 107" />
            <Limb d="M142 124 L160 107" />
          </>
        ) : null}
        {pose === "cheer" ? (
          <>
            <Limb d="M62 122 L52 98" />
            <Limb d="M138 122 L148 98" />
          </>
        ) : null}

        {/* Sprout stem + leaf */}
        <path d="M100 66 C103 56 107 47 114 38" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="6" />
        <g
          className={animated ? "sx-m-sway" : undefined}
          style={{ transformBox: "fill-box", transformOrigin: "0% 85%" }}
        >
          <path d="M114 38 C120 18 142 8 158 12 C156 30 138 44 114 38 Z" fill={LEAF_DARK} stroke={OUTLINE} strokeLinejoin="round" strokeWidth="5" />
          <path d="M114 38 C120 18 142 8 158 12 C146 16 128 26 114 38 Z" fill={LEAF_LIGHT} />
          <path d="M117 36 C128 26 142 18 154 14" fill="none" stroke="#145723" strokeLinecap="round" strokeWidth="2.5" />
        </g>

        {/* Growth stages above the sprout */}
        {growth >= 3 ? (
          <>
            <path d="M100 60 C96 48 92 42 88 36" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4.5" />
            <ellipse cx="84" cy="32" fill="#2fae47" rx="13" ry="6" stroke={OUTLINE} strokeWidth="3" transform="rotate(-35 84 32)" />
          </>
        ) : null}
        {growth >= 4 ? (
          <>
            <path d="M104 58 C116 44 124 32 132 24" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4.5" />
            <ellipse cx="136" cy="22" fill="#9dffad" rx="13" ry="6.5" stroke={OUTLINE} strokeWidth="3" transform="rotate(25 136 22)" />
          </>
        ) : null}
        {growth === 5 ? (
          <>
            <path d="M102 60 C104 42 106 26 107 16" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4.5" />
            <circle cx="108" cy="11" fill="#ffe600" r="7" stroke={OUTLINE} strokeWidth="3" />
          </>
        ) : null}
        {growth >= 6 ? (
          <>
            <path d="M102 60 C104 42 106 26 107 18" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4.5" />
            {PETALS.map((color, i) => (
              <ellipse
                cx="108"
                cy="11"
                fill={color}
                key={color}
                rx="5.5"
                ry="10"
                stroke={OUTLINE}
                strokeWidth="2"
                transform={`rotate(${i * 60} 108 11)`}
              />
            ))}
            <circle cx="108" cy="11" fill="#ffe600" r="6" stroke={OUTLINE} strokeWidth="2.5" />
          </>
        ) : null}

        {/* Body */}
        <ellipse cx="100" cy="116" fill={`url(#${uid}-body)`} rx="54" ry="52" stroke={OUTLINE} strokeWidth="7" />

        {/* Eye */}
        <ellipse cx="100" cy="106" fill={SCLERA} rx="30" ry="31" />
        <circle cx={gaze.ix} cy={gaze.iy} fill={`url(#${uid}-iris)`} r="19" />
        <circle cx={gaze.px} cy={gaze.py} fill="#053015" r="10" />
        <circle cx={gaze.hx} cy={gaze.hy} fill="#ffffff" r="6.5" />

        {/* Half-closed lid + heavy brow (unimpressed) */}
        {lidded ? (
          <>
            <path d="M69 104 A31 32 0 0 1 131 104 Q100 117 69 104 Z" fill={BODY_DARK} />
            <path d="M70 104 Q100 116 130 104" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="4" />
            <path d="M72 84 Q100 76 128 84" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth="5" />
          </>
        ) : null}

        {/* Blink lid (animated) */}
        {animated && !lidded ? (
          <ellipse
            className="sx-m-blink"
            cx="100"
            cy="106"
            fill={BODY_DARK}
            rx="30"
            ry="31"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", transform: "scaleY(0)" }}
          />
        ) : null}

        {/* Mouth */}
        {pose === "idle" || pose === "point" ? (
          <path d="M85 148 Q100 158 115 148" fill="none" stroke={SMILE} strokeLinecap="round" strokeWidth="5" />
        ) : null}
        {lidded ? (
          <path d="M88 153 Q100 146 112 153" fill="none" stroke={SMILE} strokeLinecap="round" strokeWidth="4.5" />
        ) : null}
        {pose === "cheer" ? (
          <>
            <path d="M80 142 Q100 136 120 142 Q118 166 100 168 Q82 166 80 142 Z" fill="#140b04" stroke={OUTLINE} strokeLinejoin="round" strokeWidth="4" />
            <ellipse clipPath={`url(#${uid}-mouth)`} cx="100" cy="163" fill="#ffb000" rx="13" ry="7" />
            <path d="M55 128 l11 -4 M57 135 l11 -4 M59 142 l11 -4" stroke={BLUSH} strokeLinecap="round" strokeWidth="3.5" />
            <path d="M145 124 l-11 -4 M143 131 l-11 -4 M141 138 l-11 -4" stroke={BLUSH} strokeLinecap="round" strokeWidth="3.5" />
          </>
        ) : null}

        {/* Point pose (drawn over the body, like the reference art): one arm hugging
            the belly ending in a fist over the smile's tip, the other raised with a
            hand + index finger. */}
        {pose === "point" ? (
          <g>
            <path d="M54 116 C64 132 74 142 86 148" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth={15} />
            <path d="M54 116 C64 132 74 142 86 148" fill="none" stroke={BODY_DARK} strokeLinecap="round" strokeWidth={9.5} />
            <circle cx="89" cy="149" fill={BODY_DARK} r="7.5" stroke={OUTLINE} strokeWidth="4" />
            <path d="M150 108 C166 102 173 92 174 80 Q175 70 185 56" fill="none" stroke={OUTLINE} strokeLinecap="round" strokeWidth={13} />
            <path d="M150 108 C166 102 173 92 174 80 Q175 70 185 56" fill="none" stroke={BODY_DARK} strokeLinecap="round" strokeWidth={8} />
          </g>
        ) : null}

        {/* Hands raised to the face while cheering */}
        {pose === "cheer" ? (
          <>
            <circle cx="56" cy="96" fill={BODY_DARK} r="9" stroke={OUTLINE} strokeWidth="4" />
            <circle cx="144" cy="96" fill={BODY_DARK} r="9" stroke={OUTLINE} strokeWidth="4" />
          </>
        ) : null}
      </g>

      {/* Peeking pole drawn over the body's left edge, with a gripping hand */}
      {pose === "peek" ? (
        <>
          <rect fill="#0a0d10" height="182" rx="4.5" stroke="#2a3037" strokeWidth="1.5" width="9" x="41" y="12" />
          <circle cx="46" cy="128" fill={BODY_DARK} r="9.5" stroke={OUTLINE} strokeWidth="4" />
        </>
      ) : null}
    </svg>
  );
}
