const MILESTONES = [
  { year: "2011", title: "Two bays on Enterprise Road", body: "Founded with a single ramp, a compressor and a reputation to build." },
  { year: "2015", title: "Panel beating and spray booth", body: "Bodywork brought in-house, ending the hand-off to third-party sprayers." },
  { year: "2019", title: "First insurer approval",        body: "Became an approved repairer, opening accident work to claim customers." },
  { year: "2023", title: "Twelve bays, 24 technicians",   body: "Expanded the floor and the team to cut average turnaround to under three days." },
  { year: "2026", title: "18,000 vehicles and counting",  body: "Still on the same road, still answering the phone ourselves." }
];

export default function Timeline() {
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow">Our story</p>
          <h2 className="h-section mt-4">Fifteen years on one road.</h2>
        </div>

        <ol className="relative">
          {/* spine */}
          <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-px bg-paper-line sm:left-[calc(5rem+7px)]" />

          {MILESTONES.map((m) => (
            <li key={m.year} className="relative grid gap-2 pb-12 pl-8 last:pb-0 sm:grid-cols-[5rem_1fr] sm:gap-8 sm:pl-0">
              <span aria-hidden="true"
                    className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-signal bg-paper sm:left-20" />
              <div className="text-xl font-bold tracking-tight text-signal sm:text-right">{m.year}</div>
              <div className="sm:pl-8">
                <h3 className="text-lg font-bold text-ink">{m.title}</h3>
                <p className="mt-1.5 max-w-xl leading-relaxed text-steel">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
