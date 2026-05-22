"use client";

import { useAudioEngineSync } from "@/lib/audio/useAudioEngineSync";

export function AudioBoot() {
  useAudioEngineSync();
  return null;
}
