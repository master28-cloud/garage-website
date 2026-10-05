import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AutoPro Garage collects, uses, and protects your personal data under GDPR and the Kenya Data Protection Act, 2019."
};

export default function PrivacyPage() {
  return (
    <article className="container-x prose prose-slate max-w-3xl py-20">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>

      <p>
        AutoPro Garage (&quot;we&quot;, &quot;us&quot;) respects your privacy. This Policy explains how we collect,
        use and protect personal data in line with the <strong>Kenya Data Protection Act, 2019</strong> and the
        <strong> EU GDPR</strong> where applicable.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>Contact details you provide when booking: name, phone, email, vehicle details.</li>
        <li>Service history and notes relating to repairs we perform on your vehicle.</li>
        <li>Technical data: hashed IP address, user agent, and cookie preferences.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To confirm, schedule and deliver the service you requested (lawful basis: contract).</li>
        <li>To contact you about your booking via phone, WhatsApp or email.</li>
        <li>With your consent, to send occasional service reminders and offers.</li>
        <li>To meet legal and insurance obligations.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We share data only with processors necessary to deliver the service — hosting (Vercel), database (Neon),
        and WhatsApp/Meta for messaging. We do not sell your data.
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, correct, delete or restrict the processing of your personal data, to withdraw
        consent at any time, and to lodge a complaint with the Office of the Data Protection Commissioner (ODPC)
        in Kenya. Contact us at <a href="mailto:privacy@autoprogarage.co.ke">privacy@autoprogarage.co.ke</a>.
      </p>

      <h2>Retention</h2>
      <p>Booking records: 7 years (tax and insurance). Marketing preferences: until you withdraw consent.</p>

      <h2 id="cookies">Cookies</h2>
      <p>
        We use a small number of cookies:
      </p>
      <ul>
        <li><strong>Necessary</strong> — authentication and security, cannot be disabled.</li>
        <li><strong>Analytics</strong> — anonymous usage patterns (only with consent).</li>
        <li><strong>Marketing</strong> — ad measurement (only with consent).</li>
      </ul>
      <p>You can change your choice at any time via the cookie banner.</p>
    </article>
  );
}
