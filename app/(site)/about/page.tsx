import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FeatureSplit from "@/components/FeatureSplit";
import Timeline from "@/components/Timeline";
import MissionVision from "@/components/MissionVision";
import Stats from "@/components/Stats";
import Hierarchy from "@/components/Hierarchy";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "AutoPro Garage has served Kenyan drivers from Nairobi since 2011 — 47 staff, 12 service bays and 18,000 vehicles returned to the road.",
  alternates: { canonical: "/about" }
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="About AutoPro"
        lede="Founded in Nairobi in 2011 around one idea — that a repair should restore your confidence in the vehicle, not just patch it."
        image={u("photo-1631720040176-0d789a643a78")}
        imageAlt="The AutoPro Garage workshop floor and tooling"
        stats={[
          ["2011", "Established"],
          ["47", "Team members"],
          ["18k+", "Vehicles serviced"]
        ]}
      />

      <Reveal>
        <FeatureSplit
          eyebrow="Why we started"
          title="Because nobody could tell you what was wrong."
          body="Kenyan drivers were used to leaving a car and hoping. No diagnosis in writing, no photographs, no call when the price changed. We built the opposite of that — and most of our work still arrives by word of mouth because of it."
          points={[
            "Written quotes with photographs, every time",
            "A named service advisor you can actually reach",
            "Parts priced separately from labour, itemised",
            "Ninety-day warranty on everything we touch"
          ]}
          image={u("photo-1676018366904-c083ed678e60")}
          imageAlt="A technician at work in the AutoPro Garage workshop"
        />
      </Reveal>

      <Reveal><Timeline /></Reveal>
      <Reveal><MissionVision /></Reveal>
      <Reveal><Stats /></Reveal>
      <Reveal><Hierarchy /></Reveal>

      <CtaBand
        title="Come and see the workshop."
        body="Enterprise Road, Industrial Area. Walk in during opening hours, or book ahead and we'll have a bay ready."
        cta="Book a visit"
      />
    </>
  );
}
