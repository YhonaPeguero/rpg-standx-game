export const locales = ["en-US", "es-ES", "pt-BR", "en-GB", "ko-KR"] as const;
export const defaultLocale = "en-US" as const;
export const fallbackLocale = "en-US" as const;

export type Locale = (typeof locales)[number];

export const localeMeta: Record<Locale, { label: string; native: string; flag: string; storyComplete: boolean }> = {
  "en-US": { label: "English (US)", native: "English", flag: "US", storyComplete: true },
  "es-ES": { label: "Spanish",       native: "Espanol", flag: "ES", storyComplete: true },
  "pt-BR": { label: "Portuguese (BR)", native: "Portugues", flag: "BR", storyComplete: true },
  "en-GB": { label: "English (UK)",  native: "English UK", flag: "GB", storyComplete: true },
  "ko-KR": { label: "Korean",        native: "Hangugeo",  flag: "KR", storyComplete: false },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }

  if (value) {
    const stripped = value.split("-")[0]?.toLowerCase();
    if (stripped === "es") return "es-ES";
    if (stripped === "pt") return "pt-BR";
    if (stripped === "ko") return "ko-KR";
    if (stripped === "en") return "en-US";
  }

  return defaultLocale;
}
