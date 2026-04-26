"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
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

  function generate() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, "#04080f");
    gradient.addColorStop(0.55, "#080f1a");
    gradient.addColorStop(1, "#00340c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    ctx.fillStyle = "rgba(0, 232, 50, 0.12)";
    ctx.beginPath();
    ctx.arc(960, 128, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(0, 232, 50, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, 1080, 510);

    ctx.fillStyle = "#ffe600";
    ctx.font = "32px monospace";
    ctx.fillText("STANDX GROWTH PATH", 100, 132);

    ctx.fillStyle = "#00e832";
    ctx.font = "bold 78px sans-serif";
    ctx.fillText(run.displayName.toUpperCase(), 100, 240);

    ctx.fillStyle = "#e8f4ff";
    ctx.font = "bold 44px sans-serif";
    ctx.fillText(`${run.rank} / ${run.ep} EP`, 100, 318);
    ctx.fillText(`${t("squad")}: ${run.squad}`, 100, 386);

    ctx.fillStyle = "#00e832";
    ctx.beginPath();
    ctx.ellipse(930, 340, 120, 112, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#04080f";
    ctx.beginPath();
    ctx.ellipse(930, 340, 82, 76, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8f4ff";
    ctx.beginPath();
    ctx.ellipse(930, 322, 54, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#00e832";
    ctx.beginPath();
    ctx.ellipse(940, 322, 30, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#c8d8e8";
    ctx.font = "28px monospace";
    ctx.fillText("Small actions. Real progress.", 100, 510);
    ctx.fillText("standx.io", 910, 510);

    setDataUrl(canvas.toDataURL("image/png"));
  }

  async function copy() {
    if (!dataUrl) {
      return;
    }

    await navigator.clipboard.writeText(dataUrl);
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
