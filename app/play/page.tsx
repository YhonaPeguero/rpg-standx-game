"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Gate } from "@/types";
import { chapterUnlocked } from "@/lib/game/gates";
import { useGameStore } from "@/store";
import { ChapterCard, type DashboardChapter } from "@/components/dashboard/ChapterCard";
import { GrowthTree } from "@/components/dashboard/GrowthTree";
import { MascotPanel } from "@/components/dashboard/MascotPanel";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatRank } from "@/components/hud/RankLabel";

export default function PlayPage() {
  const t = useTranslations("dashboard");
  const player = useGameStore((state) => state.player);
  const completedChapters = useGameStore((state) => state.completedChapters);
  const setDisplayName = useGameStore((state) => state.setDisplayName);
  const dashboardChapters: (DashboardChapter & { unlock: Gate[] })[] = [
    {
      id: "act1-c1-awakening",
      title: t("chapter.c1Title"),
      subtitle: t("chapter.c1Subtitle"),
      zone: "void",
      href: "/play/scene/act1-c1-awakening",
      estimate: t("chapter.c1Estimate"),
      mentor: t("chapter.mira"),
      unlock: [],
    },
    {
      id: "act1-c2-discord-plaza",
      title: t("chapter.c2Title"),
      subtitle: t("chapter.c2Subtitle"),
      zone: "discord_plaza",
      href: "/play/scene/act1-c2-discord-plaza",
      estimate: t("chapter.c2Estimate"),
      mentor: t("chapter.dias"),
      unlock: [{ type: "previous", chapterId: "act1-c1-awakening" }],
    },
  ];

  useEffect(() => {
    setDisplayName(player.displayName);
  }, [player.displayName, setDisplayName]);

  const nextChapter = dashboardChapters.find((chapter) => !completedChapters.has(chapter.id)) ?? dashboardChapters[dashboardChapters.length - 1];

  return (
    <main className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
      <Onboarding />
      <aside className="lg:col-span-2">
        <Sidebar />
      </aside>
      <section className="space-y-6 lg:col-span-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-5xl">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-sx-text">{t("intro")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard icon="EP" label={t("stats.ep")} value={player.ep} />
          <StatCard icon="ST" label={t("stats.streak")} value={player.streakDays} />
          <StatCard icon="RK" label={t("stats.rank")} value={formatRank(player.rank)} />
        </div>
        <ChapterCard
          chapter={nextChapter}
          completed={completedChapters.has(nextChapter.id)}
          completedLabel={t("chapter.completed")}
          continueLabel={t("chapter.continue")}
          lockReason={t("chapter.lockedC1")}
          unlocked={chapterUnlocked(nextChapter.unlock, player, completedChapters)}
        />
        <div className="grid gap-4">
          {dashboardChapters.map((chapter) => (
            <ChapterCard
              chapter={chapter}
              completed={completedChapters.has(chapter.id)}
              completedLabel={t("chapter.completed")}
              continueLabel={t("chapter.continue")}
              key={chapter.id}
              lockReason={t("chapter.lockedC1")}
              unlocked={chapterUnlocked(chapter.unlock, player, completedChapters)}
            />
          ))}
        </div>
        <GrowthTree completedChapterIds={completedChapters} currentChapterId={nextChapter.id} />
      </section>
      <aside className="lg:col-span-4">
        <MascotPanel />
      </aside>
    </main>
  );
}
