"use client";

import { useMessages, useTranslations } from "next-intl";
import type { SquadId } from "@/types";
import { getChapters } from "@/lib/content/loader";
import { localizeChapter } from "@/lib/content/localize";
import { getAchievements } from "@/lib/content/codex";
import { localizeText } from "@/lib/i18n/localizeText";
import { useGameStore } from "@/store";
import { Card } from "@/components/ui/Card";
import { ShareCard } from "@/components/ui/ShareCard";
import { formatRank } from "@/components/hud/RankLabel";

const squadOrder: SquadId[] = ["creative", "content_research", "tech_support", "outreach", "offline"];

const squadLabel: Record<SquadId, string> = {
  creative: "Creative",
  content_research: "Content/Research",
  tech_support: "Tech Support",
  outreach: "Outreach",
  offline: "Offline",
};

function MasteryStars({ stars }: { stars: number }) {
  return (
    <span aria-label={`${stars} of 3 stars`} className="font-mono text-sm tracking-wider text-sx-gold">
      {"★".repeat(stars)}
      <span className="text-sx-dim opacity-40">{"★".repeat(3 - stars)}</span>
    </span>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tHud = useTranslations("hud");
  const messages = useMessages();
  const player = useGameStore((state) => state.player);
  const locale = useGameStore((state) => state.locale);
  const audioEnabled = useGameStore((state) => state.audioEnabled);
  const reduceMotion = useGameStore((state) => state.reduceMotion);
  const volume = useGameStore((state) => state.volume);
  const toggleAudio = useGameStore((state) => state.toggleAudio);
  const toggleReduceMotion = useGameStore((state) => state.toggleReduceMotion);
  const setVolume = useGameStore((state) => state.setVolume);
  const achievementList = getAchievements().filter((achievement) => player.achievements.includes(achievement.id));

  const masteryScenes = getChapters().flatMap((rawChapter) => {
    const chapter = localizeChapter(rawChapter, messages);
    return chapter.scenes
      .map((scene, index) => ({
        chapterTitle: chapter.title,
        sceneId: scene.id,
        sceneNumber: index + 1,
        stars: player.mastery[scene.id] ?? 0,
      }))
      .filter((entry) => entry.stars > 0);
  });

  return (
    <main className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <Card className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <h1 className="mt-4 break-words font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">{player.displayName}</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
              <p className="font-mono text-2xl text-sx-green">{player.ep}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">EP</p>
            </div>
            <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
              <p className="font-mono text-2xl text-sx-gold">{formatRank(player.rank)}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">{t("rank")}</p>
            </div>
            <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
              <p className="font-mono text-2xl text-sx-text">{player.streakDays}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">{tHud("streak")}</p>
            </div>
            <div className="rounded-sx border border-[var(--stroke-soft)] p-4">
              <p className="font-mono text-2xl text-sx-text">{player.squad ? squadLabel[player.squad] : t("none")}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-sx-dim">{t("squad")}</p>
            </div>
          </div>
          <p className="mt-5 border-t border-[var(--stroke-soft)] pt-4 font-mono text-[10px] leading-relaxed text-sx-dim">
            {t("epDisclaimer")}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("settings")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              aria-pressed={audioEnabled}
              className="flex items-center justify-between rounded-sx border border-[var(--stroke-soft)] px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green"
              type="button"
              onClick={toggleAudio}
            >
              <span>{t("audio")}</span>
              <span className="text-sx-green">{audioEnabled ? tHud("audioOn") : tHud("audioOff")}</span>
            </button>
            <button
              aria-pressed={reduceMotion}
              className="flex items-center justify-between rounded-sx border border-[var(--stroke-soft)] px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green"
              type="button"
              onClick={toggleReduceMotion}
            >
              <span>{t("motion")}</span>
              <span className="text-sx-green">{reduceMotion ? tHud("motionOff") : tHud("motionOn")}</span>
            </button>
          </div>
          <label className="mt-3 flex items-center gap-4 rounded-sx border border-[var(--stroke-soft)] px-4 py-3">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-sx-text">{t("volume")}</span>
            <input
              aria-label={t("volume")}
              className="flex-1 accent-sx-green"
              disabled={!audioEnabled}
              max={1}
              min={0}
              onChange={(event) => setVolume(Number(event.target.value))}
              step={0.05}
              type="range"
              value={volume}
            />
            <span className="w-10 text-right font-mono text-xs text-sx-green">{Math.round(volume * 100)}</span>
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("mastery")}</h2>
          {masteryScenes.length === 0 ? (
            <p className="mt-4 font-semibold text-sx-text">{t("masteryEmpty")}</p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {masteryScenes.map((entry) => (
                <li
                  className="flex items-center justify-between rounded-sx border border-[var(--stroke-soft)] px-4 py-3"
                  key={entry.sceneId}
                >
                  <span className="font-semibold text-sx-text">
                    {entry.chapterTitle} <span className="text-sx-dim">· {entry.sceneNumber}</span>
                  </span>
                  <MasteryStars stars={entry.stars} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("squadXP")}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {squadOrder.map((squad) => (
              <li
                className="flex items-center justify-between rounded-sx border border-[var(--stroke-soft)] px-4 py-3"
                key={squad}
              >
                <span className="font-semibold text-sx-text">{squadLabel[squad]}</span>
                <span className="font-mono text-sx-green">{player.squadXP[squad]}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-green">{t("achievements")}</h2>
          <div className="mt-4 grid gap-3">
            {achievementList.length === 0 ? <p className="font-semibold text-sx-text">{t("empty")}</p> : null}
            {achievementList.map((achievement) => (
              <div className="rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 p-4" key={achievement.id}>
                <p className="font-display text-base font-bold text-sx-green">
                  {localizeText(achievement.title, locale)}
                </p>
                <p className="mt-2 font-semibold text-sx-text">{localizeText(achievement.description, locale)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ShareCard run={{ displayName: player.displayName, ep: player.ep, rank: formatRank(player.rank), squad: player.squad ? squadLabel[player.squad] : t("none") }} />
    </main>
  );
}
