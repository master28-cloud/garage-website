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
  { v: "OTHER",                   l: "Other" }
];

export default function ContactBooking() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setError("");

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState("success");
      // Redirect user to WhatsApp with pre-filled message
      setTimeout(() => { window.location.href = data.whatsappUrl; }, 900);
    } catch (err: unknown) {
      setState("error");
      setError(err instanceof Error ? err.message : "Please try again");
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28 bg-brand-sand">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        {/* Form */}
        <div>
          <p className="text-brand-blue font-semibold uppercase tracking-widest text-xs">Book a service</p>
          <h2 className="mt-2 text-4xl font-bold text-brand-navy sm:text-5xl">Let&apos;s get you back on the road.</h2>
          <p className="mt-3 max-w-xl text-slate-600">Fill the form — we&apos;ll record your booking and open WhatsApp so our service advisor can confirm within minutes.</p>

          {state === "success" ? (
            <div className="mt-8 rounded-2xl border border-brand-green/30 bg-brand-green/5 p-6 text-brand-navy">
              <CheckCircle2 className="text-brand-green" />
              <h3 className="mt-3 font-bold text-xl">Booking received!</h3>
              <p className="mt-1 text-sm">Opening WhatsApp to confirm with our team…</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
              <Input name="name" label="Full name" required />
              <Input name="phone" label="Phone (e.g. 07…)" required type="tel" pattern="^(\+254|0)[17]\d{8}$" />
              <Input name="email" label="Email (optional)" type="email" />
              <Input name="vehicleMake" label="Vehicle make (e.g. Toyota)" required />
              <Input name="vehicleModel" label="Vehicle model (e.g. Prado)" required />
              <Input name="vehicleYear" label="Year" type="number" min={1980} max={2030} />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-navy">Service needed</label>
                <select name="service" required className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
                  {SERVICES.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
              </div>
              <Input name="preferredDate" label="Preferred date" required type="date" />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-navy">Notes</label>
                <textarea name="notes" rows={3} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" placeholder="Anything we should know?" />
              </div>
              <label className="sm:col-span-2 flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" name="consentPrivacy" value="1" required className="mt-1" />
                <span>I agree to the <a href="/privacy" className="underline">privacy policy</a> and consent to AutoPro contacting me about this booking.</span>
              </label>
              <label className="sm:col-span-2 flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" name="consentMarket" value="1" className="mt-1" />
                <span>I&apos;d like occasional service reminders and offers (optional).</span>
              </label>
              {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
              <button disabled={state === "loading"} className="btn btn-primary sm:col-span-2 disabled:opacity-60">
                {state === "loading" ? (<><Loader2 className="animate-spin" size={18} /> Submitting…</>) : "Book & Continue on WhatsApp"}
              </button>
            </form>
          )}
        </div>

        {/* Info / Map */}
        <aside className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-brand-navy">Visit the workshop</h3>
            <ul className="mt-4 space-y-3 text-slate-700 text-sm">
              <li className="flex gap-3"><MapPin className="text-brand-blue shrink-0" size={18} /> Enterprise Road, Industrial Area, Nairobi</li>
              <li className="flex gap-3"><Phone className="text-brand-blue shrink-0" size={18} /> +254 727 718 981</li>
              <li className="flex gap-3"><Clock className="text-brand-blue shrink-0" size={18} /> Mon–Sat · 7:30am – 6:30pm</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <iframe
              title="AutoPro Garage location"
              src="https://www.google.com/maps?q=Enterprise+Road,+Nairobi&output=embed"
              width="100%" height="320" style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Input({ name, label, ...rest }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-brand-navy">{label}</label>
      <input id={name} name={name} {...rest}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-brand-green focus:ring-2 focus:ring-brand-green/30 outline-none" />
    </div>
  );
}
