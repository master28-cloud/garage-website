"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Loader2, Check, CarFront, CalendarDays, Wrench, MessageCircle, RotateCcw, Ban,
  type LucideIcon
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { LAST_REF_KEY } from "@/lib/booking";

type Step = { name: string; state: "done" | "current" | "upcoming" };
type Result = {
  reference: string;
  firstName: string;
  vehicle: string;
  service: string;
  preferredDate: string;
  updatedAt: string;
  outcome: "active" | "complete" | "closed";
  stage: { name: string; chip: React.CSSProperties; dot: string };
  steps: Step[];
};

const field =
  "mt-1.5 w-full rounded-xl border border-paper-line bg-white px-4 py-3 text-ink " +
  "placeholder:text-steel-light focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/25";
const label = "text-[11px] font-semibold uppercase tracking-[0.14em] text-ink";

function ago(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (mins < 60) return rtf.format(-mins, "minute");
  const hours = Math.round(mins / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-Math.round(hours / 24), "day");
}

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export default function RepairTracker({ whatsapp }: { whatsapp: string }) {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const refInput = useRef<HTMLInputElement>(null);

  // Offer back the reference from the link (?ref=) or the last booking made here.
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(LAST_REF_KEY); } catch {}
    const initial = new URLSearchParams(window.location.search).get("ref") || saved;
    if (initial) setReference(initial.toUpperCase().slice(0, 12));
  }, []);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone })
      });
      // The server can return an HTML error page, so never assume JSON.
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Tracking is unavailable right now. Please message us on WhatsApp.");
      }
      setResult(data as Result);
    } catch (err: unknown) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setReference("");
    setPhone("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    refInput.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src="/images/hero-workshop.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

        <div className="container-x relative grid gap-12 pb-20 pt-36 sm:pb-24 sm:pt-44 lg:grid-cols-[1fr_26rem] lg:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="mb-7 text-sm text-white/45">
              <Link href="/" className="transition-colors hover:text-signal">Home</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="text-white/75">Track your repair</span>
            </nav>

            <p className="eyebrow">Track your repair</p>
            <h1 className="mt-4 text-[2.75rem] font-bold leading-[0.98] tracking-tightest sm:text-6xl lg:text-7xl">
              Where&apos;s my car?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              Follow your vehicle through the workshop stage by stage, on the same job board our
              service advisors update as the work moves.
            </p>

            <ol className="mt-12 grid max-w-2xl gap-6 sm:grid-cols-3">
              {[
                "Find the APG reference in your WhatsApp booking message",
                "Enter it with the phone number you booked with",
                "See the stage your car is at right now"
              ].map((t, i) => (
                <li key={t} className="border-t border-white/15 pt-4">
                  <span className="font-mono text-sm font-semibold text-signal">0{i + 1}</span>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{t}</p>
                </li>
              ))}
            </ol>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl bg-white p-7 text-ink shadow-2xl shadow-black/40 sm:p-8">
            <h2 className="text-xl font-bold">Check your booking</h2>

            <div className="mt-6">
              <label htmlFor="track-ref" className={label}>Booking reference</label>
              <input
                ref={refInput}
                id="track-ref"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                required
                maxLength={12}
                placeholder="APG-7K3Q9X"
                autoComplete="off"
                spellCheck={false}
                className={`${field} font-mono uppercase tracking-wider`}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="track-phone" className={label}>Phone number</label>
              <input
                id="track-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="07XX XXX XXX"
                autoComplete="tel"
                className={field}
              />
            </div>

            {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>}

            <button disabled={loading} className="btn btn-solid mt-6 w-full disabled:opacity-60">
              {loading
                ? <><Loader2 className="animate-spin" size={18} /> Checking…</>
                : <><Search size={18} /> Track my car</>}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-steel">
              We only show the stage, vehicle and dates, never your contact details.
            </p>
          </form>
        </div>
      </section>

      <div ref={resultRef} aria-live="polite" className="scroll-mt-16">
        {result && (
          <section className="section bg-paper">
            <div className="container-x">
              <TrackResult r={result} whatsapp={whatsapp} onReset={reset} />
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function TrackResult({ r, whatsapp, onReset }: { r: Result; whatsapp: string; onReset: () => void }) {
  const ask = buildWhatsAppUrl(`Hello AutoPro, I'm checking on my booking ${r.reference}.`, whatsapp);
  const facts: { icon: LucideIcon; k: string; v: string }[] = [
    { icon: CarFront,     k: "Vehicle",    v: r.vehicle },
    { icon: Wrench,       k: "Service",    v: r.service },
    { icon: CalendarDays, k: "Booked for", v: day(r.preferredDate) }
  ];
  const heading =
    r.outcome === "complete" ? `All done, ${r.firstName}.` :
    r.outcome === "closed"   ? "This booking is closed." :
                               `Hi ${r.firstName}, here's your car.`;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-sm font-semibold tracking-wider text-steel">Booking {r.reference}</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tightest text-ink sm:text-5xl">{heading}</h2>
        </div>
        <span className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-semibold" style={r.stage.chip}>
          <span className="relative flex h-2.5 w-2.5">
            {r.outcome === "active" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: r.stage.dot }} />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: r.stage.dot }} />
          </span>
          {r.stage.name}
        </span>
      </div>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-paper-line ring-1 ring-paper-line sm:grid-cols-3">
        {facts.map(({ icon: Icon, k, v }) => (
          <div key={k} className="bg-white p-6">
            <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">
              <Icon size={15} className="text-signal" /> {k}
            </dt>
            <dd className="mt-2 text-lg font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {r.outcome === "closed" ? (
        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-paper-line bg-white p-7">
          <Ban className="mt-0.5 shrink-0 text-steel" size={22} />
          <p className="leading-relaxed text-steel">
            This booking is marked <strong className="text-ink">{r.stage.name}</strong>. If that
            doesn&apos;t look right, message us and we&apos;ll sort it out.
          </p>
        </div>
      ) : (
        <Stepper steps={r.steps} />
      )}

      <div className="mt-10 flex flex-col gap-5 border-t border-paper-line pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-steel">Last updated {ago(r.updatedAt)}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={ask} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
            <MessageCircle size={18} /> Ask about my car
          </a>
          <button type="button" onClick={onReset}
                  className="btn border border-paper-line bg-white text-ink hover:border-ink/25">
            <RotateCcw size={16} /> Track another
          </button>
        </div>
      </div>
    </div>
  );
}

