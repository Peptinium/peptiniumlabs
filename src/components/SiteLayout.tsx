import { useEffect, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RuoBanner } from "./RuoBanner";
import { RuoModal } from "./RuoModal";
import { useRevealBlur } from "@/hooks/useScrollBlur";

export function SiteLayout({ children, showRuoModal = true }: { children: ReactNode; showRuoModal?: boolean }) {
  useRevealBlur();
  // Re-scan when route content changes
  useEffect(() => {
    const mo = new MutationObserver(() => {
      window.dispatchEvent(new Event("reveal-blur:rescan"));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
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


