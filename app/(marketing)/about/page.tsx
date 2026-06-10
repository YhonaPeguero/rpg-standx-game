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
        <Link className="flex items-center gap-2.5" href="/">
          <span className="grid h-8 w-8 place-items-center rounded-sx border border-sx-green/40 bg-sx-green/10 text-sx-green shadow-[0_0_14px_rgba(0,232,50,0.3)]">
            <Icon name="delta" size={18} />
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.28em] text-sx-green">StandX</span>
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
