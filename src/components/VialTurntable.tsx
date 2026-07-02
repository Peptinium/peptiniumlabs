import { useCallback, useEffect, useRef, useState } from "react";
import avantAsset from "@/assets/vial/RT_AVANT.png.asset.json";
import gaucheAsset from "@/assets/vial/RT_GAUCHE.png.asset.json";
import arriereAsset from "@/assets/vial/RT_ARRIERE.png.asset.json";
import droiteAsset from "@/assets/vial/RT_DROITE.png.asset.json";

/**
 * Turntable — 4 vues cardinales (0° / 90° / 180° / 270°).
 * Rotation par drag souris/tactile, auto-rotate au repos,
 * cross-fade entre les 2 vues adjacentes pour un rendu continu.
 */

// Ordre horaire vu de dessus : avant → gauche → arrière → droite
const FRAMES = [
  { url: avantAsset.url, angle: 0 },
  { url: gaucheAsset.url, angle: 90 },
  { url: arriereAsset.url, angle: 180 },
  { url: droiteAsset.url, angle: 270 },
];

const AUTO_ROTATE_DEG_PER_SEC = 18; // ≈ 20 s / tour
const RESUME_AFTER_MS = 2200;
const DRAG_SENSITIVITY = 0.5; // deg per pixel

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function VialTurntable({ className = "" }: { className?: string }) {
  const [angle, setAngle] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startAngle: number } | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const interactingRef = useRef(false);

  // Preload
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      FRAMES.map(
        (f) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = f.url;
          }),
      ),
    ).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-rotate loop
  useEffect(() => {
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (!interactingRef.current) {
        setAngle((a) => mod(a + AUTO_ROTATE_DEG_PER_SEC * dt, 360));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, []);

  const startInteract = useCallback(() => {
    interactingRef.current = true;
    setInteracting(true);
    setHintVisible(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  const endInteract = useCallback(() => {
    setInteracting(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      interactingRef.current = false;
    }, RESUME_AFTER_MS);
  }, []);

  // Pointer handlers
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startAngle: angle };
    startInteract();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    setAngle(mod(dragRef.current.startAngle + dx * DRAG_SENSITIVITY, 360));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
    endInteract();
  };

  // Compute the two adjacent frames + cross-fade weight
  const a = mod(angle, 360);
  const step = 360 / FRAMES.length; // 90
  const idx = Math.floor(a / step);
  const nextIdx = (idx + 1) % FRAMES.length;
  const t = (a - idx * step) / step; // 0..1
  const current = FRAMES[idx];
  const next = FRAMES[nextIdx];

  return (
    <div
      ref={containerRef}
      className={`relative select-none touch-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ cursor: interacting ? "grabbing" : "grab" }}
      role="img"
      aria-label="Flacon Peptinium — vue interactive 360°"
    >
      {/* Halo lumineux animé */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--brand-blue) 26%, transparent) 0%, color-mix(in oklab, var(--brand-violet) 14%, transparent) 35%, transparent 70%)",
          filter: "blur(50px)",
          animation: "vial-glow 5s ease-in-out infinite",
        }}
      />

      {/* Reflet doux au sol */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 bottom-4 h-8 rounded-[50%] blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.20 0.03 260 / 0.35) 0%, transparent 70%)",
        }}
      />

      {/* Frames empilés avec cross-fade */}
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[420px]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        )}
        <img
          src={current.url}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-contain transition-none"
          style={{ opacity: loaded ? 1 - t : 0 }}
        />
        <img
          src={next.url}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-contain transition-none"
          style={{ opacity: loaded ? t : 0 }}
        />
      </div>

      {/* Hint */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-1 flex justify-center transition-opacity duration-500 ${
          hintVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 12h13M8 12l4-4M8 12l4 4" />
            <path d="M16 12H3M16 12l-4-4M16 12l-4 4" />
          </svg>
          Faites glisser pour tourner
        </div>
      </div>
    </div>
  );
}
