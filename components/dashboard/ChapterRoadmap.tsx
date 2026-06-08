import Link from "next/link";
import type { ZoneId } from "@/types";
import { buttonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { DashboardChapter } from "./ChapterCard";

const zoneAccent: Record<ZoneId, string> = {
  void: "#00e832",
  discord_plaza: "#00aaff",
  event_arena: "#ff3366",
  content_district: "#9945ff",
  moderator_gate: "#ff9900",
  seed_hall: "#ffe600",
};

export type RoadmapItem = DashboardChapter & {
  unlocked: boolean;
  completed: boolean;
  current: boolean;
};

type RoadmapLabels = {
  step: string;
  start: string;
  continueLabel: string;
  replay: string;
  done: string;
  current: string;
  locked: string;
};

type ChapterRoadmapProps = {
  items: RoadmapItem[];
  labels: RoadmapLabels;
};

export function ChapterRoadmap({ items, labels }: ChapterRoadmapProps) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => {
        const accent = zoneAccent[item.zone];
        const statusLabel = item.completed ? labels.done : item.current ? labels.current : null;

        return (
          <li className="flex gap-4" key={item.id}>
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 font-mono text-sm font-bold transition"
                style={{
                  borderColor: item.unlocked ? accent : "var(--stroke-soft)",
                  color: item.unlocked ? accent : "var(--text-dim)",
                  background: item.current ? `${accent}1f` : "transparent",
                  boxShadow: item.current ? `0 0 18px ${accent}55` : "none",
                }}
              >
                {item.completed ? "✓" : index + 1}
              </span>
              {index < items.length - 1 ? <span className="mt-1 w-px flex-1 bg-[var(--stroke-brand)]" /> : null}
            </div>

            <div
              className={cn(
                "mb-2 flex-1 rounded-sx-lg border bg-sx-bg/40 p-4 transition",
                item.current ? "border-sx-green/50 shadow-glow-green" : "border-[var(--stroke-brand)]",
                !item.unlocked && "opacity-55",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em]" style={{ color: item.unlocked ? accent : "var(--text-dim)" }}>
                    {labels.step} {index + 1} · {item.zone.replace(/_/g, " ")}
                  </p>
                  <h3 className="mt-1 truncate font-display text-lg font-bold uppercase tracking-[0.1em] text-sx-text">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-sx-dim">{item.subtitle}</p>
                </div>
                {statusLabel ? (
                  <span
                    className="shrink-0 rounded-sx border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em]"
                    style={{
                      borderColor: item.completed ? accent : "var(--gold)",
                      color: item.completed ? accent : "var(--gold)",
                    }}
                  >
                    {statusLabel}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-sx-dim">
                  {item.estimate} · {item.mentor}
                </p>
                {item.unlocked ? (
                  <Link
                    className={buttonClassName(item.completed ? "secondary" : "primary", "min-h-0 shrink-0 px-4 py-2 text-[10px]")}
                    href={item.href}
                  >
                    {item.completed ? labels.replay : item.current ? labels.continueLabel : labels.start}
                  </Link>
                ) : (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-sx-dim">{labels.locked}</span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
