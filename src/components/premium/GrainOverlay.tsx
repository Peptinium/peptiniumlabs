export function GrainOverlay() {
  // Ultra-light SVG grain baked into a data URL — the "film" layer.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${svg.replace(/#/g, "%23")}")`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55]"
      style={{
        backgroundImage: url,
        backgroundSize: "240px 240px",
        opacity: 0.045,
        mixBlendMode: "overlay",
      }}
    />
  );
}
