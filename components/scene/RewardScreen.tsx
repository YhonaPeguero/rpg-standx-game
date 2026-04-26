"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Reward } from "@/types";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type RewardScreenProps = {
  reward: Reward;
};

export function RewardScreen({ reward }: RewardScreenProps) {
  const t = useTranslations("scene.reward");

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
      <Card className="p-8 text-center md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{t("badge")}</p>
        <h2 className="mt-4 font-display text-4xl font-black uppercase tracking-[0.16em] text-sx-green">{t("title")}</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4">
            <p className="font-mono text-4xl text-sx-green">+{reward.ep ?? 0}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-sx-dim">{t("ep")}</p>
          </div>
          <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4">
            <p className="font-mono text-4xl text-sx-gold">{reward.stars ?? 0}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-sx-dim">{t("stars")}</p>
          </div>
          <div className="rounded-sx border border-[var(--stroke-soft)] bg-white/[0.02] p-4">
            <p className="font-mono text-4xl text-sx-text">{reward.codex?.length ?? 0}</p>
            <p className="text-xs uppercase tracking-[0.22em] text-sx-dim">{t("codex")}</p>
          </div>
        </div>
        <Link className={buttonClassName("primary", "mt-8")} href="/play">
          {t("back")}
        </Link>
      </Card>
    </motion.div>
  );
}
