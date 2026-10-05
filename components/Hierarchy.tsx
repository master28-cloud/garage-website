type Node = { name: string; role: string; reports?: Node[] };

const tree: Node = {
  name: "Brian Mugambi Mbaabu",
  role: "CEO & Founder",
  reports: [
    {
      name: "Grace Wanjiru Omondi", role: "Chief Operating Officer",
      reports: [
        { name: "Linet Achieng", role: "Workshop Manager" },
        { name: "Brian Mutua",   role: "Customer Experience Lead" }
      ]
    },
    { name: "Peter Oduor Achieng'", role: "Chief Financial Officer" },
    {
      name: "Samuel Kiprotich Rotich", role: "Head of Technical Operations",
      reports: [
        { name: "James Njoroge", role: "Lead Mechanic" },
        { name: "Fatuma Ali",    role: "Panel Beating Supervisor" },
        { name: "Kevin Otieno",  role: "Quality Assurance" }
      ]
    }
  ]
};

function Card({ node, root }: { node: Node; root?: boolean }) {
  return (
    <div
      className={`min-w-[12rem] rounded-xl px-5 py-3.5 text-center ${
        root ? "bg-signal text-white" : "border border-paper-line bg-white"
      }`}
    >
      <div className={`text-sm font-bold ${root ? "text-white" : "text-ink"}`}>{node.name}</div>
      <div className={`mt-0.5 text-xs ${root ? "text-white/85" : "text-steel"}`}>{node.role}</div>
    </div>
  );
}

function Branch({ node, root }: { node: Node; root?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <Card node={node} root={root} />
      {node.reports?.length ? (
        <>
          <div className="h-7 w-px bg-paper-line" />
          <div className="flex flex-wrap items-start justify-center gap-7 border-t border-paper-line pt-7">
            {node.reports.map((r) => <Branch key={r.name} node={r} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default function Hierarchy() {
  return (
    <section id="team" className="section bg-paper">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">Leadership</p>
          <h2 className="h-section mt-4">The people behind the work.</h2>
          <p className="lede mt-5">
            Experienced leaders, hands-on operators — accountable for every vehicle that
            leaves our bays.
          </p>
        </div>

        <div className="-mx-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
          <div className="min-w-max"><Branch node={tree} root /></div>
        </div>
      </div>
    </section>
  );
}
