"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutList, Images, Handshake, Settings, ExternalLink, ListChecks } from "lucide-react";

const TABS = [
  { href: "/admin/dashboard", label: "Bookings", Icon: LayoutList },
  { href: "/admin/statuses",  label: "Stages",   Icon: ListChecks },
  { href: "/admin/gallery",   label: "Gallery",  Icon: Images },
  { href: "/admin/partners",  label: "Partners", Icon: Handshake },
  { href: "/admin/settings",  label: "Settings", Icon: Settings }
];

/**
 * Mk7 Golf on the coast, kept clearly visible behind the admin area.
 * The photograph carries only a light wash — enough for the header text to
 * pass contrast — and keeps its own colour. Readability is bought back by
 * the panels instead: every card is fully opaque with a lifted shadow, so
 * they read as sheets floating over the scene rather than tinted glass.
 */
export default function AdminShell({
  email, children
}: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <div className="relative min-h-screen bg-ink">
      {/* ---- backdrop: fixed, so it does not travel with the scroll ---- */}
      <div aria-hidden="true" className="fixed inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/9470906/pexels-photo-9470906.jpeg?auto=compress&cs=tinysrgb&w=2400"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* light wash only — the car and the sea stay legible */}
        <div className="absolute inset-0 bg-ink/30" />

        {/* a touch more weight at the very top so header text clears contrast */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(12,13,14,.72) 0%,rgba(12,13,14,.28) 22%,transparent 45%)" }}
        />

        {/* warm the horizon a little toward the brand hue */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: "radial-gradient(70% 55% at 20% 12%,#FF5A1F 0%,transparent 72%)", opacity: 0.35 }}
        />
      </div>

      {/* ---- interface ---- */}
      <div className="relative z-10">
        <header className="border-b border-white/15 bg-ink/45 backdrop-blur-md">
          <div className="container-x flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-signal text-base font-bold text-white">A</span>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white drop-shadow-sm">AutoPro Operations</h1>
                <p className="text-xs text-white/70">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:inline-flex"
              >
                View site <ExternalLink size={14} />
              </a>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          </div>

          <nav className="container-x flex gap-1 overflow-x-auto">
            {TABS.map(({ href, label, Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "border-signal text-white"
                      : "border-transparent text-white/70 hover:text-white"
                  }`}
                >
                  <Icon size={15} /> {label}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* [&_...] lifts every panel off the photograph without touching each component */}
        <div className="container-x py-9 [&_.rounded-2xl]:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] [&_table]:bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
