"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Power } from "lucide-react";
import { prefillBooking, type ServiceValue } from "@/lib/booking";
import * as Icons from "./warningLightIcons";

type Urgency = "stop" | "today" | "soon" | "ok";
type Advice = { urgency: Urgency; meaning: string; steps: string[] };
type Light = {
  id: string;
  name: string;
  short: string;
  tone: "red" | "amber";
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  service: ServiceValue;
  steady: Advice;
  flashing?: Advice;
};

// Advice follows the UK National Highways / CIHT guidance and insurers' guides:
// red means stop or get help, amber means get it checked soon, and a flashing
// engine light is more urgent than a steady one.
const LIGHTS: Light[] = [
  {
    id: "check-engine", name: "Check engine", short: "Engine", tone: "amber",
    Icon: Icons.CheckEngine, service: "ENGINE_DIAGNOSTICS",
    steady: {
      urgency: "soon",
      meaning:
        "The engine computer has logged a fault. It can be as small as a loose fuel cap or as serious as a failing sensor or a misfire. Only a diagnostic scan tells you which.",
      steps: [
        "Check the fuel cap is tight. It's the cheapest fix there is.",
        "Drive gently and avoid heavy loads or long trips.",
        "Book a diagnostic scan this week. The fault code tells us exactly where to look."
      ]
    },
    flashing: {
      urgency: "stop",
      meaning:
        "A flashing engine light means a misfire bad enough to overheat and destroy the catalytic converter, an expensive part to replace.",
      steps: [
        "Ease off the accelerator and stop somewhere safe.",
        "Don't keep driving. Call us and we'll arrange recovery.",
        "Have it scanned before you use the car again."
      ]
    }
  },
  {
    id: "oil", name: "Oil pressure", short: "Oil", tone: "red",
    Icon: Icons.OilPressure, service: "ENGINE_DIAGNOSTICS",
    steady: {
      urgency: "stop",
      meaning:
        "Oil pressure has dropped, so the engine's moving parts are no longer properly lubricated. A few minutes of driving can wreck the engine.",
      steps: [
        "Stop as soon as it's safe and switch the engine off.",
        "Wait five minutes, then check the oil level on the dipstick.",
        "If the light stays on after topping up, don't drive. Call us for recovery."
      ]
    }
  },
  {
    id: "battery", name: "Charging system", short: "Battery", tone: "red",
    Icon: Icons.Battery, service: "ELECTRICAL",
    steady: {
      urgency: "today",
      meaning:
        "The battery isn't being charged, usually because of a failing alternator or a broken drive belt. The car is running on whatever charge is left.",
      steps: [
        "Switch off the AC, radio and phone chargers to save power.",
        "Drive straight to us or somewhere safe. Don't switch off until you arrive, as it may not restart.",
        "If the steering turns heavy or the temperature climbs, the belt has probably snapped. Stop."
      ]
    }
  },
  {
    id: "coolant", name: "Engine temperature", short: "Temp", tone: "red",
    Icon: Icons.CoolantTemp, service: "ENGINE_DIAGNOSTICS",
    steady: {
      urgency: "stop",
      meaning:
        "The engine is overheating, often from low coolant, a leak, a failed fan or a stuck thermostat. Driving on can warp the cylinder head.",
      steps: [
        "Pull over safely and switch the engine off.",
        "Never open the radiator cap while it's hot. Wait at least 30 minutes.",
        "Check the coolant level once it's cool. If it's low or the light comes back, call us."
      ]
    }
  },
  {
    id: "brake", name: "Brake system", short: "Brakes", tone: "red",
    Icon: Icons.Brake, service: "BRAKE_SUSPENSION",
    steady: {
      urgency: "stop",
      meaning:
        "Either the handbrake is still on, the brake fluid is low, or the braking system has a fault.",
      steps: [
        "Make sure the handbrake is fully released.",
        "If the light stays on, stop safely, because braking can change without warning.",
        "Don't drive on. Call us and we'll come to you or arrange recovery."
      ]
    }
  },
  {
    id: "abs", name: "ABS", short: "ABS", tone: "amber",
    Icon: Icons.Abs, service: "BRAKE_SUSPENSION",
    steady: {
      urgency: "soon",
      meaning:
        "The anti-lock braking system has a fault. Your normal brakes still work, but the wheels can lock under hard braking.",
      steps: [
        "Leave extra distance and brake progressively, especially in rain or on murram.",
        "If the red brake light comes on too, stop. That's a different and serious fault.",
        "Book a brake check soon. It's often a dirty or failed wheel-speed sensor."
      ]
    }
  },
  {
    id: "tyres", name: "Tyre pressure", short: "Tyres", tone: "amber",
    Icon: Icons.TyrePressure, service: "WHEEL_ALIGNMENT",
    steady: {
      urgency: "soon",
      meaning: "One or more tyres is under-inflated, or a pressure sensor has failed.",
      steps: [
        "Check all four tyres at the next petrol station, ideally when they're cold.",
        "Look for nails, cuts or signs of a slow puncture.",
        "If the light returns after inflating, bring it in and we'll find the leak or the faulty sensor."
      ]
    }
  },
  {
    id: "airbag", name: "Airbag (SRS)", short: "Airbag", tone: "red",
    Icon: Icons.Airbag, service: "ELECTRICAL",
    steady: {
      urgency: "soon",
      meaning:
        "There's a fault in the airbag or seat-belt tensioner system. The car drives normally, but the airbags may not deploy in a crash.",
      steps: [
        "You can still drive, but you're not as protected as you should be.",
        "Check nothing is jammed under the front seats. Loose wiring there is a common cause.",
        "Book a check soon. Never try to repair airbag wiring yourself."
      ]
    }
  },
  {
    id: "steering", name: "Power steering", short: "Steering", tone: "amber",
    Icon: Icons.PowerSteering, service: "BRAKE_SUSPENSION",
    steady: {
      urgency: "today",
      meaning:
        "Steering assistance has failed or is limited. The car still steers, but it will feel much heavier, especially at low speed.",
      steps: [
        "Grip the wheel firmly and slow down.",
        "Avoid tight parking manoeuvres until it's fixed.",
        "Drive to us today. Hydraulic systems may just need fluid, and electric ones need a scan."
      ]
    }
  },
  {
    id: "traction", name: "Stability control", short: "Stability", tone: "amber",
    Icon: Icons.Traction, service: "BRAKE_SUSPENSION",
    steady: {
      urgency: "soon",
      meaning:
        "Traction or stability control is switched off or has a fault, so the car won't step in if the wheels start to slip.",
      steps: [
        "Check it hasn't been switched off by accident. Look for an OFF button.",
        "Drive gently in rain, on murram and through corners.",
        "If it stays on, book a check. It shares sensors with the ABS."
      ]
    },
    flashing: {
      urgency: "ok",
      meaning:
        "Flashing means the system is working right now. The tyres were slipping, and it is cutting power or braking a wheel to keep you straight.",
      steps: [
        "Ease off the accelerator.",
        "Steer smoothly and avoid sudden braking.",
        "No booking needed, unless it flashes often on dry roads. That can point to worn tyres."
      ]
    }
  }
];

