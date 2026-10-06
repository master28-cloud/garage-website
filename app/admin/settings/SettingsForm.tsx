"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, MessageCircle } from "lucide-react";

function preview(digits: string) {
  const m = digits.replace(/\D/g, "").match(/^254(\d{3})(\d{3})(\d{3})$/);
  return m ? `+254 ${m[1]} ${m[2]} ${m[3]}` : null;
}

export default function SettingsForm({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setError("");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp: value })
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      setState("error");
      setError(data?.error ?? "Could not save. Please try again.");
      return;
    }

    setValue(data.whatsapp);
    setState("saved");
    router.refresh();
    setTimeout(() => setState("idle"), 2500);
  }

  const shown = preview(value);

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-white">Site settings</h2>
      <p className="mt-1.5 text-sm text-white/60">
        Changes go live on the public site the moment you save.
      </p>

      <form onSubmit={save} className="mt-7 rounded-2xl border border-black/5 bg-white p-7">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/10">
            <MessageCircle size={17} className="text-[#25D366]" />
          </span>
          <div>
            <h3 className="font-bold text-ink">WhatsApp number</h3>
            <p className="text-xs text-steel">Used by the float button, the booking form and your contact details.</p>
          </div>
        </div>

        <label htmlFor="whatsapp" className="mt-7 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
          Number
        </label>
        <input
          id="whatsapp"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0727718981"
          inputMode="tel"
          className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
        />
        <p className="mt-2 text-xs text-steel">
          Any format works — <code className="rounded bg-black/5 px-1 py-0.5">0727718981</code>,{" "}
          <code className="rounded bg-black/5 px-1 py-0.5">+254727718981</code> or{" "}
          <code className="rounded bg-black/5 px-1 py-0.5">254727718981</code>.
          {shown && <> Saves as <strong className="text-ink">{shown}</strong>.</>}
        </p>

        {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>}

        <div className="mt-7 flex items-center gap-3">
          <button
            disabled={state === "saving"}
            className="btn btn-solid !px-7 !py-3 !text-sm disabled:opacity-60"
          >
            {state === "saving"
              ? <><Loader2 className="animate-spin" size={16} /> Saving…</>
              : "Save changes"}
          </button>
          {state === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <Check size={16} /> Saved and live
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
