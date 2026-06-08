"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ZoneId } from "@/types";
import { useGameStore } from "@/store";
import { AudioToggle } from "@/components/hud/AudioToggle";
import { Icon } from "@/components/ui/Icon";
import { MascotCanvas } from "@/components/mascot/MascotCanvas";
import { Starfield } from "./Starfield";

type GameStageProps = {
  act: number;
  title: string;
  subtitle?: string;
  zone: ZoneId;
  sceneIndex: number;
  sceneTotal: number;
  mode: "dialog" | "panel";
  notLocalized?: boolean;
  children: ReactNode;
};

const zoneMeta: Record<ZoneId, { label: string; accent: string; sky: string; ground: string; marker: string; glyph: string }> = {
  void: { label: "THE VOID", accent: "#00e832", sky: "from-[#02050a] via-[#061020] to-[#04080f]", ground: "#00e832", marker: "boot", glyph: "◉" },
  discord_plaza: { label: "DISCORD PLAZA", accent: "#00aaff", sky: "from-[#030611] via-[#07162a] to-[#040a18]", ground: "#00aaff", marker: "channels", glyph: "✦" },
  event_arena: { label: "EVENT ARENA", accent: "#ff3366", sky: "from-[#100307] via-[#1a0610] to-[#08040a]", ground: "#ff3366", marker: "live event", glyph: "▲" },
  content_district: { label: "CONTENT DISTRICT", accent: "#9945ff", sky: "from-[#07030d] via-[#11071f] to-[#080412]", ground: "#9945ff", marker: "studio", glyph: "❖" },
  moderator_gate: { label: "MODERATOR GATE", accent: "#ff9900", sky: "from-[#0f0702] via-[#180e06] to-[#080502]", ground: "#ff9900", marker: "review", glyph: "◆" },
  seed_hall: { label: "SEED HALL", accent: "#ffe600", sky: "from-[#0d0d04] via-[#161407] to-[#080804]", ground: "#ffe600", marker: "seed", glyph: "✸" },
};

export function GameStage({ act, title, subtitle, zone, sceneIndex, sceneTotal, mode, notLocalized, children }: GameStageProps) {
  const t = useTranslations("scene");
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const meta = zoneMeta[zone];
  const sceneProgress = Math.round(((sceneIndex + 1) / sceneTotal) * 100);
  const markerLeft = 34 + Math.min(42, sceneIndex * 11);

  return (
    <section className={`relative mx-auto min-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-sx-lg border border-[var(--stroke-brand)] bg-gradient-to-b ${meta.sky} shadow-[0_0_70px_rgba(0,0,0,0.45)] md:min-h-[720px]`}>
      <div className="absolute inset-x-0 top-0 z-20 border-b border-[var(--stroke-brand)] bg-sx-bg/60 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 py-2">
          <Link
            aria-label={t("exitToHq")}
            className="flex items-center gap-1.5 rounded-sx border border-[var(--stroke-soft)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green hover:text-sx-green"
            href="/play"
          >
            <Icon name="arrowLeft" size={14} />
            <span className="hidden sm:inline">{t("exitToHq")}</span>
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-sx-green">Act {act}</p>
          <div className="h-px flex-1 bg-sx-green/20">
            <div className="h-px bg-sx-green" style={{ width: `${sceneProgress}%` }} />
          </div>
          <p className="hidden font-mono text-xs uppercase tracking-[0.28em] text-sx-gold md:block">{meta.label}</p>
          <p className="rounded-sx border border-[var(--stroke-soft)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-sx-dim">
            {sceneIndex + 1}/{sceneTotal}
          </p>
          <AudioToggle className="h-7 w-7 text-sm" />
        </div>
        {notLocalized ? (
          <p
            className="border-t border-sx-gold/30 bg-sx-gold/10 px-4 py-1 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-sx-gold"
            role="status"
          >
            {t("fallbackNotice")}
          </p>
        ) : null}
      </div>

      <div className="absolute inset-0">
        <Starfield className="opacity-70" accent={meta.accent} density={70} />
        <span
          className={`absolute left-[16%] top-[35%] h-5 w-5 rounded-full blur-md ${reduceMotion ? "" : "animate-pulse"}`}
          style={{ background: `${meta.accent}44` }}
        />
        <span
          className={`absolute left-[67%] top-[18%] h-7 w-7 rounded-full blur-lg ${reduceMotion ? "" : "animate-pulse"}`}
          style={{ background: `${meta.accent}33`, animationDelay: "0.7s" }}
        />
        <span
          className={`absolute left-[42%] top-[57%] h-6 w-6 rounded-full blur-lg ${reduceMotion ? "" : "animate-pulse"}`}
          style={{ background: `${meta.accent}2c`, animationDelay: "1.4s" }}
        />
      </div>

      <div className="absolute bottom-[158px] left-0 right-0 h-px shadow-[0_0_16px_currentColor]" style={{ color: meta.ground, background: meta.ground }} />
      <div
        className="absolute bottom-0 left-0 right-0 h-[158px] opacity-60"
        style={{
          backgroundImage: `linear-gradient(${meta.ground}18 1px, transparent 1px), linear-gradient(90deg, ${meta.ground}14 1px, transparent 1px)`,
          backgroundSize: "72px 28px",
        }}
      />

      <div className="absolute bottom-[130px] left-[13%] z-10 h-24 w-24 md:left-[28%]">
        <MascotCanvas className="h-full w-full drop-shadow-[0_0_14px_rgba(0,232,50,0.45)]" />
      </div>

      <div className="absolute bottom-[180px] z-10 transition-[left] duration-700 ease-out" style={{ left: `${markerLeft}%` }}>
        <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-current bg-sx-bg/30 text-sx-green shadow-glow-green" style={{ color: meta.accent }}>
          {reduceMotion ? null : (
            <span className="absolute inset-0 animate-ping rounded-full border border-current opacity-30" />
          )}
          <span className="absolute inset-3 rounded-full border border-current opacity-40" />
          <span className="text-2xl leading-none" aria-hidden="true">{meta.glyph}</span>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em]">{meta.marker}</span>
        </div>
      </div>

      <div className="absolute left-5 top-16 z-20 max-w-xl md:left-8 md:top-20">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{subtitle ?? meta.label}</p>
        <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-[0.14em] text-sx-green drop-shadow-[0_0_18px_rgba(0,232,50,0.42)] md:text-5xl">
          {title}
        </h1>
      </div>

      <div className={mode === "dialog" ? "absolute inset-0 z-30" : "absolute inset-x-4 top-32 z-30 mx-auto max-w-4xl pb-8 md:top-36"}>{children}</div>
    </section>
  );
}
