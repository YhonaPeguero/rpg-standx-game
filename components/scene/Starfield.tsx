"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store";
import { cn } from "@/lib/utils";

type StarfieldProps = {
  className?: string;
  density?: number;
  accent?: string;
};

type Star = {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  hue: number;
};

export function Starfield({ className, density = 100, accent = "#00e832" }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useGameStore((state) => state.reduceMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isStatic = reduceMotion || mediaQuery.matches;

    let stars: Star[] = [];
    let raf = 0;
    let disposed = false;
    let width = 0;
    let height = 0;
    let ratio = 1;

    function reseed() {
      const rect = canvas!.getBoundingClientRect();
      ratio = Math.min(2, window.devicePixelRatio || 1);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.3 + Math.random() * 0.7,
        speed: 0.02 + Math.random() * 0.08,
        size: Math.random() < 0.86 ? 0.7 : 1.6,
        hue: Math.random() < 0.12 ? 1 : 0,
      }));
    }

    function frame() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = "rgba(4, 8, 15, 0.55)";
      ctx!.fillRect(0, 0, width, height);

      for (const star of stars) {
        if (!isStatic) {
          star.y += star.speed;
          if (star.y > height + 4) {
            star.y = -4;
            star.x = Math.random() * width;
          }
        }
        ctx!.globalAlpha = 0.35 + star.z * 0.65;
        ctx!.fillStyle = star.hue ? accent : "#dde7ff";
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size * (0.6 + star.z), 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      if (!disposed && !isStatic) {
        raf = requestAnimationFrame(frame);
      }
    }

    function handleResize() {
      reseed();
      frame();
    }

    reseed();
    frame();
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, [accent, density, reduceMotion]);

  return <canvas ref={canvasRef} className={cn("block h-full w-full", className)} aria-hidden="true" />;
}
