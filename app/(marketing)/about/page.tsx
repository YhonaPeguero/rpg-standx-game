"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { Starfield } from "@/components/scene/Starfield";

export default function AboutPage() {
  const t = useTranslations("about");
  const tMarketing = useTranslations("marketing");
  const tNav = useTranslations("nav");

  return (
    <main className="sx-scanlines relative min-h-dvh overflow-hidden px-6 py-10 md:py-14">
      <Starfield className="pointer-events-none absolute inset-0 -z-10" density={110} />
      <div aria-hidden className="sx-vignette" />
      <div aria-hidden className="sx-grain-overlay" />

      <header className="relative z-30 mx-auto flex max-w-3xl items-center justify-between">
        <Link className="flex min-w-0 items-center gap-2" href="/">
          <span className="font-display text-sm font-bold uppercase tracking-[0.22em] text-sx-green">StandX</span>
          <span className="shrink-0 whitespace-nowrap rounded border border-sx-green/50 bg-sx-green/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sx-green">
            Community
          </span>
        </Link>
        <LocaleSwitcher />
      </header>

      <div className="relative z-10 mx-auto flex min-h-[60dvh] max-w-3xl items-center">
        <Card className="w-full p-8 md:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
          <h1 className="mt-4 break-words font-display text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-sx-green md:text-4xl">{t("title")}</h1>
          <p className="mt-5 text-lg font-semibold leading-8 text-sx-text">{t("body")}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className={buttonClassName("primary")} href="/play">
              <Icon name="play" size={16} />
              {tMarketing("cta")}
            </Link>
            <Link className={buttonClassName("secondary")} href="/">
              <Icon name="arrowLeft" size={16} />
              {tNav("home")}
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
