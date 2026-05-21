"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { useGameStore } from "@/store";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
  variant?: "default" | "compact";
};

export function LocaleSwitcher({ className, variant = "default" }: LocaleSwitcherProps) {
  const t = useTranslations("locale");
  const locale = useGameStore((state) => state.locale);
  const setLocale = useGameStore((state) => state.setLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onDocClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const current = localeMeta[locale];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        className={cn(
          "flex items-center gap-2 rounded-sx border border-[var(--stroke-brand)] bg-sx-bg/70 px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-sx-text transition hover:border-sx-green",
          variant === "compact" && "px-2 py-1.5",
        )}
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="rounded border border-sx-green/40 bg-sx-green/10 px-1.5 py-0.5 text-[10px] text-sx-green">
          {current.flag}
        </span>
        <span>{current.native}</span>
        <span className="text-sx-dim">▾</span>
      </button>
      {open ? (
        <ul
          aria-label={t("switch")}
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-sx border border-[var(--stroke-brand)] bg-[var(--bg-overlay)] shadow-glow-green"
          role="listbox"
        >
          {locales.map((code: Locale) => {
            const meta = localeMeta[code];
            const active = locale === code;

            return (
              <li key={code}>
                <button
                  aria-selected={active}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left font-mono text-xs uppercase tracking-[0.16em] text-sx-text transition hover:bg-sx-green/10",
                    active && "bg-sx-green/15 text-sx-green",
                  )}
                  role="option"
                  type="button"
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="rounded border border-sx-green/30 bg-sx-green/10 px-1.5 py-0.5 text-[10px] text-sx-green">
                      {meta.flag}
                    </span>
                    {meta.native}
                  </span>
                  {active ? <span className="text-sx-green">✓</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
