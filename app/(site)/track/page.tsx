import type { Metadata } from "next";
import RepairTracker from "@/components/RepairTracker";
import { getWhatsAppNumber } from "@/lib/content";

export const metadata: Metadata = {
  title: "Track Your Repair",
  description:
    "See which stage your vehicle has reached in the AutoPro workshop, using the booking reference from your WhatsApp confirmation.",
  alternates: { canonical: "/track" }
};

export default async function TrackPage() {
  return <RepairTracker whatsapp={await getWhatsAppNumber()} />;
}
