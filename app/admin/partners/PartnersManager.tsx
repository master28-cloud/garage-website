"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Eye, EyeOff, Check, X, ExternalLink } from "lucide-react";

type Partner = {
  id: string; name: string; href: string; color: string; mark: string;
  published: boolean; sortOrder: number;
};

const MARKS = ["ring", "bars", "chevron", "dot", "shield"] as const;

function Mark({ type, color }: { type: string; color: string }) {
  const c = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (type) {
    case "ring":    return <svg {...c}><ellipse cx="12" cy="12" rx="10" ry="6.5" fill="none" stroke={color} strokeWidth="2.4" /><ellipse cx="12" cy="12" rx="4" ry="6.5" fill="none" stroke={color} strokeWidth="2.4" /></svg>;
    case "bars":    return <svg {...c}><rect x="2" y="7" width="5" height="10" rx="1" fill={color} /><rect x="9.5" y="4" width="5" height="16" rx="1" fill={color} /><rect x="17" y="7" width="5" height="10" rx="1" fill={color} /></svg>;
    case "chevron": return <svg {...c}><path d="M3 18L10 6l3 5 3-5 5 12" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case "shield":  return <svg {...c}><path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z" fill={color} opacity="0.16" stroke={color} strokeWidth="1.8" strokeLinejoin="round" /></svg>;
    default:        return <svg {...c}><circle cx="12" cy="12" r="9" fill={color} opacity="0.18" /><circle cx="12" cy="12" r="4.5" fill={color} /></svg>;
  }
}

const field = "mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20";
const lbl = "text-[11px] font-semibold uppercase tracking-[0.14em] text-ink";

export default function PartnersManager({ initial }: { initial: Partner[] }) {
  const [partners, setPartners] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();

  function flash(m: string) { setNotice(m); setTimeout(() => setNotice(""), 2600); }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id); setError("");
    const res = await fetch("/api/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body })
    });
    const data = await res.json().catch(() => null);
    setBusy(null);
    if (!res.ok) { setError(data?.error ?? "Could not save."); return; }
    setPartners((xs) => xs.map((x) => (x.id === id ? { ...x, ...body } as Partner : x)));
    router.refresh();
    flash("Saved and live.");
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Remove ${name} from the partners list?`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      setPartners((xs) => xs.filter((x) => x.id !== id));
      router.refresh();
      flash("Removed.");
    } else setError("Could not remove.");
  }

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? ""),
      href: String(fd.get("href") ?? ""),
      color: String(fd.get("color") ?? "#5A6069"),
      mark: String(fd.get("mark") ?? "dot")
    };
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) { setError(data?.error ?? "Could not add."); return; }
    setPartners((xs) => [...xs, data.partner]);
    setAdding(false);
    router.refresh();
    flash("Partner added and live.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Partners</h2>
          <p className="mt-1.5 max-w-xl text-sm text-white/60">
            Shown in the footer, each linking to the partner&apos;s site. Listing a company
            here asserts a commercial relationship — only add partners who have agreed.
          </p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="btn btn-solid !px-6 !py-2.5 !text-sm">
          {adding ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add partner</>}
        </button>
      </div>

      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}
      {notice && <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200"><Check size={15} /> {notice}</p>}

      {adding && (
        <form onSubmit={add} className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
          <h3 className="font-bold text-ink">New partner</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="name" className={lbl}>Name</label><input id="name" name="name" required maxLength={40} placeholder="AutoXpress" className={field} /></div>
            <div><label htmlFor="href" className={lbl}>Website</label><input id="href" name="href" required type="url" placeholder="https://example.co.ke" className={field} /></div>
            <div>
              <label htmlFor="color" className={lbl}>Brand colour</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="color" name="color" type="color" defaultValue="#D81F26" className="h-11 w-14 cursor-pointer rounded-lg border border-black/10 bg-white p-1" />
                <span className="text-xs text-steel">Pick the partner&apos;s brand colour</span>
              </div>
            </div>
            <div>
              <label htmlFor="mark" className={lbl}>Icon style</label>
              <select id="mark" name="mark" defaultValue="dot" className={field}>
                {MARKS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-solid mt-6 !px-7 !py-3 !text-sm">Add partner</button>
        </form>
      )}

      <div className="mt-7 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <ul className="divide-y divide-black/5">
          {partners.map((p) => (
            <li key={p.id} className={`flex flex-wrap items-center gap-4 p-5 ${busy === p.id ? "opacity-50" : ""}`}>
              <Mark type={p.mark} color={p.color} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold" style={{ color: p.color }}>{p.name}</p>
                <a href={p.href} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1 text-xs text-steel hover:text-ink">
                  {p.href} <ExternalLink size={11} />
                </a>
              </div>

              <input
                type="color"
                value={p.color}
                onChange={(e) => patch(p.id, { color: e.target.value })}
                aria-label={`Brand colour for ${p.name}`}
                className="h-9 w-10 cursor-pointer rounded-lg border border-black/10 bg-white p-1"
              />

              <select
                value={p.mark}
                onChange={(e) => patch(p.id, { mark: e.target.value })}
                aria-label={`Icon style for ${p.name}`}
                className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs text-ink"
              >
                {MARKS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>

              <button
                onClick={() => patch(p.id, { published: !p.published })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-black/5"
              >
                {p.published ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
              </button>

              <button
                onClick={() => remove(p.id, p.name)}
                aria-label={`Remove ${p.name}`}
                className="grid h-8 w-8 place-items-center rounded-lg text-steel transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>

        {partners.length === 0 && (
          <p className="p-14 text-center text-steel">
            No partners listed. The footer section will be hidden until you add one.
          </p>
        )}
      </div>
    </div>
  );
}
