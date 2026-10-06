"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

// Absolute paths so these work from every page, not just the homepage.
const nav = [
  { href: "/our-work",   label: "Our Work" },
  { href: "/services",   label: "Services" },
  { href: "/about",      label: "About" },
  { href: "/about#team", label: "Team" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-smooth ${
        scrolled ? "bg-ink/92 backdrop-blur-md" : "bg-gradient-to-b from-ink/70 to-transparent"
      }`}
    >
      <nav className="container-x flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal text-sm font-bold text-white">A</span>
          AutoPro
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href}
               className="text-[15px] font-medium text-white/85 transition-colors hover:text-white">
              {n.label}
            </a>
          ))}
          <a href="/#contact" className="btn btn-solid !px-6 !py-2.5 !text-sm">Book a Service</a>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="p-2 text-white md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink md:hidden">
          <div className="container-x flex flex-col gap-1 py-5">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)}
                 className="py-3 text-lg font-medium text-white">
                {n.label}
              </a>
            ))}
            <a href="/#contact" onClick={() => setOpen(false)} className="btn btn-solid mt-4 w-full">
              Book a Service
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
