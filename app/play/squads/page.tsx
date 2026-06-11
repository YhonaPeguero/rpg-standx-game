"use client";

import { useTranslations } from "next-intl";
import type { SquadId } from "@/types";
import { SQUADS } from "@/lib/game/squads";
import { getCharacterById } from "@/lib/content/loader";
import { audioEngine } from "@/lib/audio/engine";
import { useGameStore } from "@/store";

const SEED_HALL_ID = "act1-c6-seed-hall";
import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CharacterAvatar } from "@/components/mascot/CharacterAvatar";
import { Mascot } from "@/components/mascot/Mascot";

export default function SquadsPage() {
  const t = useTranslations("squads");
  const player = useGameStore((state) => state.player);
  const completedChapters = useGameStore((state) => state.completedChapters);
  const setSquad = useGameStore((state) => state.setSquad);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);

  // Squad selection opens once the Seed Hall (final Act I chapter) is cleared.
  const unlocked = completedChapters.has(SEED_HALL_ID);

  function choose(id: SquadId) {
    if (!unlocked) return;
    setSquad(id);
    unlockAchievement("squad_selected");
    audioEngine.playChoice();
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 break-words font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-5xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-sx-text">{t("intro")}</p>
      </div>

      {unlocked ? (
        <div className="flex items-center gap-3 rounded-sx-lg border border-sx-green/40 bg-sx-green/5 p-4">
          <Icon className="text-sx-green" name="check" size={20} />
          <p className="font-semibold text-sx-text">{player.squad ? t("haveSquad") : t("readyToChoose")}</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-sx-lg border border-sx-gold/40 bg-sx-gold/5 p-4">
          <Mascot className="h-20 w-20 shrink-0" pose="peek" />
          <div className="flex items-start gap-3">
            <Icon className="mt-0.5 shrink-0 text-sx-gold" name="lock" size={20} />
            <p className="font-semibold leading-7 text-sx-text">{t("lockedBanner")}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {SQUADS.map((squad) => {
          const mentor = squad.mentorId ? getCharacterById(squad.mentorId) : null;
          const isCurrent = player.squad === squad.id;

          return (
            <Card
              className={`flex flex-col p-5 transition ${isCurrent ? "border-sx-green/60 shadow-glow-green" : !unlocked ? "opacity-75" : ""}`}
              key={squad.id}
            >
              <div className="flex items-start gap-4">
                {mentor ? (
                  <CharacterAvatar className="h-12 w-12" color={mentor.color} glyphSize={24} id={mentor.id} name={mentor.name} />
                ) : (
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2"
                    style={{ borderColor: squad.accent, color: squad.accent }}
                  >
                    <Icon name="squads" size={22} />
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold uppercase tracking-[0.12em]" style={{ color: squad.accent }}>
                    {t(`list.${squad.id}.name`)}
                  </h2>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sx-dim">
                    {mentor ? `${t("mentor")}: ${mentor.name}` : t("mentorTbd")}
                  </p>
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm font-semibold leading-6 text-sx-text">{t(`list.${squad.id}.desc`)}</p>

              <p className="mt-3 flex items-start gap-2 rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] px-3 py-2">
                <Icon className="mt-0.5 shrink-0" name="target" size={14} style={{ color: squad.accent }} />
                <span className="font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-sx-dim">
                  <span style={{ color: squad.accent }}>{t("milestoneLabel")}:</span> {t(`list.${squad.id}.milestone`)}
                </span>
              </p>

              <div className="mt-5">
                {!unlocked ? (
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sx-dim">
                    <Icon name="lock" size={14} />
                    {t("unlocksAt")}
                  </span>
                ) : isCurrent ? (
                  <span
                    className="inline-flex items-center gap-2 rounded-sx border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em]"
                    style={{ borderColor: squad.accent, color: squad.accent }}
                  >
                    <Icon name="check" size={14} />
                    {t("selected")}
                  </span>
                ) : (
                  <button className={buttonClassName("secondary", "min-h-0 px-4 py-2 text-[10px]")} onClick={() => choose(squad.id)} type="button">
                    {player.squad ? t("switch") : t("select")}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
