"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import en from "@/messages/en.json";
import ptBR from "@/messages/pt-BR.json";
import { useGameStore } from "@/store";

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const locale = useGameStore((state) => state.locale);
  const messages = locale === "pt-BR" ? ptBR : en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
