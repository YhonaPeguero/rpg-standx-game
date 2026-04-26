"use client";

import { useTranslations } from "next-intl";
import { getAchievements } from "@/lib/content/codex";
import { useGameStore } from "@/store";
import { Card } from "@/components/ui/Card";
import { ShareCard } from "@/components/ui/ShareCard";
import { formatRank } from "@/components/hud/RankLabel";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const player = useGameStore((state) => state.player);
  const locale = useGameStore((state) => state.locale);
  const unlocked = getAchievements().filter((achievement) => player.achievements.includes(achievement.id));

  return (
    <main className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_360px]">
      <Card className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">{player.displayName}</h1>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
            <p className="font-mono text-2xl text-sx-green">{player.ep}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">EP</p>
          </div>
          <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
            <p className="font-mono text-2xl text-sx-gold">{formatRank(player.rank)}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">{t("rank")}</p>
          </div>
          <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
            <p className="font-mono text-2xl text-sx-text">{player.squad ?? t("none")}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">{t("squad")}</p>
          </div>
        </div>
        <h2 className="mt-8 font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("achievements")}</h2>
        <div className="mt-4 grid gap-3">
          {unlocked.length === 0 ? <p className="font-semibold text-sx-text">{t("empty")}</p> : null}
          {unlocked.map((achievement) => (
            <div className="rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4" key={achievement.id}>
              <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-sx-green">{achievement.title[locale]}</p>
              <p className="mt-2 font-semibold text-sx-text">{achievement.description[locale]}</p>
            </div>
          ))}
        </div>
      </Card>
      <ShareCard run={{ displayName: player.displayName, ep: player.ep, rank: formatRank(player.rank), squad: player.squad ?? t("none") }} />
    </main>
  );
}
