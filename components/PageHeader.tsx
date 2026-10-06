import Link from "next/link";

export default function PageHeader({
  eyebrow, title, lede
}: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="bg-ink pb-16 pt-36 text-white">
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/50">
          <Link href="/" className="transition-colors hover:text-signal">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/80">{title}</span>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-[2.75rem] font-bold tracking-tightest sm:text-6xl">{title}</h1>
        {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{lede}</p>}
      </div>
    </header>
  );
}
