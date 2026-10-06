"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutList, Images, Handshake, Settings, ExternalLink } from "lucide-react";

const TABS = [
  { href: "/admin/dashboard", label: "Bookings", Icon: LayoutList },
  { href: "/admin/gallery",   label: "Gallery",  Icon: Images },
  { href: "/admin/partners",  label: "Partners", Icon: Handshake },
  { href: "/admin/settings",  label: "Settings", Icon: Settings }
];

/**
 * Golf GTI Mk7.5 behind the whole admin area, fixed so it does not travel
 * with the scroll. This is a tool people read numbers off for hours, so the
 * photograph is pushed right back — heavily darkened, desaturated and grained
 * — and every panel keeps an opaque surface. The car is atmosphere between
 * the cards, never underneath the data.
 */

const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
       <filter id='n'>
         <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/>
         <feColorMatrix type='saturate' values='0'/>
       </filter>
       <rect width='160' height='160' filter='url(#n)' opacity='0.5'/>
     </svg>`
  );

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
      {/* ---- fixed backdrop ---- */}
      <div aria-hidden="true" className="fixed inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/20809165/pexels-photo-20809165.jpeg?auto=compress&cs=tinysrgb&w=2400"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* desaturate and sink it behind the interface */}
        <div className="absolute inset-0 bg-ink/80" />
        <div
          className="absolute inset-0 mix-blend-saturation"
          style={{ background: "#808080", opacity: 0.75 }}
        />
        {/* warm the top-left so the header has some life */}
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{ background: "radial-gradient(60% 70% at 18% 8%,#FF5A1F 0%,transparent 70%)", opacity: 0.45 }}
        />
        {/* settle toward solid ink down the page, so long tables stay calm */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(12,13,14,.35) 0%,rgba(12,13,14,.82) 45%,#0C0D0E 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
          style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "160px 160px" }}
        />
      </div>

      {/* ---- interface ---- */}
      <div className="relative z-10">
        <header className="border-b border-white/10 bg-ink/55 backdrop-blur-md">
          <div className="container-x flex items-center justify-between gap-4 py-5">
            <div className="flex items-center gap-3.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-signal text-base font-bold text-white">A</span>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white">AutoPro Operations</h1>
                <p className="text-xs text-white/55">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full border border-white/25 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:inline-flex"
              >
                View site <ExternalLink size={14} />
              </a>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
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
                      : "border-transparent text-white/55 hover:text-white"
                  }`}
                >
                  <Icon size={15} /> {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="container-x py-9">{children}</div>
      </div>
    </div>
  );
}
