import Image from "next/image";
import Link from "next/link";

/**
 * Volkswagen Golf GTI Mk7.5 — the facelift is identifiable by the red grille
 * stripe continuing into the LED headlight cluster.
 *
 * The photograph is graded into the brand palette rather than dropped in raw:
 * a multiply pass cools the mid-tones toward graphite, a soft-light pass warms
 * the highlights toward signal orange, then a directional scrim, a vignette and
 * a little grain settle it into the page. All CSS — no second asset, no canvas
 * work needed at runtime.
 */

// feTurbulence grain, inlined so it costs no extra request
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <filter id='n'>
         <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>
         <feColorMatrix type='saturate' values='0'/>
       </filter>
       <rect width='160' height='160' filter='url(#n)' opacity='0.5'/>
     </svg>`
  );

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* 1 — the car */}
      <Image
        src="https://images.pexels.com/photos/20809165/pexels-photo-20809165.jpeg?auto=compress&cs=tinysrgb&w=2400"
        alt="Volkswagen Golf GTI Mk7.5 on wet ground outside the AutoPro Garage workshop"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[30%_center] sm:object-center"
      />

      {/* 2 — grade the mid-tones toward graphite */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-multiply"
        style={{ background: "linear-gradient(105deg,#1A1E24 0%,#0C0D0E 55%,#141414 100%)", opacity: 0.55 }}
      />

      {/* 3 — warm the highlights toward the brand hue */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-soft-light"
        style={{ background: "radial-gradient(70% 90% at 22% 60%,#FF5A1F 0%,transparent 70%)", opacity: 0.5 }}
      />

      {/* 4 — directional scrim; heaviest where the copy sits */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top,#0C0D0E 0%,rgba(12,13,14,.78) 28%,rgba(12,13,14,.3) 62%,rgba(12,13,14,.55) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden lg:block"
        style={{ background: "linear-gradient(to left,rgba(12,13,14,.88) 0%,rgba(12,13,14,.5) 38%,transparent 68%)" }}
      />

      {/* 5 — vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 95% at 50% 45%,transparent 48%,rgba(0,0,0,.55) 100%)" }}
      />

      {/* 6 — grain, so the gradients do not band on wide screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "160px 160px" }}
      />

      {/* content — right of the car, over the clean ground */}
      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-28 sm:justify-center sm:pb-24">
        <div className="max-w-3xl lg:ml-auto lg:max-w-2xl lg:text-right">
          <p className="eyebrow mb-5">Nairobi · Established 2011</p>

          <h1 className="text-[3.25rem] font-bold leading-[0.95] tracking-tightest text-white sm:text-7xl lg:text-[5.25rem]">
            Drive in broken.
            <br />
            <span className="text-signal">Drive out brilliant.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/85 lg:ml-auto">
            Precision engineered. Passion driven. Full-service diagnostics, panel beating
            and restoration — trusted by Kenya&apos;s most discerning drivers.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href="/#contact" className="btn btn-solid">Book a Service</Link>
            <Link href="/our-work" className="btn btn-outline">View Our Work</Link>
          </div>
        </div>
      </div>

      {/* stat strip */}
      <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-white/15 bg-ink/45 backdrop-blur-sm sm:block">
        <div className="container-x grid grid-cols-4 divide-x divide-white/15">
          {[
            ["18,000+", "Vehicles serviced"],
            ["24", "Certified technicians"],
            ["12", "Service bays"],
            ["97%", "Would recommend"]
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-5 text-center sm:px-6">
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="mt-0.5 text-xs text-white/65">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
