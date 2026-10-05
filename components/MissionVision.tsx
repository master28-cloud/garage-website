const VALUES = ["Integrity", "Craftsmanship", "Innovation", "Customer Obsession", "Sustainability"];

export default function MissionVision() {
  return (
    <section id="about" className="section bg-ink text-white">
      <div className="container-x">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow">Who we are</p>
          <h2 className="h-section mt-4 text-white">Built on principles, powered by people.</h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/12 md:grid-cols-3">
          <div className="bg-ink p-9">
            <p className="eyebrow">Mission</p>
            <p className="mt-4 text-xl leading-snug text-white">
              To deliver world-class automotive care that restores confidence, safety and
              performance to every vehicle we touch.
            </p>
          </div>

          <div className="bg-ink p-9">
            <p className="eyebrow">Vision</p>
            <p className="mt-4 text-xl leading-snug text-white">
              To be East Africa&apos;s most trusted and innovative automotive repair
              destination by 2030.
            </p>
          </div>

          <div className="bg-ink p-9">
            <p className="eyebrow">Core Values</p>
            <ul className="mt-4 space-y-2.5">
              {VALUES.map((v) => (
                <li key={v} className="flex items-center gap-3 text-lg text-white">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
