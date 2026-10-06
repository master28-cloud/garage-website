import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Before and after repairs from the AutoPro Garage workshop in Nairobi — collision rebuilds, panel beating, respray and structural realignment.",
  alternates: { canonical: "/our-work" }
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Our Work"
        lede="Drag any frame to reveal the repair. Every panel finished by hand in our Nairobi workshop."
        image={u("photo-1619505372149-07875c35b313")}
        imageAlt="Vehicles outside the AutoPro Garage workshop"
        stats={[
          ["18k+", "Vehicles serviced"],
          ["97%", "Would recommend"],
          ["3", "Day average turnaround"]
        ]}
      />

      <BeforeAfterGallery />
      <Reveal><Testimonials /></Reveal>

      <CtaBand
        title="Your car could be next."
        body="Send us a photograph of the damage and we'll come back with an honest assessment."
        cta="Start a repair"
      />
    </>
  );
}
