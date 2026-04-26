import { Card } from "@/components/ui/Card";
import messages from "@/messages/en.json";

export default function LeaderboardPage() {
  const copy = messages.stubs.leaderboard;

  return (
    <main className="mx-auto max-w-3xl">
      <Card className="p-8">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-sx-gold">{copy.badge}</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[0.16em] text-sx-green">{copy.title}</h1>
      </Card>
    </main>
  );
}
