import { Star } from "lucide-react";

const items = [
  {
    name: "Njeri Kamau",
    role: "Toyota Prado owner · Karen",
    quote: "They quoted honestly, finished a day early, and the paintwork is better than factory. My Prado came home brilliant."
  },
  {
    name: "David Omondi",
    role: "Fleet manager · SafariLogix",
    quote: "We send our fourteen-truck fleet here. Downtime is down thirty percent since we switched. These people respect your business."
  },
  {
    name: "Zainab Hussein",
    role: "Mercedes GLE owner · Westlands",
    quote: "The attention to detail is unreal. From diagnostics to delivery, every step was explained. I won't take my car anywhere else."
  }
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">Testimonials</p>
          <h2 className="h-section mt-4">Trusted by Kenya&apos;s most discerning drivers.</h2>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="flex flex-col border-t-2 border-ink pt-6">
              <div className="flex gap-0.5 text-signal" aria-label="Rated 5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7">
                <div className="font-bold text-ink">{t.name}</div>
                <div className="mt-0.5 text-sm text-steel">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
