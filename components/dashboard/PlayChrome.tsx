"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/hud/TopBar";
import { BottomNav, Sidebar } from "@/components/dashboard/Sidebar";

export function PlayChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inScene = pathname?.startsWith("/play/scene/") ?? false;

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
