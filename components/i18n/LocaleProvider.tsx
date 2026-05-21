"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import enUS from "@/messages/en-US.json";
import esES from "@/messages/es-ES.json";
import ptBR from "@/messages/pt-BR.json";
import enGB from "@/messages/en-GB.json";
import koKR from "@/messages/ko-KR.json";
import { fallbackLocale, type Locale } from "@/lib/i18n/config";
import { useGameStore } from "@/store";

type Messages = Record<string, unknown>;

const bundles: Record<Locale, Messages> = {
  "en-US": enUS as Messages,
  "es-ES": esES as Messages,
  "pt-BR": ptBR as Messages,
  "en-GB": enGB as Messages,
  "ko-KR": koKR as Messages,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeFallback(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = out[key];

    if (isPlainObject(baseValue) && isPlainObject(value)) {
      out[key] = mergeFallback(baseValue, value);
    } else {
      out[key] = value;
    }
  }

  return out;
}

function resolveMessages(locale: Locale): Messages {
  const requested = bundles[locale] ?? {};
  const base = bundles[fallbackLocale];
  return locale === fallbackLocale ? base : mergeFallback(base, requested);
}

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const locale = useGameStore((state) => state.locale);
  const [hydrated, setHydrated] = useState(false);
  const effectiveLocale = hydrated ? locale : fallbackLocale;
  const messages = useMemo(() => resolveMessages(effectiveLocale), [effectiveLocale]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = effectiveLocale;
    }
  }, [effectiveLocale]);

  return (
    <NextIntlClientProvider locale={effectiveLocale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}
