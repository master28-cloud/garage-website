"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string; name: string; phone: string; email: string | null;
  vehicleMake: string; vehicleModel: string; vehicleYear: number | null;
  service: string; preferredDate: string; status: string; notes: string | null;
  createdAt: string;
};
type Stats = { total: number; pending: number; confirmed: number; completed: number };

const STATUSES = ["PENDING","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED"] as const;

export default function DashboardClient({
  sessionEmail, initialBookings, stats
}: { sessionEmail: string; initialBookings: Booking[]; stats: Stats }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const router = useRouter();

  const filtered = bookings.filter((b) => {
    if (filter !== "ALL" && b.status !== filter) return false;
    if (!q) return true;
    const s = `${b.name} ${b.phone} ${b.vehicleMake} ${b.vehicleModel} ${b.service}`.toLowerCase();
    return s.includes(q.toLowerCase());
  });

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    if (res.ok) setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  const statCards = [
    { label: "Total (last 100)", value: stats.total },
    { label: "Pending",   value: stats.pending },
    { label: "Confirmed", value: stats.confirmed },
    { label: "Completed", value: stats.completed }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-navy text-white">
        <div className="container-x flex items-center justify-between py-5">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-white/60">Signed in as {sessionEmail}</p>
          </div>
          <button onClick={logout} className="btn btn-ghost">Sign out</button>
        </div>
      </header>

      <div className="container-x py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.label} className="card">
              <div className="text-xs uppercase tracking-widest text-brand-blue">{s.label}</div>
              <div className="mt-2 text-3xl font-extrabold text-brand-navy">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-brand-navy">Bookings</h2>
            <div className="flex flex-wrap gap-2">
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, phone, vehicle…"
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
                <option value="ALL">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-500 border-b">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">Customer</th>
                  <th className="py-2 pr-4">Vehicle</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b align-top">
                    <td className="py-3 pr-4 whitespace-nowrap text-slate-500">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-brand-navy">{b.name}</div>
                      <div className="text-xs text-slate-500">{b.phone}{b.email ? ` · ${b.email}` : ""}</div>
                    </td>
                    <td className="py-3 pr-4">{b.vehicleMake} {b.vehicleModel}{b.vehicleYear ? ` (${b.vehicleYear})` : ""}</td>
                    <td className="py-3 pr-4">{b.service.replace(/_/g, " ")}</td>
                    <td className="py-3 pr-4">{new Date(b.preferredDate).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-slate-500">No bookings match the filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
