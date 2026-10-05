import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the AutoPro Garage website and services."
};

export default function TermsPage() {
  return (
    <article className="container-x prose prose-slate max-w-3xl py-20">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>
      <p>
        By using this website or booking a service, you agree to these Terms. Service bookings are quotations only
        until confirmed in writing by a AutoPro Garage service advisor.
      </p>

      <h2>Services</h2>
      <p>All repairs are performed to the standards of the Kenya Motor Industry Association. Parts carry the warranty of their original manufacturer; labour is warranted for 90 days.</p>

      <h2>Payments</h2>
      <p>Accepted methods include M-Pesa, bank transfer and card. Payment terms are communicated on your quotation.</p>

      <h2>Liability</h2>
      <p>Our liability is limited to the value of the service invoice. We are not liable for consequential losses.</p>

      <h2>Governing law</h2>
      <p>These Terms are governed by the laws of Kenya.</p>
    </article>
  );
}
