import { Target, Eye, Gem } from "lucide-react";

const cards = [
  {
    icon: Target,
    label: "Mission",
    body: "To deliver world-class automotive care that restores confidence, safety, and performance to every vehicle we touch.",
  },
  {
    icon: Eye,
    label: "Vision",
    body: "To be East Africa's most trusted and innovative automotive repair destination by 2030.",
  },
  {
    icon: Gem,
    label: "Core Values",
    body: "Integrity · Craftsmanship · Innovation · Customer Obsession · Sustainability",
  },
];

export default function MissionVision() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-12 max-w-2xl">
          <p className="text-brand-green font-semibold uppercase tracking-widest text-xs">Who we are</p>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Built on principles, powered by passion.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, label, body }) => (
            <div key={label} className="card border-l-4 border-brand-green">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-brand-green">
                <Icon size={22} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-blue">{label}</h3>
              <p className="mt-2 text-lg text-slate-700">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
