"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-3xl items-center px-6 py-12">
      <div className="absolute right-6 top-6">
        <LocaleSwitcher />
      </div>
      <Card className="p-8 md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">{t("title")}</h1>
        <p className="mt-5 text-lg font-semibold leading-8 text-sx-text">{t("body")}</p>
      </Card>
    </main>
  );
}
