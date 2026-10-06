import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServicesDetailed from "@/components/ServicesDetailed";
import ProcessSteps from "@/components/ProcessSteps";
import FeatureSplit from "@/components/FeatureSplit";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Engine diagnostics, panel beating and spray, wheel alignment, brake and suspension, AC servicing, electrical repairs, pre-purchase inspection and insurance claim repairs in Nairobi.",
  alternates: { canonical: "/services" }
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Services"
        lede="Eight disciplines under one roof, so your vehicle never leaves our care mid-repair."
        image={u("photo-1771340012319-0b4fca008b54")}
        imageAlt="Technician working on a car engine in the AutoPro workshop"
        stats={[
          ["12", "Service bays"],
          ["24", "Certified technicians"],
          ["90", "Day labour warranty"]
        ]}
      />

      <Reveal><ServicesDetailed /></Reveal>

      <Reveal>
        <FeatureSplit
          eyebrow="Diagnostics first"
          title="We find the fault before we quote."
          body="Guesswork is what makes repair bills unpredictable. Every vehicle goes on the scanner before anyone picks up a spanner, so the quote you get is the bill you pay."
          points={[
            "OBD-II deep scan with live sensor data",
            "Written quote with photographs of the fault",
            "No work begins until you approve it",
            "Original or aftermarket parts — your choice, priced separately"
          ]}
          image={u("photo-1619642751034-765dfdf7c58e")}
          imageAlt="Close-up of a technician's hands working on an engine"
        />
      </Reveal>

      <Reveal><ProcessSteps /></Reveal>

      <Reveal>
        <FeatureSplit
          flip
          eyebrow="Insurance work"
          title="We handle the claim, you keep driving."
          body="Accident repairs mean paperwork, assessors and waiting. We deal with all three directly so you are not chasing anyone between appointments."
          points={[
            "Approved by Kenya's major insurers",
            "We liaise with the assessor on your behalf",
            "Courtesy updates while the claim is processed",
            "Structural realignment and factory-match respray in-house"
          ]}
          image={u("photo-1723099971299-3789db53604c")}
          imageAlt="Vehicle raised on a workshop lift for underbody repair"
        />
      </Reveal>

      <CtaBand
        title="Not sure what your vehicle needs?"
        body="Describe the symptom and a service advisor will tell you what to expect — before you commit to anything."
        cta="Book a diagnosis"
      />
    </>
  );
}
