"use client";
import { useEffect, useState } from "react";

const COOKIE_KEY = "apg_consent_v1";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; at: string };

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setOpen(true);
    } catch { setOpen(true); }
  }, []);

  function save(c: Consent) {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)); } catch {}
    setOpen(false);
    window.dispatchEvent(new CustomEvent("apg:consent", { detail: c }));
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/97 text-white backdrop-blur-md"
    >
      <div className="container-x grid gap-5 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-semibold">We use cookies to improve your experience.</p>
          <p className="mt-1 text-sm text-white/70">
            Essential cookies keep the site working. With your consent we also use analytics
            and marketing cookies. Read our{" "}
            <a href="/privacy#cookies" className="underline hover:text-signal">Cookie Policy</a>.
          </p>

          <div className="mt-4 flex flex-wrap gap-5 text-sm">
            <label className="flex items-center gap-2 text-white/55">
              <input type="checkbox" checked disabled className="h-4 w-4 accent-signal" /> Necessary
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={prefs.analytics} className="h-4 w-4 accent-signal"
                     onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))} />
              Analytics
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={prefs.marketing} className="h-4 w-4 accent-signal"
                     onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))} />
              Marketing
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 lg:justify-end">
          <button
            onClick={() => save({ necessary: true, analytics: false, marketing: false, at: new Date().toISOString() })}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Reject all
          </button>
          <button
            onClick={() => save({ necessary: true, ...prefs, at: new Date().toISOString() })}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
          >
            Save choices
          </button>
          <button
            onClick={() => save({ necessary: true, analytics: true, marketing: true, at: new Date().toISOString() })}
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-dark"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
