"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { chipStyle } from "@/lib/statuses";
import { Plus, Trash2, X, Check, ChevronUp, ChevronDown, Star, Flag } from "lucide-react";

export type StatusRow = {
  id: string; name: string; slug: string; color: string;
  sortOrder: number; isDefault: boolean; isTerminal: boolean; inUse: number;
};

const SUGGESTIONS = [
  "Awaiting parts", "In spray booth", "Quality check",
  "Ready for collection", "Awaiting insurance approval", "Awaiting payment"
];

const field =
  "mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink " +
  "focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20";
const lbl = "text-[11px] font-semibold uppercase tracking-[0.14em] text-ink";

export default function StatusManager({ initial }: { initial: StatusRow[] }) {
  const [rows, setRows] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();

  const flash = (m: string) => { setNotice(m); setTimeout(() => setNotice(""), 2800); };

  async function refresh() {
    const data = await fetch("/api/admin/statuses").then((r) => r.json()).catch(() => null);
    if (data?.statuses) setRows(data.statuses);
    router.refresh();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id); setError("");
    const res = await fetch("/api/admin/statuses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body })
    });
    const data = await res.json().catch(() => null);
    setBusy(null);
    if (!res.ok) { setError(data?.error ?? "Could not save."); return; }
    await refresh();
    flash("Saved.");
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[index], b = rows[target];
    setBusy(a.id);
    await fetch("/api/admin/statuses", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, sortOrder: b.sortOrder })
    });
    await fetch("/api/admin/statuses", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, sortOrder: a.sortOrder })
    });
    setBusy(null);
    await refresh();
  }

  async function remove(row: StatusRow) {
    if (!confirm(`Remove the "${row.name}" stage?`)) return;
    setBusy(row.id); setError("");
    const res = await fetch(`/api/admin/statuses?id=${row.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => null);
    setBusy(null);
    if (!res.ok) { setError(data?.error ?? "Could not remove."); return; }
    await refresh();
    flash("Stage removed.");
  }

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/statuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") ?? ""),
        color: String(fd.get("color") ?? "#5A6069"),
        isTerminal: fd.get("isTerminal") === "on"
      })
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) { setError(data?.error ?? "Could not add."); return; }
    setAdding(false);
    await refresh();
    flash("Stage added.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Job stages</h2>
          <p className="mt-1.5 max-w-xl text-sm text-white/60">
            The stages a vehicle moves through in your workshop. Add whatever matches how
            the bays actually run — the dashboard and the booking form follow this list.
          </p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="btn btn-solid !px-6 !py-2.5 !text-sm">
          {adding ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add stage</>}
        </button>
      </div>

      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">{error}</p>}
      {notice && <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200"><Check size={15} /> {notice}</p>}

      {adding && (
        <form onSubmit={add} className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
          <h3 className="font-bold text-ink">New stage</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={lbl}>Name</label>
              <input id="name" name="name" required maxLength={40} placeholder="Awaiting parts" className={field} list="stage-ideas" />
              <datalist id="stage-ideas">
                {SUGGESTIONS.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="color" className={lbl}>Colour</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input id="color" name="color" type="color" defaultValue="#3B82F6"
                       className="h-11 w-14 cursor-pointer rounded-lg border border-black/10 bg-white p-1" />
                <span className="text-xs text-steel">Used for the chip on the dashboard</span>
              </div>
            </div>
          </div>
          <label className="mt-5 flex items-start gap-3 text-sm text-steel">
            <input type="checkbox" name="isTerminal" className="mt-0.5 h-4 w-4 accent-signal" />
            <span>
              <strong className="text-ink">This stage closes the job.</strong> Tick for finished
              states like Completed or Cancelled — they stop counting towards &quot;Open jobs&quot;.
            </span>
          </label>
          <button className="btn btn-solid mt-6 !px-7 !py-3 !text-sm">Add stage</button>
        </form>
      )}

      <div className="mt-7 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <ul className="divide-y divide-black/5">
          {rows.map((r, i) => (
            <li key={r.id} className={`flex flex-wrap items-center gap-4 p-5 ${busy === r.id ? "opacity-50" : ""}`}>
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0}
                        aria-label={`Move ${r.name} up`}
                        className="text-steel-light transition-colors hover:text-ink disabled:opacity-25">
                  <ChevronUp size={15} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === rows.length - 1}
                        aria-label={`Move ${r.name} down`}
                        className="text-steel-light transition-colors hover:text-ink disabled:opacity-25">
                  <ChevronDown size={15} />
                </button>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={chipStyle(r.color)}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />
                {r.name}
              </span>

              <div className="min-w-0 flex-1 text-xs text-steel">
                {r.inUse} booking{r.inUse === 1 ? "" : "s"}
                {r.isDefault && <span className="ml-2 font-medium text-signal">· new bookings start here</span>}
                {r.isTerminal && <span className="ml-2">· closes the job</span>}
              </div>

              <input type="color" value={r.color}
                     onChange={(e) => patch(r.id, { color: e.target.value })}
                     aria-label={`Colour for ${r.name}`}
                     className="h-9 w-10 cursor-pointer rounded-lg border border-black/10 bg-white p-1" />

              <button onClick={() => patch(r.id, { isDefault: true })} disabled={r.isDefault}
                      title="New bookings start at this stage"
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        r.isDefault ? "border-signal/30 bg-signal/10 text-signal" : "border-black/10 text-ink hover:bg-black/5"
                      }`}>
                <Star size={13} fill={r.isDefault ? "currentColor" : "none"} /> Default
              </button>

              <button onClick={() => patch(r.id, { isTerminal: !r.isTerminal })}
                      title="Jobs at this stage count as closed"
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        r.isTerminal ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-black/10 text-ink hover:bg-black/5"
                      }`}>
                <Flag size={13} /> Closes job
              </button>

              <button onClick={() => remove(r)} aria-label={`Remove ${r.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-steel transition-colors hover:bg-red-50 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>

        {rows.length === 0 && (
          <p className="p-14 text-center text-steel">
            No stages yet. Add at least one — bookings need somewhere to land.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-white/45">
        A stage that still has bookings on it cannot be removed. Move those bookings to
        another stage first, so nothing loses its history.
      </p>
    </div>
  );
}
