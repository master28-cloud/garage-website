import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import MissionVision from "@/components/MissionVision";
import Stats from "@/components/Stats";
import Hierarchy from "@/components/Hierarchy";

export const metadata: Metadata = {
  title: "About",
  description:
    "AutoPro Garage has served Kenyan drivers from Nairobi since 2011 — 47 staff, 12 service bays and 18,000 vehicles returned to the road.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="About AutoPro"
        lede="Founded in Nairobi in 2011 and built around one idea — that a repair should restore your confidence in the vehicle, not just patch it."
      />
      <MissionVision />
      <Stats />
      <Hierarchy />
    </>
  );
}
