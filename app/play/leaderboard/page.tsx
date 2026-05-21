"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

export default function LeaderboardPage() {
  const t = useTranslations("stubs.leaderboard");

  return (
    <main className="mx-auto max-w-3xl">
      <Card className="p-8">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">{t("title")}</h1>
      </Card>
    </main>
  );
}
