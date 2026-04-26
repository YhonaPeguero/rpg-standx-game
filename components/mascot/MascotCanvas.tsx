"use client";

import { useEffect, useRef } from "react";
import type { Rank } from "@/types";
import { useGameStore } from "@/store";
import { cn } from "@/lib/utils";

type MascotCanvasProps = {
  stage?: Rank;
  className?: string;
};

function stageIndex(stage: Rank) {
  return ["new_stander", "active", "consistent", "seed_candidate", "seed", "sprout", "flower"].indexOf(stage);
}

function leaf(ctx: CanvasRenderingContext2D, t: number, stage: Rank) {
  const growth = Math.max(0, stageIndex(stage));
  ctx.save();
  ctx.translate(8, -48);
  ctx.rotate(-0.44 + Math.sin(t * 0.04) * 0.06);
  ctx.scale(1 + growth * 0.05, 1 + growth * 0.03);
  const gradient = ctx.createLinearGradient(-18, 0, 22, 0);
  gradient.addColorStop(0, "#1a5a1a");
  gradient.addColorStop(0.5, "#00b020");
  gradient.addColorStop(1, "#1a5a1a");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(10, 0, 26, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.32)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(34, 0);
  ctx.stroke();
  ctx.restore();
}

function drawGrowth(ctx: CanvasRenderingContext2D, t: number, stage: Rank) {
  const growth = stageIndex(stage);

  if (growth < 2) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = "#00b020";
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, -42);
  ctx.quadraticCurveTo(2, -62, 0, -78 - growth * 2);
  ctx.stroke();

  if (growth >= 3) {
    ctx.fillStyle = "#00e832";
    ctx.save();
    ctx.translate(-12, -66);
    ctx.rotate(-0.7 + Math.sin(t * 0.04) * 0.05);
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (growth >= 4) {
    ctx.fillStyle = "#9dffad";
    ctx.save();
    ctx.translate(14, -76);
    ctx.rotate(0.6 + Math.sin(t * 0.04) * 0.05);
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (growth === 5) {
    ctx.fillStyle = "#ffe600";
    ctx.beginPath();
    ctx.arc(0, -92, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  if (growth >= 6) {
    const petalColors = ["#00e832", "#ffe600", "#00aaff", "#9945ff", "#ff3366", "#00e8c8"];
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2 + t * 0.01;
      ctx.save();
      ctx.translate(Math.cos(angle) * 11, -94 + Math.sin(angle) * 8);
      ctx.rotate(angle);
      ctx.fillStyle = petalColors[i];
      ctx.beginPath();
      ctx.ellipse(0, 0, 9, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#ffe600";
    ctx.beginPath();
    ctx.arc(0, -94, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawNewStander(ctx: CanvasRenderingContext2D, size: number, t: number, still: boolean, stage: Rank) {
  const scale = size / 180;
  const bob = still ? 0 : Math.sin(t * 0.05) * 3;
  const growth = Math.max(0, stageIndex(stage));
  const bodyBoost = growth * 2.2;

  ctx.save();
  ctx.translate(size / 2, size / 2 + 16 + bob);
  ctx.scale(scale, scale);

  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 88);
  glow.addColorStop(0, "rgba(0, 232, 50, 0.22)");
  glow.addColorStop(1, "rgba(0, 232, 50, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 88, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#1b1f24";
  ctx.lineWidth = 7;
  ctx.fillStyle = "#080b0d";
  ctx.beginPath();
  ctx.ellipse(0, 6 - growth * 0.8, 46 + bodyBoost, 43 + bodyBoost * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, -38);
  ctx.quadraticCurveTo(4, -52, 9, -62);
  ctx.stroke();
  leaf(ctx, t, stage);
  drawGrowth(ctx, t, stage);

  ctx.fillStyle = "#0a0a0a";
  ctx.strokeStyle = "#222831";
  ctx.lineWidth = 4;
  ctx.save();
  ctx.translate(-33, 14);
  ctx.rotate(-0.34);
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 20, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(33, 14);
  ctx.rotate(0.34);
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 20, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(-18, 47);
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(18, 47);
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#f7fff9";
  ctx.beginPath();
  ctx.ellipse(0, -4, 28, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  const eyeGlow = ctx.createRadialGradient(6, -5, 4, 6, -5, 28);
  eyeGlow.addColorStop(0, "#baffc2");
  eyeGlow.addColorStop(0.45, "#00e832");
  eyeGlow.addColorStop(1, "#006e18");
  ctx.fillStyle = eyeGlow;
  ctx.beginPath();
  ctx.ellipse(5, -4, 19, 19, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#06260c";
  ctx.beginPath();
  ctx.ellipse(6, -4, 11, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(-4, -13, 7, 5, -0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#dfffe3";
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(0, -4, 31, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "#c8d8e8";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 22, 17, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

export function MascotCanvas({ stage = "new_stander", className }: MascotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useGameStore((state) => state.reduceMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let animationId = 0;
    let disposed = false;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const size = Math.max(160, Math.floor(Math.min(rect.width || 288, rect.height || 288)));
      const ratio = window.devicePixelRatio || 1;

      if (canvas.width !== size * ratio || canvas.height !== size * ratio) {
        canvas.width = size * ratio;
        canvas.height = size * ratio;
      }

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, size, size);
      drawNewStander(ctx, size, frame, reduceMotion || mediaQuery.matches, stage);
      frame += stage === "new_stander" ? 1 : 1;

      if (!disposed && !reduceMotion && !mediaQuery.matches) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
    };
  }, [reduceMotion, stage]);

  return <canvas ref={canvasRef} className={cn("block", className)} aria-label="Stander mascot" />;
}
