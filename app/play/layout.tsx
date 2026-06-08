import { AudioBoot } from "@/components/hud/AudioBoot";
import { FloatingEP } from "@/components/hud/FloatingEP";
import { PlayChrome } from "@/components/dashboard/PlayChrome";
import { EvolutionCelebration } from "@/components/mascot/EvolutionCelebration";

export default function PlayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AudioBoot />
      <EvolutionCelebration />
      <FloatingEP />
      <PlayChrome>{children}</PlayChrome>
    </>
  );
}
