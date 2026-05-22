import { TopBar } from "@/components/hud/TopBar";
import { AudioBoot } from "@/components/hud/AudioBoot";
import { BottomNav } from "@/components/dashboard/Sidebar";
import { EvolutionCelebration } from "@/components/mascot/EvolutionCelebration";

export default function PlayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh px-4 pb-28 pt-4 md:px-8 md:pb-8 md:pt-6">
      <AudioBoot />
      <TopBar />
      <EvolutionCelebration />
      {children}
      <BottomNav />
    </div>
  );
}
