"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { href: "#gallery",   label: "Our Work" },
  { href: "#services",  label: "Services" },
  { href: "#about",     label: "About" },
  { href: "#team",      label: "Team" },
  { href: "#contact",   label: "Book" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "bg-brand-navy/90 backdrop-blur shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="container-x flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="h-8 w-8 rounded-lg bg-brand-green grid place-items-center text-brand-navy font-bold">A</span>
          <span>AutoPro<span className="text-brand-green">.</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-white/90 hover:text-brand-green transition">
              {n.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary">Book a Service</a>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white p-2"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-brand-navy/95 border-t border-white/10">
          <div className="container-x py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-white py-2">
                {n.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Book a Service
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
