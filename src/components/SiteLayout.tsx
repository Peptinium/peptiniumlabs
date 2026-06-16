import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RuoBanner } from "./RuoBanner";
import { RuoModal } from "./RuoModal";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <RuoBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <RuoModal />
    </div>
  );
}
