"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Established",           value: 2011,  suffix: "", raw: true },
  { label: "Team members",          value: 47,    suffix: "" },
  { label: "Vehicles serviced",     value: 18000, suffix: "+" },
  { label: "Service bays",          value: 12,    suffix: "" },
  { label: "Certified technicians", value: 24,    suffix: "" },
  { label: "Customer satisfaction", value: 97,    suffix: "%" }
];

function Counter({ to, suffix, raw }: { to: number; suffix: string; raw?: boolean }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || started.current) return;
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{raw ? n : n.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">By the numbers</p>
          <h2 className="h-section mt-4">Fourteen years of precision at scale.</h2>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="border-t-2 border-ink pt-5">
              <div className="text-[2.75rem] font-bold leading-none tracking-tightest text-ink">
                <Counter to={s.value} suffix={s.suffix} raw={s.raw} />
              </div>
              <div className="mt-2.5 text-sm text-steel">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
