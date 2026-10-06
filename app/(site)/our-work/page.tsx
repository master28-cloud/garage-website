import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Before and after repairs from the AutoPro Garage workshop in Nairobi — collision rebuilds, panel beating, respray and structural realignment.",
  alternates: { canonical: "/our-work" }
};

export default function OurWorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Our Work"
        lede="Drag any frame to reveal the repair. Every panel finished by hand in our Nairobi workshop."
      />
      <BeforeAfterGallery />
      <Testimonials />
    </>
  );
}
