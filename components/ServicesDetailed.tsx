import { SERVICES } from "./Services";

const DETAIL: Record<string, string[]> = {
  "engine-diagnostics":      ["Live sensor data", "Fault-code tracing", "Emissions tuning"],
  "panel-beating":           ["Chassis straightening", "Factory-match paint", "Rust treatment"],
  "wheel-alignment":         ["Four-wheel laser", "Dynamic balancing", "Tyre rotation plan"],
  "brake-suspension":        ["Pads and discs", "ABS diagnostics", "Shock replacement"],
  "ac-servicing":            ["R134a and R1234yf", "Leak detection", "Compressor rebuild"],
  "electrical-repairs":      ["ECU faults", "Harness repair", "Alternator & starter"],
  "pre-purchase-inspection": ["Seventy-point check", "Written report", "Same-day turnaround"],
  "insurance-repairs":       ["Assessor liaison", "Claim paperwork", "Approved by major insurers"]
};

export default function ServicesDetailed() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">The full list</p>
          <h2 className="h-section mt-4">Eight disciplines, one workshop.</h2>
          <p className="lede mt-5">
            Nothing gets subcontracted out. Your vehicle stays with us from the moment it
            arrives until you drive it away.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ slug, icon: Icon, title, body }, i) => (
            <article
              key={slug}
              id={slug}
              className="group relative scroll-mt-28 overflow-hidden rounded-2xl border border-paper-line bg-white p-7 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:border-signal/30 hover:shadow-[0_18px_40px_-20px_rgba(12,13,14,0.25)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-4 text-5xl font-bold tracking-tightest text-paper-warm transition-colors duration-300 group-hover:text-signal/15"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-ink text-signal transition-colors duration-300 group-hover:bg-signal group-hover:text-white">
                <Icon size={21} strokeWidth={1.9} />
              </span>

              <h3 className="relative mt-6 text-[17px] font-bold text-ink">{title}</h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-steel">{body}</p>

              <ul className="relative mt-5 space-y-2 border-t border-paper-line pt-5">
                {(DETAIL[slug] ?? []).map((d) => (
                  <li key={d} className="flex items-center gap-2.5 text-xs text-steel">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-signal" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
