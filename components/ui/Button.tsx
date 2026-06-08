import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function buttonClassName(variant: "primary" | "secondary" = "primary", className?: string) {
  return cn(
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-sx px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] transition-all duration-200 ease-[var(--ease-confident)] will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sx-green disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0",
    variant === "primary" &&
      "bg-gradient-to-br from-sx-green to-sx-green-deep text-sx-bg shadow-[0_0_28px_rgba(0,232,50,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_6px_34px_rgba(0,232,50,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0",
    variant === "secondary" &&
      "border border-[var(--stroke-brand)] bg-white/[0.03] text-sx-green hover:-translate-y-0.5 hover:border-sx-green/60 hover:bg-sx-green/10 hover:shadow-[0_0_20px_rgba(0,232,50,0.18)] active:translate-y-0",
    className,
  );
}

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} {...props}>
      {children}
    </button>
  );
}
