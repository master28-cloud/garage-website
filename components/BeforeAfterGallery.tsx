"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
 * REPLACING THESE WITH YOUR OWN PHOTOS
 *
 * These stock pairs are PLACEHOLDERS: the before and after frames are
 * different vehicles, because no stock library sells the same car
 * photographed damaged and then repaired.
 *
 * Your workshop already shoots the real thing — the intake photos taken for
 * the insurance assessor, and the delivery photos taken at handover.
 * Drop them into  public/images/gallery/  and change the two strings below:
 *
 *   before: "/images/gallery/01-before.jpg",
 *   after:  "/images/gallery/01-after.jpg",
 *
 * Shoot both frames from the same spot, same height, same lens so the sweep
 * lands cleanly. Nothing else needs to change.
 * ------------------------------------------------------------------------- */

type Pair = { tag: string; title: string; before: string; after: string };

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

const PAIRS: Pair[] = [
  {
    tag: "Collision",
    title: "Front-end impact rebuild",
    before: u("photo-1597328290883-50c5787b7c7e"),
    after:  u("photo-1604212940385-34f8750b3755")
  },
  {
    tag: "Panel & Paint",
    title: "Side panel restoration",
    before: u("photo-1673187139612-6bf684a74815"),
    after:  u("photo-1636074641063-1c2152f1b31e")
  },
  {
    tag: "Structural",
    title: "Chassis realignment",
    before: u("photo-1745845979138-be64a85272a5"),
    after:  u("photo-1698263735476-0d6eeff6c678")
  },
  {
    tag: "Bodywork",
    title: "Rear quarter repair",
    before: u("photo-1687867451910-28941a460f35"),
    after:  u("photo-1555125117-60b045d8604c")
  },
  {
    tag: "Recovery",
    title: "Written-off to roadworthy",
    before: u("photo-1673187139211-1e7ec3dd60ec"),
    after:  u("photo-1653983476757-54dc3c9a4a7c")
  },
  {
    tag: "4x4",
    title: "Off-road damage overhaul",
    before: u("photo-1683446748468-eba61cda9473"),
    after:  u("photo-1609772168547-d216c44c3f85")
  }
];

const HOLD_MS = 2600;

function Compare({ pair, index }: { pair: Pair; index: number }) {
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
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-cycle: hold on before, sweep to after, hold, sweep back.
  useEffect(() => {
    if (!inView || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Stagger each card so the grid doesn't sweep in lockstep.
    const startDelay = index * 420;
    let interval: ReturnType<typeof setInterval>;

    const begin = setTimeout(() => {
      interval = setInterval(() => {
        if (hovering.current) return;
        setReveal((r) => (r > 50 ? 0 : 100));
      }, HOLD_MS);
    }, startDelay);

    return () => { clearTimeout(begin); clearInterval(interval); };
  }, [inView, manual, index]);

  const setFromPointer = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setReveal(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const showingAfter = reveal > 50;

  return (
    <figure className="group">
      <div
        ref={frame}
        className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-xl bg-ink touch-none"
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
        {/* AFTER sits underneath, full frame */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.after}
          alt={`${pair.title} — after repair at AutoPro Garage`}
          draggable={false}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* BEFORE on top, clipped away from the right as reveal grows */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.before}
          alt={`${pair.title} — accident damage before repair`}
          draggable={false}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            clipPath: `inset(0 ${reveal}% 0 0)`,
            transition: animated ? "clip-path 1s cubic-bezier(0.65,0,0.35,1)" : "none"
          }}
        />

        {/* Labels dim when their side is hidden */}
        <span
          className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white transition-opacity duration-500"
          style={{ opacity: showingAfter ? 0.35 : 1 }}
        >
          Before
        </span>
        <span
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white transition-opacity duration-500"
          style={{ opacity: showingAfter ? 1 : 0.35 }}
        >
          After
        </span>

        {/* Sweep line */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90"
          style={{
            left: `${reveal}%`,
            transform: "translateX(-50%)",
            opacity: reveal === 0 || reveal === 100 ? 0 : 1,
            transition: animated
              ? "left 1s cubic-bezier(0.65,0,0.35,1), opacity .4s ease"
              : "opacity .4s ease"
          }}
        />

        {/* Handle doubles as the keyboard control */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Reveal the repair for ${pair.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(reveal)}
          aria-valuetext={showingAfter ? "Showing after repair" : "Showing before repair"}
          onFocus={() => setManual(true)}
          onKeyDown={(e) => {
            const step = (d: number) => {
              e.preventDefault();
              setManual(true);
              setAnimated(false);
              setReveal((r) => Math.min(100, Math.max(0, r + d)));
            };
            if (e.key === "ArrowLeft")  step(-5);
            if (e.key === "ArrowRight") step(5);
            if (e.key === "Home") { e.preventDefault(); setManual(true); setAnimated(true); setReveal(0); }
            if (e.key === "End")  { e.preventDefault(); setManual(true); setAnimated(true); setReveal(100); }
          }}
          className="ba-handle absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-signal/60"
          style={{
            left: `${reveal}%`,
            transition: animated
              ? "left 1s cubic-bezier(0.65,0,0.35,1)"
              : "none"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="12 18 6 12 12 6" />
            <polyline points="12 18 18 12 12 6" />
          </svg>
        </div>
      </div>

      <figcaption className="mt-4">
        <p className="eyebrow-mute">{pair.tag}</p>
        <p className="mt-1 text-[17px] font-semibold text-ink">{pair.title}</p>
      </figcaption>
    </figure>
  );
}

export default function BeforeAfterGallery() {
  return (
    <section id="gallery" className="section bg-paper">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">Our work</p>
          <h2 className="h-section mt-4">Proof, not promises.</h2>
          <p className="lede mt-5">
            Every frame sweeps from the damage we received to the vehicle we handed back.
            Hover to hold the result, or drag the handle yourself.
          </p>
        </div>

        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PAIRS.map((p, i) => <Compare key={p.title} pair={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
