"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react";

const SERVICES = [
  { v: "ENGINE_DIAGNOSTICS",      l: "Engine Diagnostics" },
  { v: "PANEL_BEATING",           l: "Panel Beating & Spray" },
  { v: "WHEEL_ALIGNMENT",         l: "Wheel Alignment & Balancing" },
  { v: "BRAKE_SUSPENSION",        l: "Brake & Suspension" },
  { v: "AC_SERVICING",            l: "AC Servicing" },
  { v: "ELECTRICAL",              l: "Electrical Repairs" },
  { v: "PRE_PURCHASE_INSPECTION", l: "Pre-Purchase Inspection" },
  { v: "INSURANCE_CLAIM",         l: "Insurance Claim Repairs" },
  { v: "OTHER",                   l: "Something else" }
];

const field =
  "mt-1.5 w-full rounded-xl border border-paper-line bg-white px-4 py-3 text-ink " +
  "placeholder:text-steel-light focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25";

export default function ContactBooking({ phoneDisplay }: { phoneDisplay: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError("");

    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // The server can return an HTML error page, so never assume JSON.
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(
          data?.error ||
            `We couldn't reach the booking service. Please call us on ${phoneDisplay}.`
        );
      }

      setState("success");
      setTimeout(() => { window.location.href = data.whatsappUrl; }, 900);
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : "Please try again");
    }
  }

  return (
    <section id="contact" className="section bg-paper">
      <div className="container-x grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Book a service</p>
          <h2 className="h-section mt-4">Let&apos;s get you back on the road.</h2>
          <p className="lede mt-5 max-w-lg">
            Submit the form and we&apos;ll open WhatsApp with your booking details ready to
            send — a service advisor confirms within minutes.
          </p>

          {state === "success" ? (
            <div className="mt-10 rounded-2xl border border-signal/30 bg-signal/5 p-8">
              <CheckCircle2 className="text-signal" size={28} />
              <h3 className="mt-4 text-2xl font-bold text-ink">Booking received</h3>
              <p className="mt-2 text-steel">Opening WhatsApp to confirm with our team…</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
              <Input name="name"         label="Full name" required />
              <Input name="phone"        label="Phone number" required type="tel"
                     placeholder="07XX XXX XXX" pattern="^(\+254|0)[17]\d{8}$" />
              <Input name="email"        label="Email (optional)" type="email" />
              <Input name="vehicleMake"  label="Vehicle make" required placeholder="Toyota" />
              <Input name="vehicleModel" label="Vehicle model" required placeholder="Hilux" />
              <Input name="vehicleYear"  label="Year" type="number" min={1980} max={2030} placeholder="2018" />

              <div className="sm:col-span-2">
                <Label htmlFor="service">Service needed</Label>
                <select id="service" name="service" required className={field}>
                  {SERVICES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
              </div>

              <Input name="preferredDate" label="Preferred date" required type="date" />

              <div className="sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea id="notes" name="notes" rows={3} className={field}
                          placeholder="Anything we should know before you arrive?" />
              </div>

              <label className="flex items-start gap-3 text-sm text-steel sm:col-span-2">
                <input type="checkbox" name="consentPrivacy" value="1" required
                       className="mt-1 h-4 w-4 accent-signal" />
                <span>
                  I agree to the <a href="/privacy" className="font-medium text-ink underline">privacy policy</a> and
                  consent to AutoPro contacting me about this booking.
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-steel sm:col-span-2">
                <input type="checkbox" name="consentMarket" value="1"
                       className="mt-1 h-4 w-4 accent-signal" />
                <span>Send me occasional service reminders and offers (optional).</span>
              </label>

              {error && (
                <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">{error}</p>
              )}

              <button disabled={state === "loading"}
                      className="btn btn-solid mt-1 w-full disabled:opacity-60 sm:col-span-2">
                {state === "loading"
                  ? <><Loader2 className="animate-spin" size={18} /> Submitting…</>
                  : "Book & continue on WhatsApp"}
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-ink p-8 text-white">
            <h3 className="text-xl font-bold">Visit the workshop</h3>
            <ul className="mt-6 space-y-4 text-[15px]">
              <li className="flex gap-3.5"><MapPin className="shrink-0 text-signal" size={19} /> Enterprise Road, Industrial Area, Nairobi</li>
              <li className="flex gap-3.5"><Phone  className="shrink-0 text-signal" size={19} /> {phoneDisplay}</li>
              <li className="flex gap-3.5"><Clock  className="shrink-0 text-signal" size={19} /> Monday–Saturday · 7:30am – 6:30pm</li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-2xl border border-paper-line">
            <iframe
              title="AutoPro Garage location on Enterprise Road, Nairobi"
              src="https://www.google.com/maps?q=Enterprise+Road,+Nairobi&output=embed"
              width="100%" height="340" style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
      {children}
    </label>
  );
}

function Input({ name, label, ...rest }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <input id={name} name={name} className={field} {...rest} />
    </div>
  );
}