const SR_STATE: Record<Step["state"], string> = {
  done: "Completed: ",
  current: "Current stage: ",
  upcoming: "Upcoming: "
};

function Stepper({ steps }: { steps: Step[] }) {
  const n = steps.length;
  const at = steps.findIndex((s) => s.state === "current");
  // With no current step every stage is done, so the rail runs full length.
  const fill = n > 1 ? (at === -1 ? 1 : at / (n - 1)) : 1;

  return (
    <div className="mt-6 rounded-2xl border border-paper-line bg-white p-7 sm:p-10">
      {/* Wide screens: a horizontal rail between the dot centres */}
      <div className="relative hidden md:block">
        <div
          className="absolute top-5 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-paper-line"
          style={{ left: `${50 / n}%`, right: `${50 / n}%` }}
        >
          <motion.div
            className="h-full rounded-full bg-signal"
            initial={{ width: 0 }}
            animate={{ width: `${fill * 100}%` }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => (
            <li key={`${s.name}-${i}`} className="flex flex-col items-center px-2 text-center">
              <Dot state={s.state} delay={0.25 + i * 0.12} />
              <span className={`mt-4 text-sm font-semibold ${s.state === "upcoming" ? "text-steel" : "text-ink"}`}>
                <span className="sr-only">{SR_STATE[s.state]}</span>
                {s.name}
              </span>
              {s.state === "current" && <NowTag className="mt-2" />}
            </li>
          ))}
        </ol>
      </div>

      {/* Phones: a vertical list */}
      <ol className="md:hidden">
        {steps.map((s, i) => (
          <li key={`${s.name}-${i}`} className="relative flex gap-4 pb-8 last:pb-0">
            {i < n - 1 && (
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-5 top-10 w-0.5 -translate-x-1/2 ${s.state === "done" ? "bg-signal" : "bg-paper-line"}`}
              />
            )}
            <Dot state={s.state} delay={0.1 + i * 0.1} />
            <div className="pt-2">
              <p className={`font-semibold ${s.state === "upcoming" ? "text-steel" : "text-ink"}`}>
                <span className="sr-only">{SR_STATE[s.state]}</span>
                {s.name}
              </p>
              {s.state === "current" && <NowTag className="mt-1.5" />}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NowTag({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white ${className}`}>
      Now
    </span>
  );
}

function Dot({ state, delay }: { state: Step["state"]; delay: number }) {
  const look =
    state === "done"    ? "border-signal bg-signal text-white" :
    state === "current" ? "border-signal bg-white" :
                          "border-paper-line bg-white";
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${look}`}
    >
      {state === "done" ? (
        <Check size={18} strokeWidth={3} />
      ) : state === "current" ? (
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-signal" />
        </span>
      ) : (
        <span className="h-2 w-2 rounded-full bg-paper-line" />
      )}
    </motion.span>
  );
}
