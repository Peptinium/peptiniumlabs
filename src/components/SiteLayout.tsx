import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RuoBanner } from "./RuoBanner";
import { RuoModal } from "./RuoModal";

export function SiteLayout({ children, showRuoModal = true }: { children: ReactNode; showRuoModal?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <RuoBanner />
      <Header />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
      {showRuoModal && <RuoModal />}
    </div>
  );
}

