"use client";

import { useEffect } from "react";
import { useMessages, useTranslations } from "next-intl";
import type { Chapter } from "@/types";
import { getChapters } from "@/lib/content/loader";
import { localizeChapter } from "@/lib/content/localize";
import { chapterUnlocked } from "@/lib/game/gates";
import { useGameStore } from "@/store";
import { ChapterCard, type DashboardChapter } from "@/components/dashboard/ChapterCard";
import { GrowthTree } from "@/components/dashboard/GrowthTree";
import { MascotPanel } from "@/components/dashboard/MascotPanel";
import { Onboarding } from "@/components/dashboard/Onboarding";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatRank } from "@/components/hud/RankLabel";

const mentorByZone: Record<Chapter["zone"], string> = {
  void: "Mira",
  discord_plaza: "Dias",
  event_arena: "Gaboo",
  content_district: "Victor",
  moderator_gate: "Arttifex",
  seed_hall: "Mira",
};

const estimateById: Record<string, string> = {
  "act1-c1-awakening": "6 min",
  "act1-c2-discord-plaza": "7 min",
  "act1-c3-event-arena": "8 min",
  "act1-c4-content-district": "8 min",
  "act1-c5-moderator-gate": "6 min",
  "act1-c6-seed-hall": "7 min",
};

function toDashboardChapter(chapter: Chapter): DashboardChapter & Pick<Chapter, "unlock"> {
  return {
    id: chapter.id,
    title: chapter.title,
    subtitle: chapter.subtitle ?? "Act I mission",
    zone: chapter.zone,
    href: `/play/scene/${chapter.id}`,
    estimate: estimateById[chapter.id] ?? "7 min",
    mentor: mentorByZone[chapter.zone],
    unlock: chapter.unlock,
  };
}

export default function PlayPage() {
  const t = useTranslations("dashboard");
  const messages = useMessages();
  const player = useGameStore((state) => state.player);
  const completedChapters = useGameStore((state) => state.completedChapters);
  const setDisplayName = useGameStore((state) => state.setDisplayName);
  const dashboardChapters = getChapters().map((chapter) => toDashboardChapter(localizeChapter(chapter, messages)));

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
