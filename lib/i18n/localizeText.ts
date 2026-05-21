import type { LocalizedText } from "@/types";
import { fallbackLocale, type Locale } from "./config";

export function localizeText(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) {
    return "";
  }

  return text[locale] ?? text[fallbackLocale] ?? "";
}
