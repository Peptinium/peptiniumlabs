import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, ExternalLink, Smartphone, Monitor } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/site-web")({
  component: SiteWebPage,
});

function SiteWebPage() {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Aperçu du site</h2>
          <p className="text-[11px] text-muted-foreground">aetherion-lab.com</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("mobile")}
            className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
              viewMode === "mobile" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="size-4" />
          </button>
          <button
            onClick={() => setViewMode("desktop")}
            className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
              viewMode === "desktop" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="size-4" />
          </button>
          <a
            href="https://aetherion-lab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-1 items-center justify-center bg-background p-2">
        <div
          className={`overflow-hidden rounded-xl border border-border shadow-lg transition-all ${
            viewMode === "mobile" ? "h-full w-full max-w-[390px]" : "h-full w-full"
          }`}
        >
          <iframe
            src="https://aetherion-lab.com"
            className="h-full w-full"
            style={{ border: "none" }}
            title="Aperçu Aetherion Labs"
          />
        </div>
      </div>
    </div>
  );
}
