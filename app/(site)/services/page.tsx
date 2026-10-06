import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Engine diagnostics, panel beating and spray, wheel alignment, brake and suspension, AC servicing, electrical repairs, pre-purchase inspection and insurance claim repairs in Nairobi.",
  alternates: { canonical: "/services" }
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Services"
        lede="Eight disciplines under one roof, so your vehicle never leaves our care mid-repair."
      />

      <div className="pt-20 sm:pt-24">
        <Services heading={false} />
      </div>

      <section className="pb-24 sm:pb-32">
        <div className="container-x">
          <div className="rounded-2xl bg-ink px-8 py-14 text-center text-white sm:px-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Not sure what your vehicle needs?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Describe the symptom and our service advisor will tell you what to expect —
              before you commit to anything.
            </p>
            <Link href="/#contact" className="btn btn-solid mt-8">Book a diagnosis</Link>
          </div>
        </div>
      </section>
    </>
  );
}
