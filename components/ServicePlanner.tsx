"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { prefillBooking } from "@/lib/booking";

type Item = {
  id: string;
  name: string;
  km: [normal: number, severe: number];
  months: [normal: number, severe: number];
  note?: string;
};

// Typical intervals for petrol saloons, SUVs and pickups. "Severe" is the
// schedule most manufacturers set for stop-start traffic, dust and rough
// roads, which describes most Nairobi driving.
const ITEMS: Item[] = [
  { id: "oil",     name: "Engine oil & filter",       km: [10_000, 5_000],   months: [12, 6],  note: "On mineral oil, change it every 5,000 km regardless." },
  { id: "air",     name: "Air filter",                km: [20_000, 10_000],  months: [24, 12], note: "Dust clogs it twice as fast." },
  { id: "tyres",   name: "Tyre rotation & alignment", km: [10_000, 10_000],  months: [12, 12] },
  { id: "brakes",  name: "Brake pads & discs check",  km: [20_000, 10_000],  months: [12, 6] },
  { id: "cabin",   name: "Cabin (AC) filter",         km: [20_000, 15_000],  months: [12, 12] },
  { id: "fluid",   name: "Brake fluid",               km: [40_000, 30_000],  months: [24, 24] },
  { id: "plugs",   name: "Spark plugs",               km: [40_000, 30_000],  months: [48, 36], note: "Iridium plugs can last 100,000 km." },
  { id: "atf",     name: "Gearbox oil (automatic)",   km: [60_000, 40_000],  months: [48, 36] },
  { id: "coolant", name: "Coolant",                   km: [80_000, 60_000],  months: [48, 48] },
  { id: "belt",    name: "Timing belt",               km: [100_000, 80_000], months: [72, 60], note: "Not needed if your engine has a timing chain." }
];

type Status = "due" | "soon" | "ok";
const ORDER: Record<Status, number> = { due: 0, soon: 1, ok: 2 };

const CHIP: Record<Status, { label: string; cls: string; bar: string }> = {
  due:  { label: "Due now",   cls: "bg-[#FFEDE6] text-[#B23A0E]", bar: "bg-signal" },
  soon: { label: "Coming up", cls: "bg-[#FFF3D6] text-[#875800]", bar: "bg-amber-400" },
  ok:   { label: "Later",     cls: "bg-paper-warm text-steel",    bar: "bg-steel-light/60" }
};

const PRESETS: [string, number][] = [
  ["Nearly new", 9_500],
  ["Fresh import", 62_000],
  ["Daily runner", 74_800],
  ["High mileage", 158_000]
];

const fmt = (n: number) => n.toLocaleString("en-KE");
const period = (m: number) => (m > 12 && m % 12 === 0 ? `${m / 12} years` : `${m} months`);

/** Where each job stands at `km`, assuming every one was done on schedule. */
function plan(km: number, severe: boolean) {
  const pick = severe ? 1 : 0;
  return ITEMS.map((it) => {
    const every = it.km[pick];
    const since = km % every;
    const toGo = every - since;
    const window = Math.max(1_000, every * 0.05);
    const justPassed = km >= every && since <= window;

    const status: Status =
      km < 1_000 ? "ok" :
      justPassed || toGo <= window ? "due" :
      toGo <= Math.max(2_500, every * 0.25) ? "soon" : "ok";

    const text =
      justPassed ? `Was due at ${fmt(km - since)} km` :
      status === "due" ? `Due at ${fmt(km + toGo)} km, in ${fmt(toGo)} km` :
      `Next at ${fmt(km + toGo)} km, in ${fmt(toGo)} km`;

    return {
      ...it,
      every,
      months: it.months[pick],
      status,
      text,
      wear: justPassed ? 1 : since / every,
      next: km + toGo
    };
  }).sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.next - b.next);
}

