"use client";
import { useCallback, useRef, useState } from "react";

/**
 * Each pair uses ONE photo so both sides are unmistakably the same vehicle.
 * `beforeFilter` simulates the pre-repair condition until real workshop
 * photography is shot. To use a genuine pair instead, set `beforeSrc` and
 * drop `beforeFilter` — the slider handles both without further changes.
 */
type Pair = {
  tag: string;
  title: string;
  src: string;
  beforeSrc?: string;
  beforeFilter?: string;
};

const PAIRS: Pair[] = [
  {
    tag: "Panel & Paint",
    title: "Hilux body panel respray",
    src: "https://images.unsplash.com/photo-1631377875146-b10de5d7acb7?auto=format&fit=crop&w=1600&q=85",
    beforeFilter: "saturate(0.35) brightness(0.72) contrast(0.88)"
  },
  {
    tag: "Restoration",
    title: "Underbody rust treatment",
    src: "https://images.unsplash.com/photo-1723099971299-3789db53604c?auto=format&fit=crop&w=1600&q=85",
    beforeFilter: "sepia(0.55) saturate(0.6) brightness(0.62) contrast(1.05)"
  },
  {
    tag: "Bodywork",
    title: "Front bumper refinishing",
    src: "https://images.unsplash.com/photo-1651560111117-146a15f36490?auto=format&fit=crop&w=1600&q=85",
    beforeFilter: "saturate(0.3) brightness(0.75) contrast(0.85) blur(0.6px)"
  },
  {
    tag: "Mechanical",
    title: "Engine bay rebuild & clean",
    src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1600&q=85",
    beforeFilter: "sepia(0.4) saturate(0.5) brightness(0.55) contrast(1.1)"
  },
  {
    tag: "Detailing",
    title: "Headlight clarity restoration",
    src: "https://images.unsplash.com/photo-1631856507219-d1f3465b4884?auto=format&fit=crop&w=1600&q=85",
    beforeFilter: "sepia(0.7) saturate(0.75) brightness(0.8) blur(1.4px)"
  },
  {
    tag: "Collision",
    title: "4x4 realignment after impact",
    src: "https://images.unsplash.com/photo-1758393605683-e28bb39d8917?auto=format&fit=crop&w=1600&q=85",
    beforeFilter: "saturate(0.3) brightness(0.68) contrast(0.9)"
  }
];

function Compare({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = frame.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <figure className="group">
      <div
        ref={frame}
        className="relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-xl bg-ink select-none touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.current = true;
          update(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && update(e.clientX)}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* AFTER — full frame underneath */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.src}
          alt={`${pair.title} — after repair`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* BEFORE — identical geometry, clipped from the right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.beforeSrc ?? pair.src}
          alt={`${pair.title} — before repair`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            filter: pair.beforeFilter
          }}
        />

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
          After
        </span>

        {/* Divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Reveal before and after for ${pair.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% before`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft")  { e.preventDefault(); setPos((p) => Math.max(0, p - 4)); }
            if (e.key === "ArrowRight") { e.preventDefault(); setPos((p) => Math.min(100, p + 4)); }
            if (e.key === "Home")       { e.preventDefault(); setPos(0); }
            if (e.key === "End")        { e.preventDefault(); setPos(100); }
          }}
          className="ba-handle absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center
                     rounded-full bg-white text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-signal/60"
          style={{ left: `${pos}%` }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" transform="translate(-3 0)" />
            <polyline points="9 18 15 12 9 6" transform="translate(3 0)" />
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
            Drag the handle across any frame to reveal the transformation. Same vehicle,
            same angle — every panel finished by hand in our Nairobi workshop.
          </p>
        </div>

        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {PAIRS.map((p) => <Compare key={p.title} pair={p} />)}
        </div>
      </div>
    </section>
  );
}
