import Hero from "@/components/Hero";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import Services from "@/components/Services";
import MissionVision from "@/components/MissionVision";
import Stats from "@/components/Stats";
import Hierarchy from "@/components/Hierarchy";
import Testimonials from "@/components/Testimonials";
import ContactBooking from "@/components/ContactBooking";
import Reveal from "@/components/Reveal";
import { getWhatsAppNumber, formatForDisplay } from "@/lib/content";

export default async function HomePage() {
  const phoneDisplay = formatForDisplay(await getWhatsAppNumber());

  return (
    <>
      <Hero />
      <Reveal><BeforeAfterGallery /></Reveal>
      <Reveal><Services /></Reveal>
      <Reveal><MissionVision /></Reveal>
      <Reveal><Stats /></Reveal>
      <Reveal><Hierarchy /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><ContactBooking phoneDisplay={phoneDisplay} /></Reveal>
    </>
  );
}
