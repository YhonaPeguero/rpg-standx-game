import messages from "@/messages/en.json";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  const copy = messages.about;

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl items-center px-6 py-12">
      <Card className="p-8 md:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{copy.badge}</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">
          {copy.title}
        </h1>
        <p className="mt-5 text-lg font-semibold leading-8 text-sx-text">{copy.body}</p>
      </Card>
    </main>
  );
}
