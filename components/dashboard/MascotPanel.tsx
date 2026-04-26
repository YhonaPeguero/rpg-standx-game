"use client";

import { useTranslations } from "next-intl";
import { MascotCanvas } from "@/components/mascot/MascotCanvas";
import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store";
import { RankLabel } from "@/components/hud/RankLabel";

export function MascotPanel() {
  const t = useTranslations("dashboard");
  const player = useGameStore((state) => state.player);

  return (
    <Card className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center lg:sticky lg:top-28">
      <MascotCanvas stage={player.rank} className="h-72 w-72" />
      <p className="mt-6 font-display text-xl font-bold uppercase tracking-[0.18em] text-sx-green">{player.displayName}</p>
      <div className="mt-4">
        <RankLabel rank={player.rank} />
      </div>
      <p className="mt-4 font-semibold leading-7 text-sx-text">{t("mascotStatus")}</p>
    </Card>
  );
}
