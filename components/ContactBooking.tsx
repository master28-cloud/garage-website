"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, CheckCircle2, Loader2, Route, ArrowRight } from "lucide-react";
import { SERVICE_OPTIONS, PREFILL_EVENT, LAST_REF_KEY, type BookingPrefill } from "@/lib/booking";

const field =
  "mt-1.5 w-full rounded-xl border border-paper-line bg-white px-4 py-3 text-ink " +
  "placeholder:text-steel-light focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25";

// Rings the fields another section has just filled in, then fades.
const fillable = " transition-[border-color,box-shadow] duration-500";
const filled = " !border-signal ring-2 ring-signal/25";

export default function ContactBooking({ phoneDisplay }: { phoneDisplay: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [flash, setFlash] = useState(false);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // The warning-light decoder and service planner hand over a service and
  // notes: as an event on this page, or as ?service=&notes= from another page.
  useEffect(() => {
    let timer: number | undefined;
    const apply = ({ service, notes }: BookingPrefill) => {
      if (service && serviceRef.current && SERVICE_OPTIONS.some((s) => s.v === service)) {
        serviceRef.current.value = service;
      }
      if (notes && notesRef.current) notesRef.current.value = notes.slice(0, 500);
      setPrefilled(true);
      setFlash(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setFlash(false), 2400);
    };

    const q = new URLSearchParams(window.location.search);
    if (q.has("service") || q.has("notes")) {
      apply({
        service: (q.get("service") ?? undefined) as BookingPrefill["service"],
        notes: q.get("notes") ?? undefined
      });
    }

    const onPrefill = (e: Event) => apply((e as CustomEvent<BookingPrefill>).detail);
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => {
      window.removeEventListener(PREFILL_EVENT, onPrefill);
      window.clearTimeout(timer);
    };
  }, []);

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

      setReference(data.reference);
      setWhatsappUrl(data.whatsappUrl);
      setState("success");
      try { localStorage.setItem(LAST_REF_KEY, data.reference); } catch {}
      // Long enough to note the reference before WhatsApp takes over.
      setTimeout(() => { window.location.href = data.whatsappUrl; }, 2500);
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

              {reference && (
                <div className="mt-6 border-t border-signal/20 pt-5">
                  <p className="text-sm text-steel">Your booking reference</p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-ink">{reference}</p>
                  <p className="mt-2 text-sm text-steel">
                    Keep it handy. With your phone number it lets you{" "}
                    <Link
                      href={`/track?ref=${reference}`}
                      className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4"
                    >
                      track your repair
                    </Link>
                    .
                  </p>
                </div>
              )}
              {whatsappUrl && <a href={whatsappUrl} className="btn btn-solid mt-6">Open WhatsApp now</a>}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
              {prefilled && (
                <p className="rounded-xl bg-signal/10 px-4 py-3 text-sm text-ink sm:col-span-2">
                  We&apos;ve filled in the service and notes for you. Check them, then add your details.
                </p>
              )}

              <Input name="name"         label="Full name" required />
              <Input name="phone"        label="Phone number" required type="tel"
                     placeholder="07XX XXX XXX" pattern="^(\+254|0)[17]\d{8}$" />
              <Input name="email"        label="Email (optional)" type="email" />
              <Input name="vehicleMake"  label="Vehicle make" required placeholder="Toyota" />
              <Input name="vehicleModel" label="Vehicle model" required placeholder="Hilux" />
              <Input name="vehicleYear"  label="Year" type="number" min={1980} max={2030} placeholder="2018" />

              <div className="sm:col-span-2">
                <Label htmlFor="service">Service needed</Label>
                <select ref={serviceRef} id="service" name="service" required
                        className={field + fillable + (flash ? filled : "")}>
                  {SERVICE_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
                </select>
              </div>

              <Input name="preferredDate" label="Preferred date" required type="date" />

              <div className="sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea ref={notesRef} id="notes" name="notes" rows={3} maxLength={500}
                          className={field + fillable + (flash ? filled : "")}
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
              <li className="flex gap-3.5">
                <Clock className="mt-0.5 shrink-0 text-signal" size={19} />
                <span>
                  Monday–Friday · 7:30am – 6:30pm
                  <br />
                  Saturday · 8:30am – 5:00pm
                </span>
              </li>
            </ul>
          </div>

          <Link href="/track"
                className="group flex items-center gap-4 rounded-2xl border border-paper-line bg-white p-6 transition-colors hover:border-ink/20">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
              <Route size={20} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-ink">Already booked?</span>
              <span className="block text-sm text-steel">Track your repair stage by stage.</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-steel transition-transform group-hover:translate-x-1" />
          </Link>

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
