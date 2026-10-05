"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Established",            value: 2011, suffix: "" },
  { label: "Employees",              value: 47,   suffix: "" },
  { label: "Vehicles Serviced",      value: 18000, suffix: "+" },
  { label: "Service Bays",           value: 12,   suffix: "" },
  { label: "Certified Technicians",  value: 24,   suffix: "" },
  { label: "Customer Satisfaction",  value: 97,   suffix: "%" }
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="bg-brand-navy text-white py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand-green font-semibold uppercase tracking-widest text-xs">By the numbers</p>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">A decade of precision at scale.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <div className="text-4xl font-extrabold text-brand-green">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
