"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import {
  Search, LogOut, Phone, MessageCircle, Inbox, CalendarDays,
  Clock3, CheckCircle2, Wrench, BadgeCheck, SlidersHorizontal
} from "lucide-react";

type Booking = {
  id: string; name: string; phone: string; email: string | null;
  vehicleMake: string; vehicleModel: string; vehicleYear: number | null;
  service: string; preferredDate: string; status: string; notes: string | null;
  createdAt: string;
};

type Stats = {
  allTime: number; today: number; pending: number;
  confirmed: number; inProgress: number; completed: number; cancelled: number;
};

const STATUSES = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

const STATUS_STYLE: Record<string, { dot: string; chip: string; label: string }> = {
  PENDING:     { dot: "bg-amber-500",  chip: "bg-amber-50 text-amber-700 ring-amber-200",   label: "Pending" },
  CONFIRMED:   { dot: "bg-blue-500",   chip: "bg-blue-50 text-blue-700 ring-blue-200",      label: "Confirmed" },
  IN_PROGRESS: { dot: "bg-signal",     chip: "bg-orange-50 text-orange-700 ring-orange-200",label: "In progress" },
  COMPLETED:   { dot: "bg-emerald-500",chip: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Completed" },
  CANCELLED:   { dot: "bg-slate-400",  chip: "bg-slate-100 text-slate-600 ring-slate-200",  label: "Cancelled" }
};

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
  sessionEmail, initialBookings, stats
}: { sessionEmail: string; initialBookings: Booking[]; stats: Stats }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        if (filter !== "ALL" && b.status !== filter) return false;
        if (!q.trim()) return true;
        const hay = `${b.name} ${b.phone} ${b.email ?? ""} ${b.vehicleMake} ${b.vehicleModel} ${b.service}`;
        return hay.toLowerCase().includes(q.toLowerCase());
      }),
    [bookings, q, filter]
  );

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function updateStatus(id: string, status: string) {
    const prev = bookings;
    setBusy(id);
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    setBusy(null);
    if (!res.ok) setBookings(prev);
  }

  const cards = [
    { label: "Booked for today", value: stats.today,      Icon: CalendarDays, accent: "text-signal",      ring: "ring-orange-200/70",  bg: "bg-orange-50" },
    { label: "Pending",          value: stats.pending,    Icon: Clock3,       accent: "text-amber-600",   ring: "ring-amber-200/70",   bg: "bg-amber-50" },
    { label: "Confirmed",        value: stats.confirmed,  Icon: CheckCircle2, accent: "text-blue-600",    ring: "ring-blue-200/70",    bg: "bg-blue-50" },
    { label: "In progress",      value: stats.inProgress, Icon: Wrench,       accent: "text-orange-600",  ring: "ring-orange-200/70",  bg: "bg-orange-50" },
    { label: "Completed",        value: stats.completed,  Icon: BadgeCheck,   accent: "text-emerald-600", ring: "ring-emerald-200/70", bg: "bg-emerald-50" },
    { label: "All time",         value: stats.allTime,    Icon: Inbox,        accent: "text-slate-600",   ring: "ring-slate-200/70",   bg: "bg-slate-100" }
  ];

  return (
    <AdminShell email={sessionEmail}>
      <>
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-6">
          {cards.map(({ label, value, Icon, accent, ring, bg }) => (
            <div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className={`inline-grid h-9 w-9 place-items-center rounded-lg ring-1 ${bg} ${ring}`}>
                <Icon size={17} className={accent} strokeWidth={2} />
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight text-ink">{value}</div>
              <div className="mt-1 text-xs font-medium text-steel">{label}</div>
            </div>
          ))}
        </div>

        {/* Table panel */}
        <div className="mt-7 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
                  className="w-64 rounded-xl border border-black/10 py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-steel-light focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                />
              </div>
              <div className="relative">
                <SlidersHorizontal size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-light" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Filter by status"
                  className="appearance-none rounded-xl border border-black/10 py-2.5 pl-10 pr-9 text-sm text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
                >
                  <option value="ALL">All statuses</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_STYLE[s].label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState hasAny={bookings.length > 0} onClear={() => { setQ(""); setFilter("ALL"); }} />
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden w-full text-sm lg:table">
                <thead>
                  <tr className="border-b border-black/5 text-left text-[11px] uppercase tracking-wider text-steel">
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Scheduled</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
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
                      <td className="px-4 py-4"><StatusSelect b={b} onChange={updateStatus} /></td>
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

              {/* Mobile cards */}
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
                          <StatusChip status={b.status} />
                        </div>
                        <dl className="mt-3 space-y-1 text-sm">
                          <div className="flex gap-2"><dt className="text-steel">Vehicle</dt><dd className="text-ink">{b.vehicleMake} {b.vehicleModel}</dd></div>
                          <div className="flex gap-2"><dt className="text-steel">Service</dt><dd className="text-ink">{b.service.replace(/_/g, " ").toLowerCase()}</dd></div>
                          <div className="flex gap-2"><dt className="text-steel">Date</dt><dd className="text-ink">{new Date(b.preferredDate).toLocaleDateString()}</dd></div>
                        </dl>
                        <div className="mt-4 flex items-center gap-2">
                          <StatusSelect b={b} onChange={updateStatus} />
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
      </>
    </AdminShell>
  );
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.PENDING;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${s.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function StatusSelect({ b, onChange }: { b: Booking; onChange: (id: string, s: string) => void }) {
  const s = STATUS_STYLE[b.status] ?? STATUS_STYLE.PENDING;
  return (
    <div className="relative inline-flex items-center">
      <span className={`pointer-events-none absolute left-2.5 h-1.5 w-1.5 rounded-full ${s.dot}`} />
      <select
        value={b.status}
        onChange={(e) => onChange(b.id, e.target.value)}
        aria-label={`Status for ${b.name}`}
        className={`appearance-none rounded-full py-1.5 pl-6 pr-7 text-xs font-semibold ring-1 ${s.chip} cursor-pointer focus:outline-none focus:ring-2 focus:ring-signal/40`}
      >
        {STATUSES.map((v) => <option key={v} value={v}>{STATUS_STYLE[v].label}</option>)}
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
          <p className="mt-1.5 text-sm text-steel">Try a different search term or status.</p>
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
