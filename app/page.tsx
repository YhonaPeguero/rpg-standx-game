import Link from "next/link";
import messages from "@/messages/en.json";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  const copy = messages.marketing;

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <Card className="max-w-3xl p-8 text-center md:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.45em] text-sx-gold">{copy.badge}</p>
        <h1 className="mt-5 font-display text-4xl font-black uppercase tracking-[0.18em] text-sx-green drop-shadow-[0_0_24px_rgba(0,232,50,0.45)] md:text-6xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold text-sx-text md:text-xl">
          {copy.subtitle}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className={buttonClassName()} href="/play">
            {copy.cta}
          </Link>
          <Link className={buttonClassName("secondary")} href="/about">
            {copy.about}
          </Link>
        </div>
      </Card>
    </main>
  );
}
