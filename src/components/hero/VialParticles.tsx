/**
 * Micro-particules qui remontent lentement à l'intérieur du flacon.
 * Positionnement absolu — à placer dans un parent relative qui contient l'image du flacon.
 */
export function VialParticles() {
  const particles = Array.from({ length: 9 }, (_, i) => ({
    left: 30 + ((i * 7) % 40) + (i % 3) * 3, // % à l'intérieur de la zone flacon
    delay: (i * 0.7) % 5,
    dur: 4 + (i % 3) * 1.2,
    size: 3 + (i % 3),
  }));
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[55%] w-[38%] -translate-x-1/2 -translate-y-[30%] overflow-hidden"
      style={{
        maskImage: "linear-gradient(to top, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, oklch(0.85 0.15 200 / 0.95) 0%, oklch(0.62 0.20 260 / 0.6) 60%, transparent 100%)",
            filter: "blur(0.5px)",
            animation: `particle-rise ${p.dur}s ease-in ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
