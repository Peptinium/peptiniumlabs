import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RuoBanner } from "./RuoBanner";
import { RuoModal } from "./RuoModal";

export function SiteLayout({ children, showRuoModal = true }: { children: ReactNode; showRuoModal?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [enterKey, setEnterKey] = useState(pathname);
  useEffect(() => {
    setEnterKey(pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <RuoBanner />
      <Header />
      <main key={enterKey} className="page-enter flex-1 overflow-x-clip">{children}</main>
      <Footer />
      {showRuoModal && <RuoModal />}
    </div>
  );
}



