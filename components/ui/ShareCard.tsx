"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { loadSvgImage, shareMascotSvg } from "@/lib/share/shareMascot";
import { Button } from "./Button";
import { Card } from "./Card";

type ShareRun = {
  displayName: string;
  ep: number;
  rank: string;
  squad: string;
};

type ShareCardProps = {
  run: ShareRun;
};

export function ShareCard({ run }: ShareCardProps) {
  const t = useTranslations("share");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  async function generate() {
    await document.fonts.ready;
    const css = getComputedStyle(document.documentElement);
    const display = css.getPropertyValue("--font-display").trim() || "Orbitron, sans-serif";
    const mono = css.getPropertyValue("--font-mono").trim() || "monospace";

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const setSpacing = (value: string) => {
      (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = value;
    };

    // Atmosphere: vertical fade + faint grid + green glow behind the mascot.
    const bg = ctx.createLinearGradient(0, 0, 0, 630);
    bg.addColorStop(0, "#04080f");
    bg.addColorStop(0.6, "#071018");
    bg.addColorStop(1, "#04140a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1200, 630);

    ctx.strokeStyle = "rgba(0, 232, 50, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 630);
      ctx.stroke();
    }
    for (let y = 0; y <= 630; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    const glow = ctx.createRadialGradient(930, 300, 40, 930, 300, 320);
    glow.addColorStop(0, "rgba(0, 232, 50, 0.2)");
    glow.addColorStop(1, "rgba(0, 232, 50, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(600, 0, 600, 630);

    const glowL = ctx.createRadialGradient(140, 60, 20, 140, 60, 320);
    glowL.addColorStop(0, "rgba(0, 170, 255, 0.1)");
    glowL.addColorStop(1, "rgba(0, 170, 255, 0)");
    ctx.fillStyle = glowL;
    ctx.fillRect(0, 0, 520, 420);

    // Frame with bright corner ticks.
    ctx.strokeStyle = "rgba(0, 232, 50, 0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(28.5, 28.5, 1143, 573);
    ctx.strokeStyle = "#00e832";
    ctx.lineWidth = 5;
    for (const [cx, cy, dx, dy] of [
      [28, 28, 1, 1],
      [1172, 28, -1, 1],
      [28, 602, 1, -1],
      [1172, 602, -1, -1],
    ] as const) {
      ctx.beginPath();
      ctx.moveTo(cx + dx * 28, cy);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx, cy + dy * 28);
      ctx.stroke();
    }

    // Header
    setSpacing("7px");
    ctx.fillStyle = "#ffe600";
    ctx.font = `24px ${mono}`;
    ctx.fillText("STANDX RPG · GROWTH PATH", 76, 110);

    // Player name (auto-shrinks to stay clear of the mascot).
    const name = run.displayName.toUpperCase().slice(0, 18);
    let size = 72;
    setSpacing("3px");
    ctx.font = `900 ${size}px ${display}`;
    while (ctx.measureText(name).width > 620 && size > 34) {
      size -= 4;
      ctx.font = `900 ${size}px ${display}`;
    }
    ctx.fillStyle = "#00e832";
    ctx.shadowColor = "rgba(0, 232, 50, 0.55)";
    ctx.shadowBlur = 26;
    ctx.fillText(name, 76, 248);
    ctx.shadowBlur = 0;

    // Rank chip
    const rankText = run.rank.toUpperCase();
    setSpacing("4px");
    ctx.font = `700 22px ${mono}`;
    const chipWidth = ctx.measureText(rankText).width + 44;
    ctx.fillStyle = "rgba(255, 230, 0, 0.1)";
    ctx.strokeStyle = "rgba(255, 230, 0, 0.65)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(76, 286, chipWidth, 46, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffe600";
    ctx.fillText(rankText, 98, 316);

    // Stats
    setSpacing("2px");
    ctx.fillStyle = "#e8f4ff";
    ctx.font = `700 42px ${display}`;
    ctx.fillText(`${run.ep} EP`, 76, 412);
    setSpacing("3px");
    ctx.fillStyle = "#c8d8e8";
    ctx.font = `24px ${mono}`;
    ctx.fillText(`${t("squad").toUpperCase()}: ${run.squad.toUpperCase()}`, 76, 456);

    // Footer
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(76, 520);
    ctx.lineTo(1124, 520);
    ctx.stroke();
    ctx.fillStyle = "#3a5070";
    ctx.font = `20px ${mono}`;
    ctx.fillText("SMALL ACTIONS. REAL PROGRESS.", 76, 562);
    ctx.fillStyle = "#00e832";
    ctx.textAlign = "right";
    ctx.fillText("STANDX.IO", 1124, 562);
    ctx.textAlign = "left";
    setSpacing("0px");

    // Mascot celebrates on the right (decorative — keep the card if it fails).
    try {
      const mascot = await loadSvgImage(shareMascotSvg());
      ctx.drawImage(mascot, 770, 116, 366, 366);
    } catch {
      // canvas keeps the glow + stats only
    }

    setDataUrl(canvas.toDataURL("image/png"));
  }

  async function copy() {
    if (!dataUrl) {
      return;
    }

    // Copy the PNG itself so it can be pasted straight into X/Discord.
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch {
      await navigator.clipboard.writeText(dataUrl);
    }
  }

  function download() {
    if (!dataUrl) {
      return;
    }

    linkRef.current?.click();
  }

  return (
    <Card className="p-6">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
      <h2 className="mt-4 font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("title")}</h2>
      <p className="mt-3 font-semibold leading-7 text-sx-text">{t("body")}</p>
      <div className="mt-5 grid gap-3">
        <Button onClick={generate}>{t("generate")}</Button>
        <Button variant="secondary" disabled={!dataUrl} onClick={copy}>
          {t("copy")}
        </Button>
        <Button variant="secondary" disabled={!dataUrl} onClick={download}>
          {t("download")}
        </Button>
        {dataUrl ? (
          <a
            className="rounded-sx border border-[var(--stroke-brand)] px-4 py-3 text-center font-display text-xs font-bold uppercase tracking-[0.22em] text-sx-green"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t("tweet"))}`}
            rel="noreferrer"
            target="_blank"
          >
            {t("shareX")}
          </a>
        ) : null}
      </div>
      {dataUrl ? <img alt={t("previewAlt")} className="mt-5 rounded-sx border border-[var(--stroke-soft)]" src={dataUrl} /> : null}
      <a className="hidden" download="standx-share-card.png" href={dataUrl ?? undefined} ref={linkRef} />
    </Card>
  );
}
