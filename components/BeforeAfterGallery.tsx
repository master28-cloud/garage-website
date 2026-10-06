import { getGallery } from "@/lib/content";
import BeforeAfterSlider from "./BeforeAfterSlider";

export default async function BeforeAfterGallery() {
  const pairs = await getGallery();

  return (
    <section id="gallery" className="section bg-paper">
      <div className="container-x">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow">Our work</p>
          <h2 className="h-section mt-4">Proof, not promises.</h2>
          <p className="lede mt-5">
            Every frame sweeps from the damage we received to the vehicle we handed back.
            Hover to hold the result, or drag the handle yourself.
          </p>
        </div>

        {pairs.length > 0 ? (
          <BeforeAfterSlider pairs={pairs} />
        ) : (
          <p className="rounded-2xl border border-dashed border-paper-line bg-white p-12 text-center text-steel">
            No gallery items yet. Add your first before/after pair from the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