export default function ServicePlanner() {
  const [km, setKm] = useState(74_800);
  const [severe, setSevere] = useState(true);
  const rows = useMemo(() => plan(km, severe), [km, severe]);
  const due = rows.filter((r) => r.status === "due");
  const soon = rows.filter((r) => r.status === "soon");

  function book() {
    const jobs = (due.length ? due : soon).map((r) => r.name);
    prefillBooking({
      service: "OTHER",
      notes:
        `Service planner, ${fmt(km)} km (${severe ? "Nairobi conditions" : "mostly highway"}): ` +
        `${jobs.length ? jobs.join(", ") : "general service"}.`
    });
  }

  return (
    <section id="planner" className="section bg-paper-warm">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">Service planner</p>
          <h2 className="h-section mt-4">What does your car need next?</h2>
          <p className="lede mt-5">
            Wind the odometer to your reading and see what&apos;s due now, what&apos;s coming up and
            what can wait.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-[2rem] bg-ink p-6 text-white sm:p-9 lg:sticky lg:top-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">Odometer</p>
            <Odometer value={km} />

            <input
              type="range"
              min={0}
              max={300_000}
              step={500}
              value={Math.min(km, 300_000)}
              onChange={(e) => setKm(Number(e.target.value))}
              aria-label="Odometer reading"
              aria-valuetext={`${fmt(km)} kilometres`}
              className="mt-8 h-2 w-full cursor-pointer accent-signal"
            />
            <div className="mt-2 flex justify-between text-xs text-white/40">
              <span>0</span><span>150,000</span><span>300,000 km</span>
            </div>

            <label className="mt-6 flex items-center gap-3 text-sm text-white/65">
              Exact reading
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={999_999}
                value={km}
                onChange={(e) =>
                  setKm(Math.max(0, Math.min(999_999, Math.round(Number(e.target.value) || 0))))
                }
                className="w-32 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 font-mono text-white focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30"
              />
              km
            </label>

            <div className="mt-6 flex flex-wrap gap-2">
              {PRESETS.map(([name, v]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setKm(v)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors ${
                    km === v ? "bg-white text-ink ring-white" : "text-white/75 ring-white/20 hover:text-white hover:ring-white/45"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">How you drive</p>
              <div role="radiogroup" aria-label="Driving conditions" className="mt-3 grid grid-cols-2 gap-1.5 rounded-2xl bg-black/30 p-1.5">
                {[
                  { v: true,  t: "Nairobi conditions", d: "Traffic, dust, murram" },
                  { v: false, t: "Mostly highway",     d: "Long, steady trips" }
                ].map((o) => (
                  <button
                    key={o.t}
                    type="button"
                    role="radio"
                    aria-checked={severe === o.v}
                    onClick={() => setSevere(o.v)}
                    className={`rounded-xl px-4 py-3 text-left transition-colors ${
                      severe === o.v ? "bg-white text-ink" : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{o.t}</span>
                    <span className={`mt-0.5 block text-xs ${severe === o.v ? "text-steel" : "text-white/50"}`}>{o.d}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm text-steel">
              At <strong className="text-ink">{fmt(km)} km</strong>:{" "}
              <strong className="text-ink">{due.length} due now</strong> · {soon.length} coming up ·{" "}
              {rows.length - due.length - soon.length} later
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {rows.map((r) => (
                <motion.li
                  key={r.id}
                  layout
                  transition={{ layout: { type: "spring", stiffness: 420, damping: 38 } }}
                  className="rounded-2xl border border-paper-line bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold leading-snug text-ink">{r.name}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${CHIP[r.status].cls}`}>
                      {CHIP[r.status].label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-steel">
                    Every {fmt(r.every)} km or {period(r.months)}
                  </p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-paper-warm">
                    <motion.div
                      className={`h-full rounded-full ${CHIP[r.status].bar}`}
                      initial={false}
                      animate={{ width: `${Math.round(r.wear * 100)}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-steel">{r.text}</p>
                  {r.note && <p className="mt-1.5 text-xs text-steel">{r.note}</p>}
                </motion.li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-sm leading-relaxed text-white/75">
                {due.length ? (
                  <><strong className="text-white">{due.length} {due.length === 1 ? "job" : "jobs"} due</strong> at {fmt(km)} km. Get them done in one visit.</>
                ) : soon.length ? (
                  <>Nothing due yet, but <strong className="text-white">{soon.length} coming up</strong>.</>
                ) : (
                  "Nothing due right now."
                )}
              </p>
              <button type="button" onClick={book} className="btn btn-solid shrink-0">
                {due.length ? (due.length === 1 ? "Book it" : `Book these ${due.length}`) : "Book a service"}
                <ArrowRight size={17} />
              </button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-steel">
              Typical intervals for petrol cars. Whichever comes first, the distance or the time,
              applies. This assumes each job was done on schedule, and your owner&apos;s manual has
              the final word.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Odometer({ value }: { value: number }) {
  const shown = Math.min(value, 999_999);
  const digits = String(shown).padStart(6, "0").split("");
  const lead = 6 - String(shown).length;

  return (
    <div className="mt-3 flex items-end gap-3" aria-hidden="true">
      <div className="flex gap-1 rounded-xl bg-black/50 p-1.5 ring-1 ring-white/10">
        {digits.map((d, i) => (
          <span
            key={i}
            className="relative h-12 w-8 overflow-hidden rounded-md bg-gradient-to-b from-[#1D2024] via-[#0B0C0E] to-[#1D2024] sm:h-14 sm:w-10"
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={d}
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-0 grid place-items-center font-mono text-2xl font-bold sm:text-3xl ${
                  i < lead ? "text-white/25" : "text-white"
                }`}
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </div>
      <span className="pb-1.5 text-sm font-semibold text-white/50">km</span>
    </div>
  );
}