const URGENCY: Record<Urgency, { label: string; cls: string }> = {
  stop:  { label: "Stop safely now",   cls: "bg-[#FF453A]/15 text-[#FF9A92] ring-[#FF453A]/35" },
  today: { label: "Get it seen today", cls: "bg-[#FF7A1A]/15 text-[#FFB27D] ring-[#FF7A1A]/35" },
  soon:  { label: "Book a check soon", cls: "bg-[#FFB21E]/15 text-[#FFD587] ring-[#FFB21E]/35" },
  ok:    { label: "System working",    cls: "bg-[#30D158]/15 text-[#86E5A6] ring-[#30D158]/35" }
};

const TONE = { red: "#FF453A", amber: "#FFB21E" } as const;

const COLOUR_KEY = [
  { colour: TONE.red,   name: "Red",                    text: "Serious. Stop as soon as it's safe, or call for help." },
  { colour: TONE.amber, name: "Amber",                  text: "Get it checked soon. Usually fine to drive on carefully." },
  { colour: "#30D158",  name: "Green, blue or white",   text: "Information only, such as headlights or cruise control." }
];

// Unlit lamps keep the same filter list so the glow fades rather than snaps.
const UNLIT: React.CSSProperties = {
  color: "#5C636E",
  filter: "drop-shadow(0 0 0 transparent) drop-shadow(0 0 0 transparent)"
};
const litStyle = (tone: keyof typeof TONE): React.CSSProperties => ({
  color: TONE[tone],
  filter: `drop-shadow(0 0 4px ${TONE[tone]}b3) drop-shadow(0 0 14px ${TONE[tone]}66)`
});

