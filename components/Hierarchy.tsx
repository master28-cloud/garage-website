type Node = { name: string; role: string; reports?: Node[] };

const tree: Node = {
  name: "Brian Mugambi Mbaabu",
  role: "CEO & Founder",
  reports: [
    {
      name: "Grace Wanjiru Omondi", role: "COO",
      reports: [
        { name: "Linet Achieng", role: "Workshop Manager" },
        { name: "Brian Mutua",   role: "Customer Experience Lead" }
      ]
    },
    { name: "Peter Oduor Achieng'", role: "CFO" },
    {
      name: "Samuel Kiprotich Rotich", role: "Head of Technical Ops",
      reports: [
        { name: "James Njoroge", role: "Lead Mechanic" },
        { name: "Fatuma Ali",    role: "Panel Beating Supervisor" },
        { name: "Kevin Otieno",  role: "Quality Assurance" }
      ]
    }
  ]
};

function Card({ node }: { node: Node }) {
  return (
    <div className="min-w-[11rem] rounded-xl border border-brand-blue/15 bg-white px-4 py-3 shadow-sm text-center">
      <div className="text-sm font-bold text-brand-navy">{node.name}</div>
      <div className="text-xs text-brand-blue">{node.role}</div>
    </div>
  );
}

function Branch({ node }: { node: Node }) {
  return (
    <div className="flex flex-col items-center">
      <Card node={node} />
      {node.reports?.length ? (
        <>
          <div className="w-px h-6 bg-brand-navy/30" />
          <div className="flex flex-wrap items-start justify-center gap-6 border-t border-brand-navy/20 pt-6">
            {node.reports.map((r) => <Branch key={r.name} node={r} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function Hierarchy() {
  return (
    <section id="team" className="bg-brand-sand py-20 sm:py-28">
      <div className="container-x">
        <div className="mb-10 max-w-2xl">
          <p className="text-brand-blue font-semibold uppercase tracking-widest text-xs">Leadership</p>
          <h2 className="mt-2 text-4xl font-bold text-brand-navy sm:text-5xl">Management hierarchy</h2>
          <p className="mt-3 text-slate-600">Experienced leaders, hands-on operators — the team keeping every vehicle moving.</p>
        </div>
        <div className="overflow-x-auto pb-6">
          <div className="min-w-max px-6"><Branch node={tree} /></div>
        </div>
      </div>
    </section>
  );
}
