import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      <Image
        src="/images/hero-workshop.jpg"
        alt="AutoPro Garage technicians changing a wheel on a van in the workshop"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center]"
      />
      {/* Legibility scrim — strongest where the copy sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
      <div className="absolute inset-0 bg-ink/20" />

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-28 sm:justify-center sm:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow mb-5">Nairobi · Established 2011</p>

          <h1 className="text-[3.25rem] font-bold leading-[0.95] tracking-tightest text-white sm:text-7xl lg:text-[5.5rem]">
            Drive in broken.
            <br />
            <span className="text-signal">Drive out brilliant.</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/85">
            Precision engineered. Passion driven. Full-service diagnostics, panel beating
            and restoration — trusted by Kenya&apos;s most discerning drivers.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/#contact" className="btn btn-solid">Book a Service</Link>
            <Link href="/our-work" className="btn btn-outline">View Our Work</Link>
          </div>
        </div>
      </div>

      {/* Bottom stat strip */}
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
