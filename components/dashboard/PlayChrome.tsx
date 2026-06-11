"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { audioEngine } from "@/lib/audio/engine";
import { TopBar } from "@/components/hud/TopBar";
import { BottomNav, Sidebar } from "@/components/dashboard/Sidebar";

export function PlayChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inScene = pathname?.startsWith("/play/scene/") ?? false;

  // Lobby music: scenes drive their own zone theme, every other play page
  // hums the plaza track (kicks in after the first user gesture).
  useEffect(() => {
    if (inScene) return;
    audioEngine.startAmbient("discord_plaza");
    return () => audioEngine.stopAmbient();
  }, [inScene]);

  if (inScene) {
    return (
      <>
        <div aria-hidden className="sx-vignette" />
        <div aria-hidden className="sx-grain-overlay" />
        <div className="min-h-dvh px-3 py-3 md:px-6 md:py-4">{children}</div>
      </>
    );
  }

  return (
    <>
      <div aria-hidden className="sx-vignette" />
      <div aria-hidden className="sx-grain-overlay" />
      <div className="min-h-dvh px-4 pb-28 pt-4 md:px-8 md:pb-8 md:pt-6">
        {/* Brand row above the navbar, mirroring the landing header. */}
        <Link className="mx-auto mb-3 flex max-w-7xl items-center gap-2" href="/">
          <span className="font-display text-sm font-bold uppercase tracking-[0.22em] text-sx-green">StandX</span>
          <span className="shrink-0 whitespace-nowrap rounded border border-sx-green/50 bg-sx-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sx-green">
            Community
          </span>
        </Link>
        <TopBar />
        {/* Persistent section nav on every play page so there is always a
            visible way back to the HQ (mobile gets the BottomNav instead). */}
        <div className="mx-auto flex max-w-7xl items-start gap-6">
          <aside className="hidden w-52 shrink-0 lg:sticky lg:top-24 lg:block">
            <Sidebar />
          </aside>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
        <BottomNav />
      </div>
    </>
  );
}
