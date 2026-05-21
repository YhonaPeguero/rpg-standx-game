import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <Card className="w-full max-w-xl p-8 text-center md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.45em] text-sx-gold">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.16em] text-sx-green md:text-4xl">
          Off the Growth Path
        </h1>
        <p className="mt-4 text-lg font-semibold text-sx-text">That route doesn&apos;t exist on the map.</p>
        <Link className={buttonClassName("primary", "mt-7")} href="/play">
          Back to HQ
        </Link>
      </Card>
    </main>
  );
}
