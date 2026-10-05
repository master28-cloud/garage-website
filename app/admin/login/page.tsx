"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setErr(data.error || "Login failed"); return; }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] grid place-items-center p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-navy">Admin sign-in</h1>
        <p className="mt-1 text-sm text-slate-500">Secure access to the AutoPro dashboard.</p>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-brand-navy">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoFocus
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-brand-navy">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={8}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" />

        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <button disabled={loading} className="btn btn-dark mt-6 w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
