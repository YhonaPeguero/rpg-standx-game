"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { Starfield } from "@/components/scene/Starfield";

export default function Home() {
  const t = useTranslations("marketing");
  const featureKeys = ["story", "quests", "ranks", "i18n"] as const;

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-6 py-12">
      <Starfield className="pointer-events-none absolute inset-0 -z-10" density={120} />
      <div className="absolute right-6 top-6 z-10">
        <LocaleSwitcher />
      </div>
      <Card className="relative w-full max-w-3xl p-8 text-center md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.45em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-5 font-display text-4xl font-black uppercase tracking-[0.18em] text-sx-green drop-shadow-[0_0_24px_rgba(0,232,50,0.45)] md:text-6xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold text-sx-text md:text-xl">{t("subtitle")}</p>
        <p className="mx-auto mt-3 max-w-2xl font-mono text-xs uppercase tracking-[0.22em] text-sx-dim md:text-sm">
          {t("tagline")}
        </p>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
          {featureKeys.map((key) => (
            <li
              className="rounded-sx border border-[var(--stroke-brand)] bg-sx-green/5 px-4 py-3 text-sm font-semibold text-sx-text"
              key={key}
            >
              <span className="mr-2 text-sx-green">›</span>
              {t(`features.${key}`)}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className={buttonClassName()} href="/play">
            {t("cta")}
          </Link>
          <Link className={buttonClassName("secondary")} href="/about">
            {t("about")}
          </Link>
        </div>
      </Card>
    </main>
  );
}
