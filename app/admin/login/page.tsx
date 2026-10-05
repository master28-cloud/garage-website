"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(data.error || "Login failed"); return; }
    router.push("/admin/dashboard");
    router.refresh();
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white " +
    "placeholder:text-white/35 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/30";

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-5 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-soft p-9">
        <div className="flex items-center gap-2.5 text-lg font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal text-sm text-white">A</span>
          AutoPro
        </div>

        <h1 className="mt-7 text-3xl font-bold tracking-tightest text-white">Admin sign-in</h1>
        <p className="mt-2 text-sm text-white/60">Secure access to the bookings dashboard.</p>

        <label htmlFor="email" className="mt-8 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
          Email
        </label>
        <input id="email" type="email" required autoFocus autoComplete="username"
               value={email} onChange={(e) => setEmail(e.target.value)} className={field} />

        <label htmlFor="password" className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
          Password
        </label>
        <input id="password" type="password" required minLength={8} autoComplete="current-password"
               value={password} onChange={(e) => setPassword(e.target.value)} className={field} />

        {err && <p role="alert" className="mt-4 text-sm font-medium text-signal-light">{err}</p>}

        <button disabled={loading} className="btn btn-solid mt-8 w-full disabled:opacity-60">
          {loading ? <><Loader2 className="animate-spin" size={18} /> Signing in…</> : "Sign in"}
        </button>
      </form>
    </div>
  );
}
