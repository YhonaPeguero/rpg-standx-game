"use client";

import { useTranslations } from "next-intl";
import { useGameStore } from "@/store";
import { cn } from "@/lib/utils";

/** Compact mute toggle for the per-zone music + sound effects. */
export function AudioToggle({ className }: { className?: string }) {
  const t = useTranslations("hud");
  const audioEnabled = useGameStore((state) => state.audioEnabled);
  const toggleAudio = useGameStore((state) => state.toggleAudio);

  return (
    <button
      aria-label={audioEnabled ? t("muteAudio") : t("unmuteAudio")}
      aria-pressed={audioEnabled}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-sx border border-[var(--stroke-soft)] text-base transition hover:border-sx-green hover:text-sx-green",
        audioEnabled ? "text-sx-green" : "text-sx-dim",
        className,
      )}
      onClick={toggleAudio}
      title={audioEnabled ? t("muteAudio") : t("unmuteAudio")}
      type="button"
    >
      <span aria-hidden="true" className={cn("leading-none", !audioEnabled && "line-through decoration-2")}>
        ♪
      </span>
    </button>
  );
}
