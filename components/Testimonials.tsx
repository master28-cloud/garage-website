import { Star } from "lucide-react";

const items = [
  {
    name: "Njeri Kamau",
    role: "Toyota Prado owner, Karen",
    quote: "They quoted honestly, finished a day early and the paintwork is better than factory. My Prado came home brilliant.",
  },
  {
    name: "David Omondi",
    role: "Fleet manager, SafariLogix",
    quote: "We send our 14-truck fleet here. Downtime is down 30% since we switched. These folks respect your business.",
  },
  {
    name: "Zainab Hussein",
    role: "Mercedes GLE owner, Westlands",
    quote: "The attention to detail is unreal. From diagnostics to delivery, every step was explained. I won't take my car anywhere else.",
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand-green font-semibold uppercase tracking-widest text-xs">Testimonials</p>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Trusted by Kenya&apos;s most discerning drivers.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="card">
              <div className="flex gap-1 text-brand-green">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
              </div>
              <blockquote className="mt-4 text-slate-700">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-bold text-brand-navy">{t.name}</div>
                <div className="text-slate-500">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
