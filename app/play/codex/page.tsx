"use client";

import { useTranslations } from "next-intl";
import { getCodexEntries } from "@/lib/content/codex";
import { localizeText } from "@/lib/i18n/localizeText";
import { useGameStore } from "@/store";
import { Card } from "@/components/ui/Card";

export default function CodexPage() {
  const t = useTranslations("codex");
  const locale = useGameStore((state) => state.locale);
  const unlocks = useGameStore((state) => state.player.codexUnlocks);
  const entries = getCodexEntries().filter((entry) => unlocks.includes(entry.id));

  return (
    <main className="mx-auto max-w-4xl space-y-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 break-words font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">{t("title")}</h1>
      </div>
      {entries.length === 0 ? (
        <Card className="p-6">
          <p className="font-semibold text-sx-text">{t("empty")}</p>
        </Card>
      ) : (
        entries.map((entry) => (
          <Card className="p-6" key={entry.id}>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-sx-gold">{entry.category}</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-[0.12em] text-sx-green">
              {localizeText(entry.title, locale)}
            </h2>
            <p className="mt-3 text-lg font-semibold leading-8 text-sx-text">{localizeText(entry.body, locale)}</p>
          </Card>
        ))
      )}
    </main>
  );
}
