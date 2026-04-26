"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { rankOrder } from "@/lib/game/ep";
import { useGameStore } from "@/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/play", key: "hq" },
  { href: "/play#growth", key: "growth" },
  { href: "/play#squads", key: "squads", seedOnly: true },
  { href: "/play/codex", key: "codex" },
  { href: "/play/leaderboard", key: "leaderboard" },
  { href: "/play/profile", key: "profile" },
  { href: "/about", key: "about" },
] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const rank = useGameStore((state) => state.player.rank);
  const squadsLocked = rankOrder(rank) < rankOrder("seed");

  return (
    <nav className="hidden rounded-sx-lg border border-[var(--stroke-brand)] bg-[var(--bg-overlay)] p-3 lg:block">
      <p className="px-3 py-2 font-display text-sm font-bold uppercase tracking-[0.24em] text-sx-green">StandX</p>
      <div className="mt-4 grid gap-2">
        {navItems.map((item) => {
          const locked = "seedOnly" in item && item.seedOnly && squadsLocked;
          const active = pathname === item.href;

          return locked ? (
            <span
              className="rounded-sx border border-transparent px-3 py-3 font-mono text-xs uppercase tracking-[0.16em] text-sx-dim opacity-60"
              key={item.key}
            >
              {t(item.key)} - {t("locked")}
            </span>
          ) : (
            <Link
              className={cn(
                "rounded-sx border border-transparent px-3 py-3 font-mono text-xs uppercase tracking-[0.16em] text-sx-text transition hover:border-sx-green hover:bg-sx-green/5",
                active && "border-sx-green bg-sx-green/10 text-sx-green",
              )}
              href={item.href}
              key={item.key}
            >
              {t(item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 gap-2 rounded-sx-lg border border-[var(--stroke-brand)] bg-[var(--bg-overlay)] p-2 backdrop-blur lg:hidden">
      {["hq", "growth", "codex", "profile"].map((key) => (
        <Link className="rounded-sx px-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-sx-text" href="/play" key={key}>
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
