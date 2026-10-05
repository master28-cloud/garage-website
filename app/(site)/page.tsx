import Hero from "@/components/Hero";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Services from "@/components/Services";
import MissionVision from "@/components/MissionVision";
import Stats from "@/components/Stats";
import Hierarchy from "@/components/Hierarchy";
import Testimonials from "@/components/Testimonials";
import ContactBooking from "@/components/ContactBooking";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Reveal><BeforeAfterGallery /></Reveal>
      <Reveal><Services /></Reveal>
      <Reveal><MissionVision /></Reveal>
      <Reveal><Stats /></Reveal>
      <Reveal><Hierarchy /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><ContactBooking /></Reveal>
    </>
  );
}
