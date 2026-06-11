"use client";

import { useTranslations } from "next-intl";
import { SOCIAL_LINKS } from "@/lib/socials";
import { Icon } from "./Icon";

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-[var(--stroke-soft)] pb-2 pt-5">
      <div className="flex items-center gap-2">
        <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-sx-green">StandX</span>
        <span className="rounded border border-sx-green/50 bg-sx-green/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-sx-green">
          Community
        </span>
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sx-dim">{t("fanMade")}</span>
      </div>
      <ul className="flex items-center gap-2">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.id}>
            <a
              aria-label={link.label}
              className="grid h-9 w-9 place-items-center rounded-sx border border-[var(--stroke-soft)] text-sx-dim transition hover:border-sx-green hover:text-sx-green hover:shadow-glow-green"
              href={link.href}
              rel="noreferrer"
              target="_blank"
              title={link.label}
            >
              <Icon name={link.icon} size={17} />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}
