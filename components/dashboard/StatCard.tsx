import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="group p-4 transition hover:border-sx-green">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-3xl leading-none text-sx-text">{value}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-sx-dim">{label}</p>
        </div>
        <span className="font-display text-lg text-sx-green opacity-70 transition group-hover:opacity-100">{icon}</span>
      </div>
    </Card>
  );
}
