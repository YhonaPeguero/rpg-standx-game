"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Mascot, type MascotPose } from "@/components/mascot/Mascot";
import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store";
import { onEpGain } from "@/lib/game/epPulse";
import { RankLabel } from "@/components/hud/RankLabel";

export function MascotPanel() {
  const t = useTranslations("dashboard");
  const player = useGameStore((state) => state.player);
  const [pose, setPose] = useState<MascotPose>("idle");
  const timer = useRef(0);

  // The mascot celebrates with the player whenever EP lands.
  useEffect(() => {
    const unsubscribe = onEpGain(() => {
      setPose("cheer");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPose("idle"), 2100);
    });
    return () => {
      unsubscribe();
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <Card className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center lg:sticky lg:top-28">
      <Mascot className="h-72 w-72 drop-shadow-[0_0_26px_rgba(0,232,50,0.35)]" pose={pose} stage={player.rank} />
      <p className="mt-6 font-display text-xl font-bold uppercase tracking-[0.18em] text-sx-green">{player.displayName}</p>
      <div className="mt-4">
        <RankLabel rank={player.rank} />
      </div>
      <p className="mt-4 font-semibold leading-7 text-sx-text">{t("mascotStatus")}</p>
    </Card>
  );
}
