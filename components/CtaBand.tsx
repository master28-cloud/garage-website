import Link from "next/link";

export default function CtaBand({
  title = "Ready when you are.",
  body = "Tell us the symptom. We'll tell you what it needs, what it costs, and how long it takes — before you commit.",
  cta = "Book a service"
}: { title?: string; body?: string; cta?: string }) {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-signal px-8 py-16 text-center sm:px-16 sm:py-20">
          {/* soft depth, no extra asset needed */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-black/10" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[2rem] font-bold leading-tight tracking-tightest text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/90">{body}</p>
            <Link
              href="/#contact"
              className="mt-9 inline-flex items-center justify-center rounded-full bg-ink px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 ease-smooth hover:scale-[1.02] hover:bg-ink-soft"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
