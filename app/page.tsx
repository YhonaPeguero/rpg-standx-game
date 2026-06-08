"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { CharacterAvatar } from "@/components/mascot/CharacterAvatar";
import { MascotCanvas } from "@/components/mascot/MascotCanvas";
import { Starfield } from "@/components/scene/Starfield";

const features: { key: "story" | "quests" | "ranks" | "i18n"; icon: IconName }[] = [
  { key: "story", icon: "codex" },
  { key: "quests", icon: "quests" },
  { key: "ranks", icon: "ranks" },
  { key: "i18n", icon: "globe" },
];

const cast = [
  { id: "mira", name: "MIRA", color: "#00aaff" },
  { id: "arttifex", name: "ARTIFEX", color: "#ff9900" },
  { id: "gaboo", name: "GABO", color: "#ff3366" },
  { id: "dave", name: "DAVE", color: "#00e8c8" },
  { id: "jinli", name: "冷酷锦鲤", color: "#9945ff" },
  { id: "doula", name: "哆啦币梦", color: "#ffb000" },
];

export default function Home() {
  const t = useTranslations("marketing");

  return (
    <main className="sx-scanlines relative min-h-dvh overflow-hidden px-6 py-10 md:py-14">
      <Starfield className="pointer-events-none absolute inset-0 -z-10" density={130} />
      <div aria-hidden className="sx-vignette" />
      <div aria-hidden className="sx-grain-overlay" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
        <span className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-sx border border-sx-green/40 bg-sx-green/10 text-sx-green shadow-[0_0_14px_rgba(0,232,50,0.3)]">
            <Icon name="seed" size={18} />
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.28em] text-sx-green">StandX</span>
        </span>
        <LocaleSwitcher />
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <section>
          <p className="font-mono text-xs uppercase tracking-[0.45em] text-sx-gold">{t("badge")}</p>
          <h1 className="mt-5 font-display text-5xl font-black uppercase leading-[0.95] tracking-[0.12em] text-sx-green drop-shadow-[0_0_30px_rgba(0,232,50,0.45)] md:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-sx-text md:text-xl">{t("subtitle")}</p>
          <p className="mt-3 max-w-xl font-mono text-xs uppercase tracking-[0.22em] text-sx-dim md:text-sm">{t("tagline")}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className={buttonClassName("primary")} href="/play">
              <Icon name="play" size={16} />
              {t("cta")}
            </Link>
            <Link className={buttonClassName("secondary")} href="/about">
              {t("about")}
            </Link>
          </div>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-sx-dim">Act I cast</p>
            <ul className="mt-3 flex flex-wrap gap-2.5">
              {cast.map((member) => (
                <li className="flex items-center" key={member.id}>
                  <CharacterAvatar className="h-10 w-10" color={member.color} glyphSize={20} id={member.id} name={member.name} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative">
          <Card className="relative grid place-items-center overflow-hidden p-8 md:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ backgroundImage: "radial-gradient(circle at 50% 40%, rgba(0,232,50,0.16), transparent 60%)" }}
            />
            <MascotCanvas className="relative h-56 w-56 drop-shadow-[0_0_28px_rgba(0,232,50,0.5)] md:h-64 md:w-64" />
            <p className="relative mt-4 font-display text-lg font-bold uppercase tracking-[0.2em] text-sx-green">STANDER</p>
            <p className="relative mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-sx-dim">New Stander · online</p>
          </Card>
        </section>
      </div>

      <ul className="relative z-10 mx-auto mt-12 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ key, icon }) => (
          <li
            className="group flex items-start gap-3 rounded-sx-lg border border-[var(--stroke-brand)] bg-sx-bg/40 p-4 transition hover:border-sx-green/50 hover:bg-sx-green/5"
            key={key}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sx border border-sx-green/30 bg-sx-green/10 text-sx-green transition group-hover:shadow-glow-green">
              <Icon name={icon} size={20} />
            </span>
            <p className="text-sm font-semibold leading-6 text-sx-text">{t(`features.${key}`)}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
