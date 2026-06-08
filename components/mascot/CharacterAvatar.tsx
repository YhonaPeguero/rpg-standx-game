import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Distinctive geometric sigil per character so dialog portraits read as
// characters instead of a single letter. Keyed by CharacterId.
const sigils: Record<string, ReactNode> = {
  // System / AI — a circuit node with radiating spokes.
  sistema: (
    <>
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
      <path d="M12 4v3.4M12 16.6V20M4 12h3.4M16.6 12H20M6.5 6.5l2.4 2.4M15.1 15.1l2.4 2.4M17.5 6.5l-2.4 2.4M8.9 15.1l-2.4 2.4" />
    </>
  ),
  // Mira — faceted gem: the official voice / authority.
  mira: (
    <>
      <path d="M12 3l6 6.5-6 11.5-6-11.5z" />
      <path d="M6 9.5h12" />
    </>
  ),
  // Artifex — moderator's shield with an approval check.
  arttifex: (
    <>
      <path d="M12 3l7 2.5v5.5c0 4.8-3.2 7.8-7 9.5-3.8-1.7-7-4.7-7-9.5V5.5z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  // Gabo — lightning bolt: events and energy.
  gaboo: <path d="M13 3 6 13.5h4.5L10 21l7.5-11H13z" fill="currentColor" stroke="none" />,
  // Dave — isometric cube: the builder.
  dave: (
    <>
      <path d="M12 3.5l7 4v9l-7 4-7-4v-9z" />
      <path d="M5 7.5l7 4 7-4M12 11.5V20.5" />
    </>
  ),
  // 冷酷锦鲤 — stacked waves (koi / depth).
  jinli: (
    <>
      <path d="M3 10c1.8-2.5 3.6-2.5 5.4 0s3.6 2.5 5.4 0 3.6-2.5 5.4 0" />
      <path d="M3 15c1.8-2.5 3.6-2.5 5.4 0s3.6 2.5 5.4 0 3.6-2.5 5.4 0" />
    </>
  ),
  // 哆啦币梦 — coin with a spark (Engage Points as a habit).
  doula: (
    <>
      <circle cx="11" cy="13" r="7" />
      <circle cx="11" cy="13" r="3.2" />
      <path d="M18.6 4.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor" stroke="none" />
    </>
  ),
  // Stander — the cyclops eye mascot (the player).
  stander: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
    </>
  ),
};

type CharacterAvatarProps = {
  id?: string;
  name: string;
  color: string;
  className?: string;
  /** Sigil glyph size in px. */
  glyphSize?: number;
  /** When true, the badge gently "breathes" to signal the active speaker. */
  speaking?: boolean;
};

export function CharacterAvatar({ id, name, color, className, glyphSize = 30, speaking = false }: CharacterAvatarProps) {
  const sigil = id ? sigils[id] : undefined;

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 bg-sx-bg",
        speaking && "sx-talking",
        className,
      )}
      style={{
        borderColor: color,
        color,
        boxShadow: speaking ? `0 0 26px ${color}88, inset 0 0 18px ${color}33` : `0 0 18px ${color}55, inset 0 0 16px ${color}22`,
      }}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.16),transparent_42%)]" />
      {sigil ? (
        <svg
          aria-hidden="true"
          fill="none"
          height={glyphSize}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          viewBox="0 0 24 24"
          width={glyphSize}
        >
          {sigil}
        </svg>
      ) : (
        <span className="font-display text-lg font-bold">{name.slice(0, 1)}</span>
      )}
    </div>
  );
}
