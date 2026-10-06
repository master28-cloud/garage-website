import Image from "next/image";
import Link from "next/link";

export default function PageHero({
  eyebrow, title, lede, image, imageAlt, stats
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  image: string;
  imageAlt: string;
  stats?: [string, string][];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/55" />

      <div className="container-x relative pb-20 pt-36 sm:pb-24 sm:pt-44">
        <nav aria-label="Breadcrumb" className="mb-7 text-sm text-white/45">
          <Link href="/" className="transition-colors hover:text-signal">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/75">{title}</span>
        </nav>

        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-[2.75rem] font-bold leading-[0.98] tracking-tightest text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{lede}</p>
        )}

        {stats && (
          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-7">
            {stats.map(([v, l]) => (
              <div key={l}>
                <dt className="text-3xl font-bold text-signal">{v}</dt>
                <dd className="mt-1 text-sm text-white/60">{l}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
