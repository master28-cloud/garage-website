"use client";
import { useState } from "react";

export type Day = { date: string; count: number; isToday: boolean; isPast: boolean };

/**
 * Single series, so no legend — the heading names it.
 * Past days are muted, today is the full brand hue, upcoming sits between.
 * Lightness carries past/today/upcoming; the axis labels carry it too, so the
 * distinction is never colour alone.
 */
export default function WorkloadChart({ days }: { days: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.count));
  const busiest = Math.max(...days.map((d) => d.count));

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-bold text-ink">Workshop load</h3>
          <p className="mt-0.5 text-xs text-steel">Vehicles scheduled per day, next two weeks</p>
        </div>
        <p className="text-xs text-steel">
          Busiest day <span className="font-semibold text-ink">{busiest}</span>
        </p>
      </div>

      <div className="relative mt-7">
        {/* recessive baseline */}
        <div className="absolute inset-x-0 bottom-7 h-px bg-black/8" aria-hidden="true" />

        <ul className="relative flex h-40 items-end gap-[3px]">
          {days.map((d, i) => {
            const date = new Date(d.date);
            const pct = (d.count / max) * 100;
            const label = date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });

            return (
              <li
                key={d.date}
                className="group relative flex h-full flex-1 flex-col justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {/* generous hit target above the mark */}
                <span className="absolute inset-x-0 bottom-7 top-0" aria-hidden="true" />

                <div className="relative flex h-[calc(100%-1.75rem)] items-end">
                  <div
                    className="w-full rounded-t transition-all duration-200"
                    style={{
                      height: `${Math.max(d.count === 0 ? 2 : 6, pct)}%`,
                      background: d.count === 0
                        ? "#E3DED6"
                        : d.isToday ? "#FF5A1F"
                        : d.isPast ? "#FFC4A8"
                        : "#FF8454",
                      opacity: hover === null || hover === i ? 1 : 0.45
                    }}
                  />
                </div>

                <span
                  className={`mt-2 h-7 truncate text-center text-[10px] leading-tight ${
                    d.isToday ? "font-bold text-ink" : "text-steel-light"
                  }`}
                >
                  {d.isToday ? "Today" : label}
                </span>

                {hover === i && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-2 text-xs text-white shadow-lg"
                  >
                    <span className="font-semibold">{d.count}</span>{" "}
                    {d.count === 1 ? "vehicle" : "vehicles"}
                    <span className="block text-white/55">
                      {date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* table view — identity never rests on colour alone */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-steel hover:text-ink">
          View as table
        </summary>
        <table className="mt-3 w-full text-xs">
          <caption className="sr-only">Vehicles scheduled per day</caption>
          <thead>
            <tr className="text-left text-steel">
              <th scope="col" className="py-1 font-medium">Date</th>
              <th scope="col" className="py-1 font-medium">Vehicles</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date} className="border-t border-black/5">
                <td className="py-1 text-ink">
                  {new Date(d.date).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
                  {d.isToday && <span className="ml-1.5 font-semibold text-signal">today</span>}
                </td>
                <td className="py-1 text-ink">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
