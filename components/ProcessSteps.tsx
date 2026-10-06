const STEPS = [
  { n: "01", title: "Book",     body: "Send your details through the form. A service advisor confirms on WhatsApp, usually within minutes." },
  { n: "02", title: "Diagnose", body: "We inspect the vehicle and send you a written quote with photographs before any work starts." },
  { n: "03", title: "Repair",   body: "Certified technicians do the work in-house. You get progress updates, not silence." },
  { n: "04", title: "Collect",  body: "Road-tested, cleaned and handed back with a ninety-day warranty on our labour." }
];

export default function ProcessSteps() {
  return (
    <section className="section bg-ink text-white">
      <div className="container-x">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="h-section mt-4 text-white">No surprises, start to finish.</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/60">
            The part most garages get wrong is communication. Here is exactly what happens
            when you leave a vehicle with us.
          </p>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-2xl bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="group relative bg-ink p-8 transition-colors duration-300 hover:bg-ink-soft">
              <span className="text-5xl font-bold tracking-tightest text-white/12 transition-colors duration-300 group-hover:text-signal/60">
                {s.n}
              </span>
              <h3 className="mt-5 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/60">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
