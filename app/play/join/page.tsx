"use client";

import { useTranslations } from "next-intl";
import { SOCIAL_LINKS } from "@/lib/socials";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

// Discord gets the hero treatment: it's where the real Growth Path happens.
const ACCENTS: Record<string, string> = {
  discord: "#5865f2",
  website: "#00e832",
  x: "#e8f4ff",
};

export default function JoinPage() {
  const t = useTranslations("join");
  const [discord, ...rest] = SOCIAL_LINKS;

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h1 className="mt-4 break-words font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.16em] text-sx-green md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-sx-text">{t("intro")}</p>
      </div>

      <Card className="relative overflow-hidden p-6 md:p-8" style={{ borderColor: `${ACCENTS.discord}66` }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(80% 120% at 12% 0%, ${ACCENTS.discord}1f, transparent 60%)` }}
        />
        <div className="relative flex flex-wrap items-center gap-5">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2"
            style={{ borderColor: ACCENTS.discord, color: ACCENTS.discord, boxShadow: `0 0 22px ${ACCENTS.discord}55` }}
          >
            <Icon name="discord" size={32} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold uppercase tracking-[0.14em] text-sx-text">
              {t("discord.title")}
            </h2>
            <p className="mt-2 max-w-xl font-semibold leading-7 text-sx-text">{t("discord.desc")}</p>
          </div>
          <a className={buttonClassName("primary", "shrink-0")} href={discord.href} rel="noreferrer" target="_blank">
            {t("open")} →
          </a>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {rest.map((link) => (
          <Card className="flex flex-col p-5" key={link.id}>
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2"
                style={{ borderColor: ACCENTS[link.id], color: ACCENTS[link.id] }}
              >
                <Icon name={link.icon} size={20} />
              </span>
              <h2 className="font-display text-lg font-bold uppercase tracking-[0.12em] text-sx-text">
                {t(`${link.id}.title` as "website.title")}
              </h2>
            </div>
            <p className="mt-4 flex-1 text-sm font-semibold leading-6 text-sx-text">
              {t(`${link.id}.desc` as "website.desc")}
            </p>
            <a
              className={buttonClassName("secondary", "mt-5 min-h-0 self-start px-4 py-2 text-[10px]")}
              href={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {t("open")} →
            </a>
          </Card>
        ))}
      </div>
    </main>
  );
}
