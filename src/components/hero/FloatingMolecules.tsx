/**
 * Molécules flottantes en SVG : petits nœuds reliés par des lignes fines,
 * dérivent lentement en arrière-plan. Aucun impact perf, 100% déco.
 */
export function FloatingMolecules({ className = "" }: { className?: string }) {
  const nodes = [
    { cx: 12, cy: 22, r: 2.4, delay: 0, dur: 14, alt: false },
    { cx: 88, cy: 18, r: 3, delay: 2, dur: 18, alt: true },
    { cx: 22, cy: 78, r: 2, delay: 4, dur: 16, alt: false },
    { cx: 82, cy: 72, r: 2.6, delay: 1, dur: 20, alt: true },
    { cx: 50, cy: 12, r: 1.8, delay: 3, dur: 15, alt: false },
    { cx: 45, cy: 88, r: 2.2, delay: 5, dur: 17, alt: true },
    { cx: 68, cy: 40, r: 1.6, delay: 2.5, dur: 13, alt: false },
    { cx: 28, cy: 48, r: 1.6, delay: 6, dur: 19, alt: true },
  ];
  const links: [number, number][] = [
    [0, 4], [4, 1], [1, 6], [6, 3], [3, 5], [5, 2], [2, 7], [7, 0], [6, 7],
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="mol-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.15 200)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.50 0.26 296)" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id="mol-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.72 0.15 200)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="oklch(0.50 0.26 296)" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <g stroke="url(#mol-stroke)" strokeWidth="0.15" opacity="0.55">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <g
          key={i}
          style={{
            transformOrigin: `${n.cx}px ${n.cy}px`,
            animation: `${n.alt ? "molecule-drift-alt" : "molecule-drift"} ${n.dur}s ease-in-out ${n.delay}s infinite`,
          }}
        >
          <circle cx={n.cx} cy={n.cy} r={n.r} fill="url(#mol-node)" />
          <circle cx={n.cx} cy={n.cy} r={n.r * 2.2} fill="url(#mol-node)" opacity="0.18" />
        </g>
      ))}
    </svg>
  );
}
