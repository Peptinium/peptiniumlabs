import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RuoBanner } from "./RuoBanner";
import { RuoModal } from "./RuoModal";
import { ScrollProgress } from "./premium/ScrollProgress";
import { GrainOverlay } from "./premium/GrainOverlay";

export function SiteLayout({ children, showRuoModal = true }: { children: ReactNode; showRuoModal?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollProgress />
      <GrainOverlay />
      <RuoBanner />
      <Header />
      <main className="grid-bg flex-1 overflow-x-clip">{children}</main>
      <Footer />
      {showRuoModal && <RuoModal />}
    </div>
  );
}


