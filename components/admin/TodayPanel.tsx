"use client";
import { CalendarCheck } from "lucide-react";
import ContactActions from "./ContactActions";
import { prettyPhone } from "@/lib/contact";

// Only the fields this panel renders — status is shown on the main table.
type Booking = {
  id: string; name: string; phone: string; vehicleMake: string;
  vehicleModel: string; service: string;
};

const initials = (n: string) =>
  n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

export default function TodayPanel({ bookings }: { bookings: Booking[] }) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/10">
          <CalendarCheck size={16} className="text-signal" />
        </span>
        <div>
          <h3 className="font-bold text-ink">In today</h3>
          <p className="text-xs text-steel">
            {bookings.length === 0
              ? "Nothing scheduled"
              : `${bookings.length} ${bookings.length === 1 ? "vehicle" : "vehicles"} expected`}
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p className="mt-8 pb-4 text-center text-sm text-steel">
          A clear day. Bookings scheduled for today appear here.
        </p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {bookings.map((b) => (
            <li key={b.id} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                {initials(b.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{b.name}</p>
                <p className="truncate text-xs text-steel">
                  {prettyPhone(b.phone)} · {b.vehicleMake} {b.vehicleModel}
                </p>
              </div>
              <ContactActions phone={b.phone} name={b.name} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
