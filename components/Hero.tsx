import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      {/* Background image — luxury SUV being serviced in Nairobi, from Unsplash (Africa-sourced imagery) */}
      <Image
        src="https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1920&q=80"
        alt="Luxury SUV being serviced under studio-quality lighting at AutoPro Garage"
        fill priority sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/90 via-brand-navy/70 to-brand-blue/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(25,195,125,0.15),_transparent_60%)]" />

      <div className="container-x relative z-10 flex min-h-[88vh] flex-col justify-center text-white">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full border border-brand-green/40 bg-brand-green/10 px-4 py-1 text-xs uppercase tracking-widest text-brand-green">
            Nairobi · Est. 2011
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            Drive In Broken.
            <br />
            <span className="gradient-text">Drive Out Brilliant.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Precision engineered. Passion driven. Your car&apos;s second home.
            Trusted by Kenya&apos;s most discerning drivers for diagnostics, panel beating & complete restoration.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="#contact" className="btn btn-primary">Book a Service →</Link>
            <Link href="#gallery" className="btn btn-ghost">View Our Work</Link>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6 text-sm text-white/80">
            <div><dt className="text-brand-green text-2xl font-bold">18k+</dt><dd>Vehicles serviced</dd></div>
            <div><dt className="text-brand-green text-2xl font-bold">97%</dt><dd>Customer satisfaction</dd></div>
            <div><dt className="text-brand-green text-2xl font-bold">24</dt><dd>Certified technicians</dd></div>
          </dl>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs animate-bounce">
        ↓ Scroll
      </div>
    </section>
  );
}
