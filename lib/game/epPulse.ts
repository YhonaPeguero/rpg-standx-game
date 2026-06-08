type Listener = (amount: number) => void;

const listeners = new Set<Listener>();

export function emitEpGain(amount: number): void {
  if (amount <= 0) return;
  listeners.forEach((listener) => listener(amount));
}

export function onEpGain(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
