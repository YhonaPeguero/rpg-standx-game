import type { IconName } from "@/components/ui/Icon";

export type SocialLink = {
  id: "discord" | "website" | "x";
  href: string;
  icon: IconName;
  label: string;
};

// Official StandX channels — Discord first: it's where the Growth Path lives.
export const SOCIAL_LINKS: SocialLink[] = [
  { id: "discord", href: "https://discord.com/invite/standx", icon: "discord", label: "Discord" },
  { id: "website", href: "https://standx.com/", icon: "globe", label: "standx.com" },
  { id: "x", href: "https://x.com/StandX_Official", icon: "xSocial", label: "X (Twitter)" },
];
