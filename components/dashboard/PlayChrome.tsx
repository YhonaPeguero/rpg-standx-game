"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/hud/TopBar";
import { BottomNav } from "@/components/dashboard/Sidebar";

export function PlayChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const inScene = pathname?.startsWith("/play/scene/") ?? false;

  if (inScene) {
    return <div className="min-h-dvh px-3 py-3 md:px-6 md:py-4">{children}</div>;
  }

  return (
    <div className="min-h-dvh px-4 pb-28 pt-4 md:px-8 md:pb-8 md:pt-6">
      <TopBar />
      {children}
      <BottomNav />
    </div>
  );
}
