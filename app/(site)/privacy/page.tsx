import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AutoPro Garage collects, uses and protects your personal data under the Kenya Data Protection Act 2019 and the EU GDPR."
};

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="mt-12 text-2xl font-bold tracking-tight text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 leading-relaxed text-steel">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="mt-4 space-y-2.5 text-steel">{children}</ul>
);
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3 leading-relaxed">
    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
    <span>{children}</span>
  </li>
);

export default function PrivacyPage() {
  return (
    <article className="container-x max-w-3xl pb-28 pt-36">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tightest text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-steel-light">
        Last updated {new Date().toISOString().slice(0, 10)}
      </p>

      <P>
        AutoPro Garage (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy explains how we
        collect, use and protect personal data in line with the <strong className="text-ink">Kenya Data
        Protection Act, 2019</strong> and the <strong className="text-ink">EU GDPR</strong> where applicable.
      </P>

      <H2>What we collect</H2>
      <UL>
        <LI>Contact details you provide when booking: name, phone, email and vehicle details.</LI>
        <LI>Service history and notes relating to repairs we perform on your vehicle.</LI>
        <LI>Technical data: a hashed IP address, your browser user agent and cookie preferences.</LI>
      </UL>

      <H2>How we use it</H2>
      <UL>
        <LI>To confirm, schedule and deliver the service you requested (lawful basis: contract).</LI>
        <LI>To contact you about your booking by phone, WhatsApp or email.</LI>
        <LI>With your consent, to send occasional service reminders and offers.</LI>
        <LI>To meet our legal, tax and insurance obligations.</LI>
      </UL>

      <H2>Who we share it with</H2>
      <P>
        We share data only with the processors needed to deliver the service — hosting (Vercel),
        database (Neon) and WhatsApp/Meta for messaging. We do not sell your data.
      </P>

      <H2>Your rights</H2>
      <P>
        You may access, correct, delete or restrict the processing of your personal data, withdraw
        consent at any time, and lodge a complaint with the Office of the Data Protection
        Commissioner in Kenya. Contact us at{" "}
        <a href="mailto:privacy@autoprogarage.co.ke" className="font-medium text-ink underline">
          privacy@autoprogarage.co.ke
        </a>.
      </P>

      <H2>Retention</H2>
      <P>
        Booking records are kept for seven years to meet tax and insurance requirements. Marketing
        preferences are kept until you withdraw consent.
      </P>

      <H2 id="cookies">Cookies</H2>
      <P>We use a small number of cookies:</P>
      <UL>
        <LI><strong className="text-ink">Necessary</strong> — authentication and security. These cannot be disabled.</LI>
        <LI><strong className="text-ink">Analytics</strong> — anonymous usage patterns, set only with your consent.</LI>
        <LI><strong className="text-ink">Marketing</strong> — advertising measurement, set only with your consent.</LI>
      </UL>
      <P>You can change your choice at any time through the cookie banner.</P>
    </article>
  );
}
