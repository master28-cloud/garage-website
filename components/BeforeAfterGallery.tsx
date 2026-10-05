"use client";
import { useRef, useState } from "react";

type Pair = { title: string; before: string; after: string };

const PAIRS: Pair[] = [
  {
    title: "Dented sedan door → flawlessly restored panel",
    before: "https://images.unsplash.com/photo-1621252179027-9262ff0d583c?auto=format&fit=crop&w=1600&q=80",
    after:  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Rusted Hilux undercarriage → fully refurbished",
    before: "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=1600&q=80",
    after:  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Scratched Mercedes bumper → showroom finish",
    before: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1600&q=80",
    after:  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Burnt-out engine bay → rebuilt and polished",
    before: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1600&q=80",
    after:  "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Faded headlights → crystal-clear restoration",
    before: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1600&q=80",
    after:  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Accident-damaged Subaru → perfectly aligned repair",
    before: "https://images.unsplash.com/photo-1562141961-b5d2b31a1e3b?auto=format&fit=crop&w=1600&q=80",
    after:  "https://images.unsplash.com/photo-1570733117311-d990c3816c47?auto=format&fit=crop&w=1600&q=80"
  }
];

function Slider({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(p);
  };

  return (
    <div className="group">
      <div
        ref={wrap}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-navy select-none touch-none"
        onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
        onMouseMove={(e) => dragging.current && move(e.clientX)}
        onMouseUp={() => (dragging.current = false)}
        onMouseLeave={() => (dragging.current = false)}
        onTouchStart={(e) => move(e.touches[0].clientX)}
        onTouchMove={(e) => move(e.touches[0].clientX)}
      >
        {/* After (base) */}
        <img src={pair.after} alt={`After: ${pair.title}`} className="absolute inset-0 h-full w-full object-cover" />
        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={pair.before} alt={`Before: ${pair.title}`} className="h-full w-full object-cover" style={{ width: `${100 / (pos / 100)}%` }} />
        </div>
        {/* Handle */}
        <div className="absolute inset-y-0" style={{ left: `calc(${pos}% - 1px)` }}>
          <div className="h-full w-0.5 bg-brand-green" />
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-brand-green text-brand-navy grid place-items-center font-bold shadow-glow">⇆</div>
        </div>
        <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">BEFORE</span>
        <span className="absolute top-3 right-3 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-brand-navy">AFTER</span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{pair.title}</p>
    </div>
  );
}

export default function BeforeAfterGallery() {
  return (
    <section id="gallery" className="py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-brand-green font-semibold uppercase tracking-widest text-xs">Our work</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Before & After</h2>
            <p className="mt-3 max-w-xl text-slate-500">Drag the slider on each image to reveal the transformation. Every panel, every polish — by hand.</p>
          </div>
          <a href="#contact" className="btn btn-dark">Book Your Transformation</a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PAIRS.map((p) => <Slider key={p.title} pair={p} />)}
        </div>
      </div>
    </section>
  );
}
