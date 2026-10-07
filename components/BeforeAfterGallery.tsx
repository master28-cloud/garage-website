import { getGallery } from "@/lib/content";
import BeforeAfterSlider from "./BeforeAfterSlider";

export default async function BeforeAfterGallery() {
  const pairs = await getGallery();

  return (
    <section id="gallery" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      {/* low warm glow so the dark band has depth rather than a flat fill */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[36rem] w-[36rem] rounded-full bg-signal/10 blur-3xl"
      />

      <div className="container-x relative">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Our work</p>
            <h2 className="h-section mt-4 text-white">Proof, not promises.</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/65">
              Every frame sweeps from the damage that came in to the car that went home.
              Hover to hold the result, or drag the handle yourself.
            </p>
          </div>
          <p className="text-sm text-white/40">Drag · Hover · Arrow keys</p>
        </div>

        {pairs.length > 0 ? (
          <BeforeAfterSlider pairs={pairs} />
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-white/60">
            No gallery items yet. Add your first before and after pair from the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
