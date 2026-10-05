/**
 * Brand-coloured wordmarks, not official trademark artwork.
 * Replace with supplied logo files once each partner has granted written
 * permission — listing a company here asserts a commercial relationship.
 */
type Partner = { name: string; color: string; mark: "ring" | "bars" | "chevron" | "dot" | "shield" };

const PARTNERS: Partner[] = [
  { name: "AutoXpress",   color: "#D81F26", mark: "chevron" },
  { name: "Toyota Kenya", color: "#EB0A1E", mark: "ring" },
  { name: "Isuzu EA",     color: "#C8102E", mark: "bars" },
  { name: "DT Dobie",     color: "#00539B", mark: "shield" },
  { name: "Simba Corp",   color: "#0F7B3E", mark: "dot" },
  { name: "CFAO Motors",  color: "#1B4F9C", mark: "chevron" },
  { name: "Jubilee",      color: "#00843D", mark: "shield" },
  { name: "Britam",       color: "#F58220", mark: "dot" },
  { name: "APA Insurance",color: "#005DAA", mark: "ring" }
];

function Mark({ type, color }: { type: Partner["mark"]; color: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (type) {
    case "ring":
      return <svg {...common}><ellipse cx="12" cy="12" rx="10" ry="6.5" fill="none" stroke={color} strokeWidth="2.4" /><ellipse cx="12" cy="12" rx="4" ry="6.5" fill="none" stroke={color} strokeWidth="2.4" /></svg>;
    case "bars":
      return <svg {...common}><rect x="2"  y="7" width="5" height="10" rx="1" fill={color} /><rect x="9.5" y="4" width="5" height="16" rx="1" fill={color} /><rect x="17" y="7" width="5" height="10" rx="1" fill={color} /></svg>;
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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {PARTNERS.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3.5 transition-transform duration-300 ease-smooth hover:-translate-y-0.5"
        >
          <Mark type={p.mark} color={p.color} />
          <span className="text-[13px] font-bold leading-tight" style={{ color: p.color }}>
            {p.name}
          </span>
        </div>
      ))}
    </div>
  );
}
