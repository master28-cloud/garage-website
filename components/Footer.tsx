import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const partners = [
  "AutoXpress", "Toyota Kenya", "CFAO Motors",
  "DT Dobie", "Simba Corp", "Isuzu East Africa",
  "Jubilee Insurance", "Britam", "APA Insurance"
];

const links = {
  Company: [
    { href: "#about", label: "About" },
    { href: "#team",  label: "Leadership" },
    { href: "#gallery", label: "Our Work" },
    { href: "/sitemap.xml", label: "Sitemap" },
  ],
  Services: [
    { href: "#services", label: "Engine Diagnostics" },
    { href: "#services", label: "Panel Beating" },
    { href: "#services", label: "Wheel Alignment" },
    { href: "#services", label: "Insurance Repairs" }
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms",   label: "Terms of Service" },
    { href: "/privacy#cookies", label: "Cookie Policy" }
  ]
};

export default function Footer() {
  return (
    <footer className="relative bg-brand-navy text-white">
      <div className="h-1 w-full bg-brand-green" />
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="h-8 w-8 rounded-lg bg-brand-green grid place-items-center text-brand-navy font-bold">A</span>
              AutoPro
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/70">
              Precision engineered. Passion driven. East Africa&apos;s most trusted automotive repair destination.
            </p>
            <p className="mt-6 text-xs uppercase tracking-widest text-brand-green">M-Pesa Paybill</p>
            <p className="text-sm text-white/80">Contact our team for details</p>

            <div className="mt-6 flex gap-3">
              <a href="https://facebook.com/autoprogarage"  aria-label="Facebook"  className="rounded-full bg-white/10 p-2 hover:bg-brand-green hover:text-brand-navy"><Facebook size={16} /></a>
              <a href="https://instagram.com/autoprogarage" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-brand-green hover:text-brand-navy"><Instagram size={16} /></a>
              <a href="https://tiktok.com/@autoprogarage"   aria-label="TikTok"    className="rounded-full bg-white/10 p-2 hover:bg-brand-green hover:text-brand-navy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.3 7.4a6.4 6.4 0 01-3.7-1.2v8.1a5.6 5.6 0 11-5.6-5.6c.3 0 .6 0 .9.1v2.6a3 3 0 102.1 2.9V2h2.6a4 4 0 003.7 3.7v1.7z"/></svg>
              </a>
              <a href="https://linkedin.com/company/autoprogarage" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2 hover:bg-brand-green hover:text-brand-navy"><Linkedin size={16} /></a>
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-brand-green">{group}</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {items.map((l) => (
                  <li key={l.label}><Link href={l.href} className="hover:text-brand-green">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-green">Our partners</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-white/60 text-sm">
            {partners.map((p) => (
              <span key={p} className="whitespace-nowrap">{p}</span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AutoPro Garage. All rights reserved.</p>
          <p>Built in Nairobi · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link></p>
        </div>
      </div>
    </footer>
  );
}
