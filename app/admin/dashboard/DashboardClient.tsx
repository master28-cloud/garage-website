"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import StatTiles, { type Stats } from "@/components/admin/StatTiles";
import WorkloadChart, { type Day } from "@/components/admin/WorkloadChart";
import ServiceMix, { type Mix } from "@/components/admin/ServiceMix";
import TodayPanel from "@/components/admin/TodayPanel";
import { chipStyle, type JobStatusRow } from "@/lib/statuses";
import { Search, Phone, MessageCircle, Inbox, SlidersHorizontal } from "lucide-react";

type Booking = {
  id: string; name: string; phone: string; email: string | null;
  vehicleMake: string; vehicleModel: string; vehicleYear: number | null;
  service: string; preferredDate: string; statusId: string;
  status: { id: string; name: string; color: string };
  notes: string | null; createdAt: string;
};

export type StatusCount = { id: string; name: string; color: string; count: number; isTerminal: boolean };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function waLink(phone: string, name: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "254");
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    `Hello ${name.split(" ")[0]}, this is AutoPro Garage regarding your booking.`
  )}`;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString();
}

export default function DashboardClient({
  sessionEmail, initialBookings, todays, statuses, statusCounts, stats, schedule, serviceMix
}: {
  sessionEmail: string;
  initialBookings: Booking[];
  todays: Booking[];
  statuses: JobStatusRow[];
  statusCounts: StatusCount[];
  stats: Stats;
  schedule: Day[];
  serviceMix: Mix[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        if (filter !== "ALL" && b.statusId !== filter) return false;
        if (!q.trim()) return true;
        const hay = `${b.name} ${b.phone} ${b.email ?? ""} ${b.vehicleMake} ${b.vehicleModel} ${b.service}`;
        return hay.toLowerCase().includes(q.toLowerCase());
      }),
    [bookings, q, filter]
  );

  async function updateStatus(id: string, statusId: string) {
    const prev = bookings;
    const next = statuses.find((s) => s.id === statusId);
    if (!next) return;

    setBusy(id);
    setError("");
    setBookings((b) =>
      b.map((x) =>
        x.id === id ? { ...x, statusId, status: { id: next.id, name: next.name, color: next.color } } : x
      )
    );

    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, statusId })
    });
    setBusy(null);

    if (!res.ok) {
      setBookings(prev);
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not update that booking.");
      return;
    }
    router.refresh();
  }

  return (
    <AdminShell email={sessionEmail}>
      <>
        <StatTiles stats={stats} />

        {/* Live count per configured stage */}
        {statusCounts.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {statusCounts.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setFilter(filter === s.id ? "ALL" : s.id)}
                  aria-pressed={filter === s.id}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                    filter === s.id ? "ring-2 ring-white/70" : "hover:brightness-110"
                  }`}
                  style={chipStyle(s.color)}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                  <span className="tabular-nums opacity-70">{s.count}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2"><WorkloadChart days={schedule} /></div>
          <TodayPanel bookings={todays} />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <ServiceMix mix={serviceMix} />
          <div className="lg:col-span-2">

        {/* Table panel */}
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-ink">Bookings</h2>
              <p className="mt-0.5 text-xs text-steel">
                Showing {filtered.length} of {bookings.length} most recent
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-light" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, phone, vehicle…"
                  className="w-56 rounded-xl border border-black/10 py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-steel-light focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                />
              </div>
              <div className="relative">
                <SlidersHorizontal size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-light" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Filter by stage"
                  className="appearance-none rounded-xl border border-black/10 py-2.5 pl-10 pr-9 text-sm text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                >
                  <option value="ALL">All stages</option>
                  {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="border-b border-black/5 bg-red-50 px-6 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {filtered.length === 0 ? (
            <EmptyState hasAny={bookings.length > 0} onClear={() => { setQ(""); setFilter("ALL"); }} />
          ) : (
            <>
              <table className="hidden w-full text-sm lg:table">
                <thead>
                  <tr className="border-b border-black/5 text-left text-[11px] uppercase tracking-wider text-steel">
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Scheduled</th>
                    <th className="px-4 py-3 font-semibold">Stage</th>
                    <th className="px-6 py-3 text-right font-semibold">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className={`border-b border-black/5 transition-colors last:border-0 hover:bg-[#FAFAF9] ${busy === b.id ? "opacity-50" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                            {initials(b.name)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-ink">{b.name}</div>
                            <div className="truncate text-xs text-steel">{b.phone} · {relativeTime(b.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ink">
                        {b.vehicleMake} {b.vehicleModel}
                        {b.vehicleYear ? <span className="text-steel"> ·{b.vehicleYear}</span> : null}
                      </td>
                      <td className="px-4 py-4 text-steel">{b.service.replace(/_/g, " ").toLowerCase()}</td>
                      <td className="px-4 py-4 text-ink">
                        {new Date(b.preferredDate).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-4">
                        <StatusSelect b={b} statuses={statuses} onChange={updateStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <a href={`tel:${b.phone}`} aria-label={`Call ${b.name}`} title="Call"
                             className="grid h-8 w-8 place-items-center rounded-lg text-steel transition-colors hover:bg-ink hover:text-white">
                            <Phone size={15} />
                          </a>
                          <a href={waLink(b.phone, b.name)} target="_blank" rel="noopener noreferrer"
                             aria-label={`WhatsApp ${b.name}`} title="WhatsApp"
                             className="grid h-8 w-8 place-items-center rounded-lg text-steel transition-colors hover:bg-[#25D366] hover:text-white">
                            <MessageCircle size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="divide-y divide-black/5 lg:hidden">
                {filtered.map((b) => (
                  <li key={b.id} className={`p-5 ${busy === b.id ? "opacity-50" : ""}`}>
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                        {initials(b.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{b.name}</p>
                            <p className="truncate text-xs text-steel">{b.phone}</p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                style={chipStyle(b.status.color)}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: b.status.color }} />
                            {b.status.name}
                          </span>
                        </div>
                        <dl className="mt-3 space-y-1 text-sm">
                          <div className="flex gap-2"><dt className="text-steel">Vehicle</dt><dd className="text-ink">{b.vehicleMake} {b.vehicleModel}</dd></div>
                          <div className="flex gap-2"><dt className="text-steel">Service</dt><dd className="text-ink">{b.service.replace(/_/g, " ").toLowerCase()}</dd></div>
                          <div className="flex gap-2"><dt className="text-steel">Date</dt><dd className="text-ink">{new Date(b.preferredDate).toLocaleDateString()}</dd></div>
                        </dl>
                        <div className="mt-4 flex items-center gap-2">
                          <StatusSelect b={b} statuses={statuses} onChange={updateStatus} />
                          <a href={`tel:${b.phone}`} aria-label={`Call ${b.name}`}
                             className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-steel">
                            <Phone size={15} />
                          </a>
                          <a href={waLink(b.phone, b.name)} target="_blank" rel="noopener noreferrer"
                             aria-label={`WhatsApp ${b.name}`}
                             className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366] text-white">
                            <MessageCircle size={15} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
          </div>
        </div>
      </>
    </AdminShell>
  );
}

function StatusSelect({
  b, statuses, onChange
}: { b: Booking; statuses: JobStatusRow[]; onChange: (id: string, statusId: string) => void }) {
  return (
    <div className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-2.5 h-1.5 w-1.5 rounded-full" style={{ background: b.status.color }} />
      <select
        value={b.statusId}
        onChange={(e) => onChange(b.id, e.target.value)}
        aria-label={`Stage for ${b.name}`}
        className="cursor-pointer appearance-none rounded-full py-1.5 pl-6 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-signal/40"
        style={chipStyle(b.status.color)}
      >
        {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  );
}

function EmptyState({ hasAny, onClear }: { hasAny: boolean; onClear: () => void }) {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F6F5F3]">
        <Inbox size={24} className="text-steel-light" />
      </div>
      {hasAny ? (
        <>
          <p className="mt-5 font-semibold text-ink">No bookings match your filters</p>
          <p className="mt-1.5 text-sm text-steel">Try a different search term or stage.</p>
          <button onClick={onClear} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft">
            Clear filters
          </button>
        </>
      ) : (
        <>
          <p className="mt-5 font-semibold text-ink">No bookings yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-steel">
            When a customer submits the booking form on your site, it will appear here instantly.
          </p>
          <a href="/#contact" className="mt-5 inline-block rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-dark">
            Open the booking form
          </a>
        </>
      )}
    </div>
  );
}
