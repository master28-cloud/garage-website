"use client";
import { useState } from "react";

export type Mix = { service: string; count: number };

const label = (s: string) =>
  s.replace(/_/g, " ").toLowerCase().replace(/^./, (c) => c.toUpperCase());

/**
 * Ranked magnitude, directly labelled, so one hue is correct —
 * eight different hues here would be decoration, not information.
 */
export default function ServiceMix({ mix }: { mix: Mix[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const total = mix.reduce((n, m) => n + m.count, 0);
  const max = Math.max(1, ...mix.map((m) => m.count));

  if (total === 0) {
    return (
      <section className="rounded-2xl border border-black/5 bg-white p-6">
        <h3 className="font-bold text-ink">Service mix</h3>
        <p className="mt-6 text-center text-sm text-steel">
          No bookings yet — this fills in as work comes through.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-bold text-ink">Service mix</h3>
          <p className="mt-0.5 text-xs text-steel">What the workshop is being booked for</p>
        </div>
        <p className="text-xs text-steel">
          <span className="font-semibold text-ink">{total}</span> bookings
        </p>
      </div>

      <ul className="mt-6 space-y-3.5">
        {mix.map((m) => {
          const pct = Math.round((m.count / total) * 100);
          return (
            <li
              key={m.service}
              onMouseEnter={() => setHover(m.service)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-ink">{label(m.service)}</span>
                <span className="shrink-0 tabular-nums text-steel">
                  <span className="font-semibold text-ink">{m.count}</span>
                  <span className="ml-1.5 text-xs">{pct}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper-warm">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(3, (m.count / max) * 100)}%`,
                    background: "#0C0D0E",
                    opacity: hover === null || hover === m.service ? 1 : 0.35
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
