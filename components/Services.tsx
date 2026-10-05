import {
  Gauge, Hammer, Compass, Shield, Snowflake, Zap, SearchCheck, FileCheck
} from "lucide-react";

const services = [
  { icon: Gauge,       title: "Engine Diagnostics",       body: "OBD-II deep scans, live-data analysis, and performance tuning for petrol, diesel & hybrid." },
  { icon: Hammer,      title: "Panel Beating & Spray",    body: "Hand-finished metalwork and PPG-grade spray booths for showroom-standard paint." },
  { icon: Compass,     title: "Wheel Alignment & Balancing", body: "4-wheel laser alignment, dynamic balancing, and tyre-rotation plans." },
  { icon: Shield,      title: "Brake & Suspension",       body: "Pad, disc, ABS, strut and shock replacement with road-tested calibration." },
  { icon: Snowflake,   title: "AC Servicing",             body: "R134a & R1234yf regassing, leak detection, cabin filter and compressor rebuilds." },
  { icon: Zap,         title: "Electrical Repairs",       body: "ECU, alternator, starter and full wiring harness repair by certified auto-electricians." },
  { icon: SearchCheck, title: "Pre-Purchase Inspection",  body: "70-point mechanical, cosmetic and compliance check before you buy." },
  { icon: FileCheck,   title: "Insurance Claim Repairs",  body: "Approved by major insurers in Kenya — we handle paperwork, assessment and repair." }
];

export default function Services() {
  return (
    <section id="services" className="bg-brand-sand py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand-blue font-semibold uppercase tracking-widest text-xs">What we do</p>
          <h2 className="mt-2 text-4xl font-bold text-brand-navy sm:text-5xl">Services engineered for every mile.</h2>
          <p className="mt-3 text-slate-600">From routine maintenance to major restorations, each service is executed by certified technicians under one roof.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group card hover:-translate-y-1 transition">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-brand-green group-hover:bg-brand-green group-hover:text-brand-navy transition">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
