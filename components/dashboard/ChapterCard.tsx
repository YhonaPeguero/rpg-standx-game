import Link from "next/link";
import type { ZoneId } from "@/types";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CharacterAvatar } from "@/components/mascot/CharacterAvatar";

export type DashboardChapter = {
  id: string;
  title: string;
  subtitle: string;
  zone: ZoneId;
  href: string;
  estimate: string;
  mentor: string;
  mentorId: string;
  mentorColor: string;
};

type ChapterCardProps = {
  chapter: DashboardChapter;
  unlocked: boolean;
  completed: boolean;
  lockReason: string;
  continueLabel: string;
  completedLabel: string;
};

export function ChapterCard({ chapter, unlocked, completed, lockReason, continueLabel, completedLabel }: ChapterCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-sx-gold">{chapter.zone}</p>
          <h3 className="mt-2 font-display text-xl font-bold uppercase tracking-[0.12em] text-sx-green">{chapter.title}</h3>
          <p className="mt-2 font-semibold text-sx-text">{chapter.subtitle}</p>
        </div>
        <CharacterAvatar className="h-14 w-14 shrink-0" color={chapter.mentorColor} glyphSize={26} id={chapter.mentorId} name={chapter.mentor} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-sx-dim">{chapter.estimate}</p>
        {unlocked ? (
          <Link className={buttonClassName(completed ? "secondary" : "primary")} href={chapter.href}>
            {completed ? completedLabel : continueLabel}
          </Link>
        ) : (
          <span className="rounded-sx border border-[var(--stroke-soft)] px-4 py-3 font-mono text-xs uppercase tracking-[0.16em] text-sx-dim">
            {lockReason}
          </span>
        )}
      </div>
    </Card>
  );
}
