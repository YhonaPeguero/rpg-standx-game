type Listener = () => void;

const listeners = new Set<Listener>();

/** Re-open the new-user guide from anywhere (e.g. a help button). */
export function openGuide(): void {
  listeners.forEach((listener) => listener());
}

export function onOpenGuide(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
