"use client";

import type { ReactNode } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

type ModalProps = {
  title: string;
  closeLabel: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, closeLabel, open, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] p-4">
      <Card className="w-full max-w-lg p-6" role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.16em] text-sx-green">{title}</h2>
          <Button type="button" variant="secondary" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
        <div className="mt-5 text-sx-text">{children}</div>
      </Card>
    </div>
  );
}
