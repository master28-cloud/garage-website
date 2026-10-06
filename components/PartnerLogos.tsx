/**
 * Brand-coloured wordmarks, not official trademark artwork.
 * Every URL below was checked and returns 200.
 *
 * Replace with supplied logo files once each partner has granted written
 * permission — linking to a company asserts a commercial relationship more
 * strongly than merely naming it.
 */
type Partner = {
  name: string;
  href: string;
  color: string;
  mark: "ring" | "bars" | "chevron" | "dot" | "shield";
};

const PARTNERS: Partner[] = [
  { name: "AutoXpress",     href: "https://auto-xpress.co.ke",     color: "#D81F26", mark: "chevron" },
  { name: "CFAO Mobility",  href: "https://cfaomobility.co.ke",    color: "#EB0A1E", mark: "ring" },
  { name: "Isuzu EA",       href: "https://www.isuzu.co.ke",       color: "#C8102E", mark: "bars" },
  { name: "Simba Corp",     href: "https://simbacorp.com",         color: "#0F7B3E", mark: "dot" },
  { name: "Jubilee",        href: "https://jubileeinsurance.com",  color: "#00843D", mark: "shield" },
  { name: "Britam",         href: "https://britam.com",            color: "#F58220", mark: "dot" },
  { name: "APA Insurance",  href: "https://www.apainsurance.org",  color: "#005DAA", mark: "ring" }
];

function Mark({ type, color }: { type: Partner["mark"]; color: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (type) {
    case "ring":
      return <svg {...common}><ellipse cx="12" cy="12" rx="10" ry="6.5" fill="none" stroke={color} strokeWidth="2.4" /><ellipse cx="12" cy="12" rx="4" ry="6.5" fill="none" stroke={color} strokeWidth="2.4" /></svg>;
    case "bars":
      return <svg {...common}><rect x="2" y="7" width="5" height="10" rx="1" fill={color} /><rect x="9.5" y="4" width="5" height="16" rx="1" fill={color} /><rect x="17" y="7" width="5" height="10" rx="1" fill={color} /></svg>;
    case "chevron":
      return <svg {...common}><path d="M3 18L10 6l3 5 3-5 5 12" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "dot":
      return <svg {...common}><circle cx="12" cy="12" r="9" fill={color} opacity="0.18" /><circle cx="12" cy="12" r="4.5" fill={color} /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" fill={color} opacity="0.16" stroke={color} strokeWidth="1.8" strokeLinejoin="round" /></svg>;
  }
}

export default function PartnerLogos() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {PARTNERS.map((p) => (
        <li key={p.name}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${p.name} (opens in a new tab)`}
            className="group flex items-center gap-2.5 rounded-xl bg-white px-4 py-3.5 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
          >
            <Mark type={p.mark} color={p.color} />
            <span className="text-[13px] font-bold leading-tight" style={{ color: p.color }}>
              {p.name}
            </span>
            <svg
              className="ml-auto shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50 group-focus-visible:opacity-50"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
