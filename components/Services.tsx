import {
  Gauge, Hammer, Compass, Disc3, Snowflake, Zap, SearchCheck, FileCheck
} from "lucide-react";

export const SERVICES = [
  { slug: "engine-diagnostics",      icon: Gauge,       title: "Engine Diagnostics",          body: "OBD-II deep scans, live-data analysis and tuning for petrol, diesel and hybrid drivetrains." },
  { slug: "panel-beating",           icon: Hammer,      title: "Panel Beating & Spray",       body: "Hand-finished metalwork and climate-controlled spray booths for factory-match paint." },
  { slug: "wheel-alignment",         icon: Compass,     title: "Wheel Alignment & Balancing", body: "Four-wheel laser alignment, dynamic balancing and tyre rotation schedules." },
  { slug: "brake-suspension",        icon: Disc3,       title: "Brake & Suspension",          body: "Pad, disc, ABS, strut and shock replacement with full road-test calibration." },
  { slug: "ac-servicing",            icon: Snowflake,   title: "AC Servicing",                body: "R134a and R1234yf regassing, leak detection, cabin filters and compressor rebuilds." },
  { slug: "electrical-repairs",      icon: Zap,         title: "Electrical Repairs",          body: "ECU, alternator, starter and complete harness repair by certified auto-electricians." },
  { slug: "pre-purchase-inspection", icon: SearchCheck, title: "Pre-Purchase Inspection",     body: "Seventy-point mechanical, cosmetic and compliance check before you commit." },
  { slug: "insurance-repairs",       icon: FileCheck,   title: "Insurance Claim Repairs",     body: "Approved by Kenya's major insurers — we handle assessment, paperwork and repair." }
] as const;

export default function Services({ heading = true }: { heading?: boolean }) {
  return (
    <section id="services" className={heading ? "section" : "pb-24 sm:pb-32"}>
      <div className="container-x">
        {heading && (
          <div className="mb-14 max-w-2xl">
            <p className="eyebrow">What we do</p>
            <h2 className="h-section mt-4">Everything your vehicle needs, under one roof.</h2>
            <p className="lede mt-5">
              Eight disciplines, one workshop, zero hand-offs to third parties.
            </p>
          </div>
        )}

        <div className="grid gap-px overflow-hidden rounded-2xl bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ slug, icon: Icon, title, body }) => (
            <div
              key={slug}
              id={slug}
              className="group scroll-mt-28 bg-white p-7 transition-colors duration-300 hover:bg-paper"
            >
              <Icon size={24} className="text-signal" strokeWidth={1.75} />
              <h3 className="mt-5 text-[17px] font-bold text-ink">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-steel">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
