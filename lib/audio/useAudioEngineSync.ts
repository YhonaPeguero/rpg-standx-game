"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store";
import { audioEngine } from "./engine";

export function useAudioEngineSync(): void {
  const audioEnabled = useGameStore((state) => state.audioEnabled);
  const volume = useGameStore((state) => state.volume);

  useEffect(() => {
    const bootstrap = () => {
      audioEngine.init();
      void audioEngine.resume();
      window.removeEventListener("pointerdown", bootstrap);
      window.removeEventListener("keydown", bootstrap);
    };
    window.addEventListener("pointerdown", bootstrap, { once: false });
    window.addEventListener("keydown", bootstrap, { once: false });

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        void audioEngine.suspend();
      } else if (audioEnabled) {
        void audioEngine.resume();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pointerdown", bootstrap);
      window.removeEventListener("keydown", bootstrap);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [audioEnabled]);

  useEffect(() => {
    audioEngine.setEnabled(audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);
}
