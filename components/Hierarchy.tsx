import Image from "next/image";

type Person = { name: string; role: string; avatar: string };
type Division = { label: string; accent: string; lead: Person; team: Person[] };

const CEO: Person = {
  name: "Brian Mugambi Mbaabu",
  role: "CEO & Founder",
  avatar: "/images/team/brian-mbaabu.svg"
};

const DIVISIONS: Division[] = [
  {
    label: "Operations",
    accent: "#0EA5E9",
    lead: { name: "Grace Wanjiru Omondi", role: "Chief Operating Officer", avatar: "/images/team/grace-omondi.svg" },
    team: [
      { name: "Linet Achieng", role: "Workshop Manager",         avatar: "/images/team/linet-achieng.svg" },
      { name: "Brian Mutua",   role: "Customer Experience Lead", avatar: "/images/team/brian-mutua.svg" }
    ]
  },
  {
    label: "Finance",
    accent: "#8B5CF6",
    lead: { name: "Peter Oduor Achieng'", role: "Chief Financial Officer", avatar: "/images/team/peter-achieng.svg" },
    team: []
  },
  {
    label: "Technical",
    accent: "#059669",
    lead: { name: "Samuel Kiprotich Rotich", role: "Head of Technical Operations", avatar: "/images/team/samuel-rotich.svg" },
    team: [
      { name: "James Njoroge", role: "Lead Mechanic",            avatar: "/images/team/james-njoroge.svg" },
      { name: "Fatuma Ali",    role: "Panel Beating Supervisor", avatar: "/images/team/fatuma-ali.svg" },
      { name: "Kevin Otieno",  role: "Quality Assurance",        avatar: "/images/team/kevin-otieno.svg" }
    ]
  }
];

function Avatar({ src, name, size }: { src: string; name: string; size: number }) {
  return (
    <Image
      src={src}
      alt={`Illustrated portrait of ${name}`}
      width={size}
      height={size}
      className="shrink-0 rounded-full ring-2 ring-white"
      style={{ width: size, height: size }}
    />
  );
}

export default function Hierarchy() {
  const headcount = 1 + DIVISIONS.length + DIVISIONS.reduce((n, d) => n + d.team.length, 0);

  return (
    <section id="team" className="section bg-paper">
      <div className="container-x">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow">Leadership</p>
          <h2 className="h-section mt-4">The people behind the work.</h2>
          <p className="lede mt-5">
            Experienced leaders and hands-on operators — accountable for every vehicle that
            leaves our bays.
          </p>
        </div>

        {/* Founder */}
        <div className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-signal/20 blur-2xl"
          />
          <div className="relative flex flex-col items-start gap-7 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-full bg-signal/30 blur-md" aria-hidden="true" />
              <div className="relative rounded-full bg-signal/15 p-1">
                <Avatar src={CEO.avatar} name={CEO.name} size={112} />
              </div>
            </div>

            <div>
              <span className="inline-block rounded-full bg-signal px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                {CEO.role}
              </span>
              <h3 className="mt-4 text-3xl font-bold tracking-tightest text-white sm:text-4xl">
                {CEO.name}
              </h3>
              <p className="mt-3 max-w-lg leading-relaxed text-white/60">
                Founded AutoPro in 2011 and still signs off on the workshop&apos;s standards.
                Leads a team of {headcount} across operations, finance and technical.
              </p>
            </div>
          </div>
        </div>

        {/* Divisions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {DIVISIONS.map((d) => (
            <div
              key={d.label}
              className="group flex flex-col rounded-3xl border border-paper-line bg-white p-7 transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_rgba(12,13,14,0.3)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: d.accent }} aria-hidden="true" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel">{d.label}</p>
              </div>

              {/* Division lead */}
              <div className="mt-6 flex items-center gap-4">
                <div className="rounded-full p-0.5" style={{ background: `${d.accent}22` }}>
                  <Avatar src={d.lead.avatar} name={d.lead.name} size={64} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold leading-tight text-ink">{d.lead.name}</p>
                  <p className="mt-0.5 text-sm" style={{ color: d.accent }}>{d.lead.role}</p>
                </div>
              </div>

              {d.team.length > 0 && (
                <>
                  <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-steel-light">
                    Reports to {d.lead.name.split(" ")[0]}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {d.team.map((p) => (
                      <li
                        key={p.name}
                        className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5 transition-colors duration-200 hover:bg-paper-warm"
                      >
                        <Avatar src={p.avatar} name={p.name} size={40} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                          <p className="truncate text-xs text-steel">{p.role}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {d.team.length === 0 && (
                <p className="mt-7 rounded-xl bg-paper px-3 py-2.5 text-xs text-steel">
                  Reports directly to the CEO.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
