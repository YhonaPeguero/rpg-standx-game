"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMessages, useTranslations } from "next-intl";
import type { Chapter } from "@/types";
import { getChapters } from "@/lib/content/loader";
import { localizeChapter } from "@/lib/content/localize";
import { chapterUnlocked } from "@/lib/game/gates";
import { useGameStore } from "@/store";
import { ChapterCard, type DashboardChapter } from "@/components/dashboard/ChapterCard";
import { ChapterRoadmap, type RoadmapItem } from "@/components/dashboard/ChapterRoadmap";
import { GrowthTree } from "@/components/dashboard/GrowthTree";
import { MascotPanel } from "@/components/dashboard/MascotPanel";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RankProgress } from "@/components/hud/RankProgress";
import { formatRank } from "@/components/hud/RankLabel";
import { buttonClassName } from "@/components/ui/Button";

const mentorByZone: Record<Chapter["zone"], string> = {
  void: "Mira",
  discord_plaza: "Dave",
  event_arena: "Gabo",
  content_district: "冷酷锦鲤.StandX",
  moderator_gate: "Artifex",
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
  const tNav = useTranslations("nav");
  const messages = useMessages();
  const player = useGameStore((state) => state.player);
  const completedChapters = useGameStore((state) => state.completedChapters);
  const setDisplayName = useGameStore((state) => state.setDisplayName);
  const dashboardChapters = getChapters().map((chapter) => toDashboardChapter(localizeChapter(chapter, messages)));

  useEffect(() => {
    setDisplayName(player.displayName);
  }, [player.displayName, setDisplayName]);

  const nextChapter =
    dashboardChapters.find((chapter) => !completedChapters.has(chapter.id)) ??
    dashboardChapters[dashboardChapters.length - 1];
  const nextUnlocked = chapterUnlocked(nextChapter.unlock, player, completedChapters);
  const completedCount = dashboardChapters.filter((chapter) => completedChapters.has(chapter.id)).length;

  const roadmapItems: RoadmapItem[] = dashboardChapters.map((chapter) => {
    const completed = completedChapters.has(chapter.id);
    return {
      ...chapter,
      completed,
      unlocked: chapterUnlocked(chapter.unlock, player, completedChapters),
      current: !completed && chapter.id === nextChapter.id,
    };
  });

  return (
    <main className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-2">
        <Sidebar />
      </aside>
      <section className="space-y-6 lg:col-span-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-4xl">
            {t("title")}
          </h1>
        </div>

        <section
          aria-label={t("nextStep")}
          className="rounded-sx-lg border-2 border-sx-green/60 bg-sx-green/[0.04] p-5 shadow-glow-green md:p-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-sx-gold">{t("nextStep")}</p>
          <ChapterCard
            chapter={nextChapter}
            completed={completedChapters.has(nextChapter.id)}
            completedLabel={t("chapter.completed")}
            continueLabel={t("chapter.continue")}
            key={nextChapter.id}
            lockReason={t("chapter.lockedC1")}
            unlocked={nextUnlocked}
          />
        </section>

        <section
          aria-label={t("stats.chapters")}
          className="rounded-sx-lg border border-[var(--stroke-brand)] bg-sx-bg/40 p-5"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-sx-dim">{t("stats.chapters")}</p>
            <p className="font-mono text-sm text-sx-green">
              {completedCount}/{dashboardChapters.length}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-sx-green transition-all"
              style={{ width: `${Math.round((completedCount / dashboardChapters.length) * 100)}%` }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-sx-dim">
            <span className="text-sx-text">{player.ep}</span> {t("stats.ep")} · <span className="text-sx-text">{formatRank(player.rank)}</span>
          </p>
        </section>

        <RankProgress ep={player.ep} />

        <section aria-label={t("allChapters")} className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-sx-gold">{t("allChapters")}</p>
          <ChapterRoadmap
            items={roadmapItems}
            labels={{
              step: t("roadmap.step"),
              start: t("roadmap.start"),
              continueLabel: t("chapter.continue"),
              replay: t("chapter.completed"),
              done: t("roadmap.done"),
              current: t("roadmap.current"),
              locked: t("roadmap.locked"),
            }}
          />
        </section>

        <details className="rounded-sx-lg border border-[var(--stroke-brand)] bg-sx-bg/40">
          <summary className="cursor-pointer list-none px-5 py-4 font-mono text-xs uppercase tracking-[0.28em] text-sx-text transition hover:text-sx-green">
            <span className="mr-2 text-sx-green">▸</span>
            {t("growthMap")}
          </summary>
          <div className="px-5 pb-5">
            <GrowthTree completedChapterIds={completedChapters} currentChapterId={nextChapter.id} />
          </div>
        </details>

        <div className="flex flex-wrap gap-3">
          <Link className={buttonClassName("secondary")} href="/play/quests">
            {tNav("quests")} →
          </Link>
          <Link className={buttonClassName("secondary")} href="/play/ranks">
            {tNav("ranks")} →
          </Link>
        </div>
      </section>
      <aside className="lg:col-span-4">
        <MascotPanel />
      </aside>
    </main>
  );
}
