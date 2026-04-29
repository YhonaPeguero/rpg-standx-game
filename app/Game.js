"use client";

import { useEffect } from "react";
import { gameMarkup } from "./gameMarkup";

export default function Game() {
  useEffect(() => {
    let active = true;
    let cleanup = () => {};

    import("../lib/standxRuntime").then(({ initStandXGame }) => {
      if (active) cleanup = initStandXGame();
    });

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  return (
    <main
      className="game-shell"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: gameMarkup }}
    />
  );
}
