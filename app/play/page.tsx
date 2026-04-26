"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MascotCanvas } from "@/components/mascot/MascotCanvas";
import { useGameStore } from "@/store";

export default function PlayPage() {
  const t = useTranslations("dashboard");
  const player = useGameStore((state) => state.player);
  const setDisplayName = useGameStore((state) => state.setDisplayName);

  useEffect(() => {
    setDisplayName(player.displayName);
  }, [player.displayName, setDisplayName]);

  return (
    <main className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <Card className="p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-sx-text">{t("intro")}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4">
              <p className="font-mono text-3xl text-sx-green">{player.ep}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-sx-dim">{t("stats.ep")}</p>
            </div>
            <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4">
              <p className="font-mono text-3xl text-sx-gold">{player.streakDays}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-sx-dim">{t("stats.streak")}</p>
            </div>
            <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4">
              <p className="font-mono text-3xl text-sx-text">{player.rank}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-sx-dim">{t("stats.rank")}</p>
            </div>
          </div>
          <Button className="mt-8" disabled>
            {t("lockedCta")}
          </Button>
        </Card>
      </section>
      <aside>
        <Card className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
          <MascotCanvas stage={player.rank} className="h-72 w-72" />
          <p className="mt-6 font-display text-xl font-bold uppercase tracking-[0.18em] text-sx-green">
            {player.displayName}
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.28em] text-sx-dim">{t("mascotStatus")}</p>
        </Card>
      </aside>
    </main>
  );
}
