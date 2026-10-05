import {
  Gauge, Hammer, Compass, Disc3, Snowflake, Zap, SearchCheck, FileCheck
} from "lucide-react";

const services = [
  { icon: Gauge,       title: "Engine Diagnostics",          body: "OBD-II deep scans, live-data analysis and tuning for petrol, diesel and hybrid drivetrains." },
  { icon: Hammer,      title: "Panel Beating & Spray",       body: "Hand-finished metalwork and climate-controlled spray booths for factory-match paint." },
  { icon: Compass,     title: "Wheel Alignment & Balancing", body: "Four-wheel laser alignment, dynamic balancing and tyre rotation schedules." },
  { icon: Disc3,       title: "Brake & Suspension",          body: "Pad, disc, ABS, strut and shock replacement with full road-test calibration." },
  { icon: Snowflake,   title: "AC Servicing",                body: "R134a and R1234yf regassing, leak detection, cabin filters and compressor rebuilds." },
  { icon: Zap,         title: "Electrical Repairs",          body: "ECU, alternator, starter and complete harness repair by certified auto-electricians." },
  { icon: SearchCheck, title: "Pre-Purchase Inspection",     body: "Seventy-point mechanical, cosmetic and compliance check before you commit." },
  { icon: FileCheck,   title: "Insurance Claim Repairs",     body: "Approved by Kenya's major insurers — we handle assessment, paperwork and repair." }
];

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="h-section mt-4">Everything your vehicle needs, under one roof.</h2>
          <p className="lede mt-5">
            Eight disciplines, one workshop, zero hand-offs to third parties.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group bg-white p-7 transition-colors duration-300 hover:bg-paper">
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
