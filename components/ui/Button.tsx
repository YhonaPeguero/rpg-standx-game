import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function buttonClassName(variant: "primary" | "secondary" = "primary", className?: string) {
  return cn(
    "inline-flex min-h-12 items-center justify-center rounded-sx px-6 py-3 font-display text-xs font-bold uppercase tracking-[0.22em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sx-green disabled:cursor-not-allowed disabled:opacity-45",
    variant === "primary" &&
      "bg-gradient-to-br from-sx-green to-sx-green-deep text-sx-bg shadow-glow-green hover:brightness-110",
    variant === "secondary" &&
      "border border-[var(--stroke-brand)] bg-white/[0.03] text-sx-green hover:bg-sx-green/10",
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
