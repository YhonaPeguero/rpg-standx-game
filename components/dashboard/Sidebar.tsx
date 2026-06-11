"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

type NavItem = {
  href: string;
  key: "hq" | "quests" | "squads" | "ranks" | "codex" | "profile";
  icon: IconName;
};

const navItems: readonly NavItem[] = [
  { href: "/play", key: "hq", icon: "hq" },
  { href: "/play/quests", key: "quests", icon: "quests" },
  { href: "/play/squads", key: "squads", icon: "squads" },
  { href: "/play/codex", key: "codex", icon: "codex" },
  { href: "/play/ranks", key: "ranks", icon: "ranks" },
  { href: "/play/profile", key: "profile", icon: "profile" },
] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="hidden rounded-sx-lg border border-[var(--stroke-brand)] bg-[var(--bg-overlay)] p-3 lg:block">
      <Link
        className="group flex items-center gap-2.5 rounded-sx px-3 py-2 transition hover:bg-sx-green/5"
        href="/"
        title={t("home")}
      >
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-sx-green">StandX</span>
        <span className="shrink-0 whitespace-nowrap rounded border border-sx-green/50 bg-sx-green/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-sx-green">
          Community
        </span>
        <Icon className="ml-auto shrink-0 text-sx-dim transition group-hover:text-sx-green" name="home" size={14} />
      </Link>

      <div className="mt-4 grid gap-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              className={cn(
                "group relative flex items-center gap-3 rounded-sx border border-transparent px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-sx-text transition hover:border-sx-green/40 hover:bg-sx-green/5",
                active && "border-sx-green/60 bg-sx-green/10 text-sx-green shadow-[inset_0_0_18px_rgba(0,232,50,0.12)]",
              )}
              href={item.href}
              key={item.key}
            >
              {active ? <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sx-green shadow-glow-green" /> : null}
              <Icon className={cn("transition", active ? "text-sx-green" : "text-sx-dim group-hover:text-sx-green")} name={item.icon} size={18} />
              {t(item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

const bottomItems: { href: string; key: NavItem["key"]; icon: IconName }[] = [
  { href: "/play", key: "hq", icon: "hq" },
  { href: "/play/quests", key: "quests", icon: "quests" },
  { href: "/play/squads", key: "squads", icon: "squads" },
  { href: "/play/ranks", key: "ranks", icon: "ranks" },
  { href: "/play/codex", key: "codex", icon: "codex" },
  { href: "/play/profile", key: "profile", icon: "profile" },
];

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-6 gap-1 rounded-sx-lg border border-[var(--stroke-brand)] bg-[var(--bg-overlay)] p-2 backdrop-blur lg:hidden">
      {bottomItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            className={cn(
              "flex flex-col items-center gap-1 rounded-sx px-1 py-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] transition",
              active ? "bg-sx-green/15 text-sx-green shadow-[inset_0_0_14px_rgba(0,232,50,0.14)]" : "text-sx-dim",
            )}
            href={item.href}
            key={item.key}
          >
            <Icon name={item.icon} size={20} />
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
