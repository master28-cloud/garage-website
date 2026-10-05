import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the AutoPro Garage website and workshop services."
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-12 text-2xl font-bold tracking-tight text-ink">{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-4 leading-relaxed text-steel">{children}</p>
);

export default function TermsPage() {
  return (
    <article className="container-x max-w-3xl pb-28 pt-36">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tightest text-ink">Terms of Service</h1>
      <p className="mt-4 text-sm text-steel-light">
        Last updated {new Date().toISOString().slice(0, 10)}
      </p>

      <P>
        By using this website or booking a service you agree to these terms. Bookings are treated as
        enquiries until confirmed in writing by an AutoPro Garage service advisor.
      </P>

      <H2>Services</H2>
      <P>
        All repairs are performed to the standards of the Kenya Motor Industry Association. Parts
        carry the warranty of their original manufacturer; our labour is warranted for ninety days.
      </P>

      <H2>Payments</H2>
      <P>
        We accept M-Pesa, bank transfer and card. Payment terms are set out on your quotation before
        work begins.
      </P>

      <H2>Liability</H2>
      <P>
        Our liability is limited to the value of the service invoice. We are not liable for
        consequential or indirect losses.
      </P>

      <H2>Governing law</H2>
      <P>These terms are governed by the laws of Kenya.</P>
    </article>
  );
}
