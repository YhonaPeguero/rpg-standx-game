import { TopBar } from "@/components/hud/TopBar";
import { BottomNav } from "@/components/dashboard/Sidebar";

export default function PlayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh px-4 pb-28 pt-4 md:px-8 md:pb-8 md:pt-6">
      <TopBar />
      {children}
      <BottomNav />
    </div>
  );
}
