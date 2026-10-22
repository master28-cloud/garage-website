import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import PartnerLogos from "./PartnerLogos";
import { getWhatsAppNumber, formatForDisplay } from "@/lib/content";

// Every href is absolute. A bare "#services" resolves against whatever page
// you are already on, so from /privacy it went nowhere.
const links = {
  Company: [
    { href: "/about",            label: "About" },
    { href: "/about#team",       label: "Leadership" },
    { href: "/our-work",         label: "Our Work" },
    { href: "/#contact",         label: "Book a Service" },
    { href: "/track",            label: "Track Your Repair" },
    { href: "/sitemap.xml",      label: "Sitemap" }
  ],
  Services: [
    { href: "/services#engine-diagnostics", label: "Engine Diagnostics" },
    { href: "/services#panel-beating",      label: "Panel Beating" },
    { href: "/services#wheel-alignment",    label: "Wheel Alignment" },
    { href: "/services#insurance-repairs",  label: "Insurance Repairs" },
    { href: "/services",                    label: "All services" }
  ],
  Legal: [
    { href: "/privacy",         label: "Privacy Policy" },
    { href: "/terms",           label: "Terms of Service" },
    { href: "/privacy#cookies", label: "Cookie Policy" }
  ]
};

export default async function Footer() {
  const phoneDisplay = formatForDisplay(await getWhatsAppNumber());
  return (
    <footer className="bg-ink text-white">
      {/* Partner wall on a light band so the brand colours read properly */}
      <div className="bg-paper-warm py-14">
        <div className="container-x">
          <p className="eyebrow-mute mb-6">Trusted by &amp; partnered with</p>
          <PartnerLogos />
        </div>
      </div>

      <div className="h-px w-full bg-signal" />

      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-signal font-bold text-white">A</span>
              AutoPro
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-white/65">
              Precision engineered. Passion driven. East Africa&apos;s most trusted
              automotive repair destination.
            </p>

            <p className="eyebrow mt-8">M-Pesa Paybill</p>
            <p className="text-sm text-white/80">Contact our team for details</p>

            <div className="mt-7 flex gap-2.5">
              {[
                { href: "https://facebook.com/autoprogarage",       label: "Facebook",  Icon: Facebook },
                { href: "https://instagram.com/autoprogarage",      label: "Instagram", Icon: Instagram },
                { href: "https://linkedin.com/company/autoprogarage",label: "LinkedIn",  Icon: Linkedin }
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label}
                   className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-signal">
                  <Icon size={16} />
                </a>
              ))}
              <a href="https://tiktok.com/@autoprogarage" aria-label="TikTok"
                 className="rounded-full bg-white/10 p-2.5 transition-colors hover:bg-signal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.3 7.4a6.4 6.4 0 01-3.7-1.2v8.1a5.6 5.6 0 11-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 102.1 2.9V2h2.6a4 4 0 003.7 3.7v1.7z" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-signal">{group}</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {items.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AutoPro Garage. All rights reserved.</p>
          <p>Enterprise Road, Nairobi · {phoneDisplay}</p>
        </div>
      </div>
    </footer>
  );
}
