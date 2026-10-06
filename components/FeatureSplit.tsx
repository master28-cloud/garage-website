import Image from "next/image";

export default function FeatureSplit({
  eyebrow, title, body, points, image, imageAlt, flip = false
}: {
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
  image: string;
  imageAlt: string;
  flip?: boolean;
}) {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className={flip ? "lg:order-2" : ""}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 text-[2rem] font-bold leading-tight tracking-tightest text-ink sm:text-5xl">
            {title}
          </h2>
          <p className="lede mt-6">{body}</p>

          {points && (
            <ul className="mt-8 space-y-4">
              {points.map((p) => (
                <li key={p} className="flex gap-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  <span className="text-ink">{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`relative aspect-[5/4] overflow-hidden rounded-2xl bg-paper-warm ${flip ? "lg:order-1" : ""}`}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
