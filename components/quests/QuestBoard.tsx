"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Quest, QuestKind } from "@/types";
import { getQuests } from "@/lib/content/quests";
import { chapterUnlocked } from "@/lib/game/gates";
import { useGameStore } from "@/store";
import { QuestCard } from "./QuestCard";

// Mirrors the real Discord cadence: weekly games/highlights + community events.
const TABS: QuestKind[] = ["weekly", "community"];

const TAB_UNLOCK_AT_COMPLETED: Record<QuestKind, number> = {
  daily: 0,
  weekly: 0,
  community: 3,
};

const MANUAL_TRIGGER_QUESTS = new Set(["weekly_game", "community_shoutout"]);

export function QuestBoard() {
  const t = useTranslations("quests");
  const [tab, setTab] = useState<QuestKind>("weekly");

  const player = useGameStore((state) => state.player);
  const completed = useGameStore((state) => state.completedChapters);
  const addEP = useGameStore((state) => state.addEP);
  const addCodex = useGameStore((state) => state.addCodex);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);
  const questState = useGameStore((state) => state.questState);
  const claimQuest = useGameStore((state) => state.claimQuest);
  const incrementQuest = useGameStore((state) => state.incrementQuest);

  const tabUnlocked = (kind: QuestKind) => completed.size >= TAB_UNLOCK_AT_COMPLETED[kind];

  const allQuests = useMemo(() => getQuests(), []);
  const quests = useMemo<Quest[]>(() => {
    if (!tabUnlocked(tab)) return [];
    return allQuests.filter((quest) => quest.kind === tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuests, tab, completed.size]);

  function applyClaim(quest: Quest) {
    if (questState.claimed.includes(quest.id)) return;
    if (quest.reward.ep) addEP(quest.reward.ep);
    quest.reward.codex?.forEach(addCodex);
    if (quest.reward.achievement) unlockAchievement(quest.reward.achievement);
    claimQuest(quest.id);
  }

  return (
    <section aria-label={t("title")} className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-[0.14em] text-sx-green md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 max-w-2xl font-semibold leading-7 text-sx-text">{t("intro")}</p>
          <p className="mt-3 inline-block rounded-sx border border-[var(--stroke-brand)] bg-sx-bg/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-sx-dim">
            {t("optionalLabel")}
          </p>
        </div>
      </header>

      <div role="tablist" className="flex flex-wrap gap-2">
        {TABS.map((kind) => {
          const active = kind === tab;
          const unlocked = tabUnlocked(kind);
          return (
            <button
              aria-selected={active}
              className={`rounded-sx border px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] transition ${
                active
                  ? "border-sx-green bg-sx-green/15 text-sx-green shadow-glow-green"
                  : unlocked
                    ? "border-[var(--stroke-soft)] text-sx-text hover:border-sx-green/60"
                    : "border-[var(--stroke-soft)] text-sx-dim opacity-60 hover:border-sx-gold/60"
              }`}
              key={kind}
              role="tab"
              type="button"
              onClick={() => setTab(kind)}
            >
              {t(`tabs.${kind}`)}
              {unlocked ? null : <span className="ml-2 text-sx-gold">·</span>}
            </button>
          );
        })}
      </div>

      {!tabUnlocked(tab) ? (
        <div className="rounded-sx-lg border border-dashed border-sx-gold/40 bg-sx-gold/5 p-6 text-center">
          <p className="font-semibold text-sx-text">
            {t("tabLockedAt", { count: TAB_UNLOCK_AT_COMPLETED[tab] })}
          </p>
        </div>
      ) : quests.length === 0 ? (
        <div className="rounded-sx-lg border border-dashed border-[var(--stroke-brand)] p-6 text-center">
          <p className="font-semibold text-sx-text">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quests.map((quest) => {
            const unlocked = quest.unlock ? chapterUnlocked(quest.unlock, player, completed) : true;
            const progress = questState.progress[quest.id] ?? 0;
            const claimed = questState.claimed.includes(quest.id);

            return (
              <QuestCard
                claimed={claimed}
                key={quest.id}
                manualTrigger={MANUAL_TRIGGER_QUESTS.has(quest.id)}
                onClaim={() => applyClaim(quest)}
                onIncrement={() => incrementQuest(quest.id)}
                progress={progress}
                quest={quest}
                unlocked={unlocked}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
