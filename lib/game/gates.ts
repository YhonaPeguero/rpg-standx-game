import type { Gate, Player } from "@/types";
import { rankOrder } from "./ep";

export function gatePassed(gate: Gate, player: Player, completed: Set<string>): boolean {
  switch (gate.type) {
    case "previous":
      return completed.has(gate.chapterId);
    case "ep":
      return player.ep >= gate.value;
    case "rank":
      return rankOrder(player.rank) >= rankOrder(gate.value);
    case "squad":
      return player.squad === gate.value;
  }
}

export function chapterUnlocked(unlock: Gate[], player: Player, completed: Set<string>) {
  return unlock.every((gate) => gatePassed(gate, player, completed));
}
