"use client";
import { useEffect, useState } from "react";

const COOKIE_KEY = "apg_consent_v1";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; at: string };

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COOKIE_KEY);
      if (!raw) setOpen(true);
    } catch { setOpen(true); }
  }, []);

  function save(c: Consent) {
    try { localStorage.setItem(COOKIE_KEY, JSON.stringify(c)); } catch {}
    setOpen(false);
    window.dispatchEvent(new CustomEvent("apg:consent", { detail: c }));
  }

  if (!open) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-navy/95 text-white backdrop-blur">
      <div className="container-x grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold">We use cookies to make your experience better.</p>
          <p className="text-xs text-white/70">
            Essential cookies keep the site working. With your consent we also use analytics and marketing cookies.
            See our <a href="/privacy#cookies" className="underline">Cookie Policy</a>.
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2"><input type="checkbox" checked disabled /> Necessary</label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))} />
              Analytics
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))} />
              Marketing
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <button onClick={() => save({ necessary: true, analytics: false, marketing: false, at: new Date().toISOString() })}
            className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10">Reject all</button>
          <button onClick={() => save({ necessary: true, ...prefs, at: new Date().toISOString() })}
            className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10">Save preferences</button>
          <button onClick={() => save({ necessary: true, analytics: true, marketing: true, at: new Date().toISOString() })}
            className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-brand-navy">Accept all</button>
        </div>
      </div>
    </div>
  );
}
