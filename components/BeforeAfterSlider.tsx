"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export type Pair = { id: string; tag: string; title: string; before: string; after: string };

const HOLD_MS = 2800;

// One grade on every frame, so photographs from different shoots read as one
// set. Applied identically to both sides — the comparison stays honest.
const GRADE = "contrast(1.07) saturate(0.9) brightness(0.97)";

function Compare({
  pair, index, total, size
}: { pair: Pair; index: number; total: number; size: "hero" | "wide" | "card" }) {
  // 0 = fully BEFORE, 100 = fully AFTER. Starts on BEFORE.
  const [reveal, setReveal] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [manual, setManual] = useState(false);
  const [inView, setInView] = useState(false);

  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const hovering = useRef(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: ReturnType<typeof setInterval>;
    const begin = setTimeout(() => {
      interval = setInterval(() => {
        if (hovering.current) return;
        setReveal((r) => (r > 50 ? 0 : 100));
      }, HOLD_MS);
    }, index * 450); // stagger so the set doesn't sweep in lockstep

    return () => { clearTimeout(begin); clearInterval(interval); };
  }, [inView, manual, index]);

  const setFromPointer = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setReveal(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const showingAfter = reveal > 50;
  const hero = size === "hero";
  const aspect = size === "card" ? "aspect-[3/2]" : "aspect-[16/9]";
  const ease = "cubic-bezier(0.65,0,0.35,1)";

  return (
    <figure
      ref={frame}
      className={`group relative w-full ${aspect} cursor-ew-resize select-none overflow-hidden rounded-2xl bg-ink-soft ring-1 ring-white/10 touch-none`}
      onMouseEnter={() => {
        hovering.current = true;
        if (!dragging.current) { setAnimated(true); setReveal(100); }
      }}
      onMouseLeave={() => {
        hovering.current = false;
        if (!dragging.current && !manual) { setAnimated(true); setReveal(0); }
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        setManual(true);
        setAnimated(false);
        setFromPointer(e.clientX);
      }}
      onPointerMove={(e) => { if (dragging.current) setFromPointer(e.clientX); }}
      onPointerUp={(e) => {
        dragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => { dragging.current = false; }}
    >
      {/* AFTER, full frame underneath */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pair.after}
        alt={`${pair.title}, after repair at AutoPro Garage`}
        draggable={false}
        loading={hero ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
        style={{ filter: GRADE }}
      />

      {/* BEFORE, identical geometry, clipped away from the right */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pair.before}
        alt={`${pair.title}, damage before repair`}
        draggable={false}
        loading={hero ? "eager" : "lazy"}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
        style={{
          filter: GRADE,
          clipPath: `inset(0 ${reveal}% 0 0)`,
          transition: animated
            ? `clip-path 1.1s ${ease}, transform 1200ms ease-out`
            : "transform 1200ms ease-out"
        }}
      />

      {/* edge vignette: lets the frame settle into the dark section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(12,13,14,0.55) 100%)" }}
      />

      {/* caption scrim, bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "linear-gradient(to top, rgba(12,13,14,0.92) 0%, rgba(12,13,14,0.45) 45%, transparent 100%)" }}
      />

      {/* labels: always full strength; the sweep line already shows state */}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/15 backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg">
        After
      </span>

      {/* sweep line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_14px_rgba(255,255,255,0.55)]"
        style={{
          left: `${reveal}%`,
          transform: "translateX(-50%)",
          opacity: reveal === 0 || reveal === 100 ? 0 : 1,
          transition: animated ? `left 1.1s ${ease}, opacity .35s ease` : "opacity .35s ease"
        }}
      />

      {/* handle, which doubles as the keyboard control */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Reveal the repair: ${pair.title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(reveal)}
        aria-valuetext={showingAfter ? "Showing after repair" : "Showing before repair"}
        onFocus={() => setManual(true)}
        onKeyDown={(e) => {
          const step = (d: number) => {
            e.preventDefault(); setManual(true); setAnimated(false);
            setReveal((r) => Math.min(100, Math.max(0, r + d)));
          };
          if (e.key === "ArrowLeft")  step(-5);
          if (e.key === "ArrowRight") step(5);
          if (e.key === "Home") { e.preventDefault(); setManual(true); setAnimated(true); setReveal(0); }
          if (e.key === "End")  { e.preventDefault(); setManual(true); setAnimated(true); setReveal(100); }
        }}
        className={`ba-handle absolute top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-signal/60 ${
          hero ? "h-14 w-14" : "h-11 w-11"
        }`}
        style={{ left: `${reveal}%`, transition: animated ? `left 1.1s ${ease}` : "none" }}
      >
        <svg width={hero ? 22 : 18} height={hero ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 6 3 12 9 18" />
          <polyline points="15 6 21 12 15 18" />
        </svg>
      </div>

      {/* caption, set on the photograph */}
      <figcaption className={`pointer-events-none absolute inset-x-0 bottom-0 ${hero ? "p-6 sm:p-9" : "p-5 sm:p-6"}`}>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-signal">{pair.tag}</p>
            <p className={`mt-1.5 font-semibold leading-tight text-white ${
              hero ? "text-2xl sm:text-4xl tracking-tight" : "text-lg sm:text-xl"
            }`}>
              {pair.title}
            </p>
          </div>
          <span className="shrink-0 font-mono text-xs tabular-nums text-white/50">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

export default function BeforeAfterSlider({ pairs }: { pairs: Pair[] }) {
  if (pairs.length === 0) return null;
  const [first, ...rest] = pairs;
  const total = pairs.length;

  return (
    <div className="space-y-6">
      <Compare pair={first} index={0} total={total} size="hero" />

      {rest.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {rest.map((p, i) => {
            // a lone last item spans the row instead of leaving a gap beside it
            const orphan = rest.length % 2 === 1 && i === rest.length - 1;
            return (
              <div key={p.id} className={orphan ? "lg:col-span-2" : ""}>
                <Compare pair={p} index={i + 1} total={total} size={orphan ? "wide" : "card"} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