export default function WarningLights() {
  const [selected, setSelected] = useState(LIGHTS[0].id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mode, setMode] = useState<"steady" | "flashing">("steady");
  const [ignition, setIgnition] = useState(false);
  const clusterRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();

  const light = LIGHTS.find((l) => l.id === selected) ?? LIGHTS[0];
  const flashing = mode === "flashing" && !!light.flashing;
  const advice = (flashing && light.flashing) || light.steady;

  const bulbCheck = useCallback(() => {
    window.clearTimeout(timer.current);
    setIgnition(true);
    timer.current = window.setTimeout(() => setIgnition(false), 1600);
  }, []);

  // A real car lights every warning lamp for a moment at ignition. Do the same
  // the first time the cluster scrolls into view.
  useEffect(() => {
    const el = clusterRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timer.current = window.setTimeout(bulbCheck, 450);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [bulbCheck]);

  function choose(id: string) {
    setSelected(id);
    setMode("steady");
  }

  return (
    <section id="warning-lights" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-signal/10 blur-3xl"
      />

      <div className="container-x relative">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Dashboard decoder</p>
            <h2 className="h-section mt-4 text-white">A light just came on. Now what?</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              Tap the symbol you can see on your dashboard to find out what it means, how urgent it
              is and what to do next.
            </p>
          </div>
          <p className="text-sm text-white/40">Tap a light · Steady or flashing</p>
        </div>

        {/* Phones stack cluster, advice, colour key. On wide screens the advice
            spans both rows on the right and the key fills the space under the
            cluster, so the two columns finish level. */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_1fr]">
          <div
            ref={clusterRef}
            className="rounded-[2rem] border border-white/10 bg-[radial-gradient(120%_100%_at_50%_0%,#1C1F23_0%,#0A0B0C_65%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_40px_90px_-30px_rgba(0,0,0,0.9)] sm:p-7 lg:col-start-1 lg:row-start-1"
          >
            <div className="mb-4 flex items-center justify-between px-1 sm:mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Instrument cluster
              </span>
              <button
                type="button"
                onClick={bulbCheck}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/35 hover:text-white"
              >
                <Power size={13} /> Bulb check
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
              {LIGHTS.map((l, i) => {
                const isSelected = l.id === selected;
                const lit = ignition || isSelected || hovered === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={l.name}
                    onClick={() => choose(l.id)}
                    onMouseEnter={() => setHovered(l.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`flex aspect-square flex-col items-center justify-center rounded-2xl transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                      isSelected ? "bg-white/[0.07] ring-1 ring-white/15" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <l.Icon
                      className={`h-8 w-8 sm:h-11 sm:w-11 ${isSelected && flashing ? "wl-blink" : ""}`}
                      style={{
                        ...(lit ? litStyle(l.tone) : UNLIT),
                        transitionProperty: "color, filter",
                        transitionDuration: "250ms",
                        transitionDelay: ignition ? `${i * 45}ms` : "0ms"
                      }}
                    />
                    <span
                      className={`mt-2 hidden text-[10px] font-semibold uppercase tracking-[0.12em] sm:block ${
                        isSelected ? "text-white" : "text-white/45"
                      }`}
                    >
                      {l.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${light.id}-${flashing ? "flashing" : "steady"}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 sm:p-9"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-black/50 ring-1 ring-white/10">
                    <light.Icon className={`h-10 w-10 ${flashing ? "wl-blink" : ""}`} style={litStyle(light.tone)} />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{light.name}</h3>
                    <p className="mt-1 text-sm text-white/55">
                      {light.tone === "red" ? "Red warning light" : "Amber warning light"}
                    </p>
                  </div>
                </div>

                {light.flashing && (
                  <div
                    role="radiogroup"
                    aria-label="Is the light steady or flashing?"
                    className="mt-7 inline-flex rounded-full bg-black/40 p-1 ring-1 ring-white/10"
                  >
                    {(["steady", "flashing"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={mode === m}
                        onClick={() => setMode(m)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                          mode === m ? "bg-white text-ink" : "text-white/65 hover:text-white"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-7">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ${URGENCY[advice.urgency].cls}`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {URGENCY[advice.urgency].label}
                  </span>
                </div>
                <p className="mt-5 text-lg leading-relaxed text-white/85">{advice.meaning}</p>

                <h4 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                  What to do
                </h4>
                <ol className="mt-4 space-y-3.5">
                  {advice.steps.map((s, i) => (
                    <li key={s} className="flex gap-3.5 text-white/75">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>

                {advice.urgency !== "ok" && (
                  <button
                    type="button"
                    className="btn btn-solid mt-9"
                    onClick={() =>
                      prefillBooking({
                        service: light.service,
                        notes: `Dashboard warning light: ${light.name}${light.flashing ? ` (${mode})` : ""}.`
                      })
                    }
                  >
                    Book a check for this light <ArrowRight size={17} />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7 lg:col-start-1 lg:row-start-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              What the colours mean
            </p>
            <ul className="mt-5 space-y-4">
              {COLOUR_KEY.map((k) => (
                <li key={k.name} className="flex gap-3.5">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: k.colour, boxShadow: `0 0 10px ${k.colour}` }}
                  />
                  <p className="text-sm leading-relaxed text-white/65">
                    <strong className="font-semibold text-white">{k.name}.</strong> {k.text}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-sm text-white/60">
              A flashing light is more urgent than a steady one.
            </p>
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-white/45">
          Symbols and colours vary between manufacturers, so your owner&apos;s manual has the final
          word. If you&apos;re ever unsure, stop somewhere safe and call us.
        </p>
      </div>
    </section>
  );
}
