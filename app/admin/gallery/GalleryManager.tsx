"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Upload, Eye, EyeOff, Check, X } from "lucide-react";

type Item = {
  id: string; tag: string; title: string; published: boolean; sortOrder: number;
  before: string; after: string; usesUpload: boolean;
};

const MAX_MB = 4;

export default function GalleryManager({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2800);
  }

  async function replaceImage(id: string, side: "before" | "after", file: File) {
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${MAX_MB}MB — compress it at squoosh.app first.`);
      return;
    }
    setBusy(id); setError("");

    const fd = new FormData();
    fd.set("id", id);
    fd.set(side, file);

    const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
    const data = await res.json().catch(() => null);
    setBusy(null);

    if (!res.ok || !data) { setError(data?.error ?? "Upload failed."); return; }
    flash(`${side === "before" ? "Before" : "After"} image updated and live.`);
    router.refresh();
    // Pull fresh URLs so the new image shows immediately
    const fresh = await fetch("/api/admin/gallery").then((r) => r.json()).catch(() => null);
    if (fresh?.items) setItems(fresh.items.map((i: Item & { before: string }) => ({ ...i, usesUpload: true })));
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id);
    const res = await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body })
    });
    setBusy(null);
    if (res.ok) {
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...body } as Item : x)));
      router.refresh();
      flash("Saved and live.");
    } else setError("Could not save.");
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This removes the pair and its uploaded images permanently.`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) {
      setItems((xs) => xs.filter((x) => x.id !== id));
      router.refresh();
      flash("Deleted.");
    } else setError("Could not delete.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Before &amp; after gallery</h2>
          <p className="mt-1.5 max-w-xl text-sm text-white/60">
            Upload your intake and handover photos. Changes appear on the public site
            immediately. JPG, PNG or WebP, up to {MAX_MB}MB each.
          </p>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="btn btn-solid !px-6 !py-2.5 !text-sm">
          {adding ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add pair</>}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <Check size={15} /> {notice}
        </p>
      )}

      {adding && <AddForm onDone={() => { setAdding(false); router.refresh(); location.reload(); }} onError={setError} />}

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className={`rounded-2xl border border-black/5 bg-white p-5 ${busy === item.id ? "opacity-50" : ""}`}>
            <div className="grid grid-cols-2 gap-2">
              <ImageSlot label="Before" src={item.before} onPick={(f) => replaceImage(item.id, "before", f)} />
              <ImageSlot label="After"  src={item.after}  onPick={(f) => replaceImage(item.id, "after", f)} />
            </div>

            <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-steel">{item.tag}</p>
            <p className="mt-0.5 font-semibold text-ink">{item.title}</p>

            {!item.usesUpload && (
              <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700 ring-1 ring-amber-200">
                Stock placeholder — upload your own photos to replace it.
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => patch(item.id, { published: !item.published })}
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-black/5"
              >
                {item.published ? <><Eye size={13} /> Visible</> : <><EyeOff size={13} /> Hidden</>}
              </button>
              <button
                onClick={() => remove(item.id, item.title)}
                aria-label={`Delete ${item.title}`}
                className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-steel transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && !adding && (
        <p className="mt-7 rounded-2xl border border-dashed border-black/10 bg-white p-14 text-center text-steel">
          No gallery pairs yet. Click <strong className="text-ink">Add pair</strong> to upload your first.
        </p>
      )}
    </div>
  );
}

function ImageSlot({ label, src, onPick }: { label: string; src: string; onPick: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#F6F5F3]">
        {src
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={src} alt={`${label} preview`} className="h-full w-full object-cover" />
          : <span className="grid h-full place-items-center text-xs text-steel-light">No image</span>}
        <button
          onClick={() => ref.current?.click()}
          className="absolute inset-0 grid place-items-center bg-ink/0 text-white opacity-0 transition-all hover:bg-ink/60 hover:opacity-100"
          aria-label={`Replace ${label.toLowerCase()} image`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold"><Upload size={14} /> Replace</span>
        </button>
      </div>
      <p className="mt-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-steel">{label}</p>
      <input
        ref={ref} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); e.target.value = ""; }}
      />
    </div>
  );
}

function AddForm({ onDone, onError }: { onDone: () => void; onError: (s: string) => void }) {
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    onError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
    const data = await res.json().catch(() => null);
    setSaving(false);
    if (!res.ok || !data) { onError(data?.error ?? "Could not add."); return; }
    onDone();
  }

  const field = "mt-1.5 w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-ink focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20";

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-black/5 bg-white p-6">
      <h3 className="font-bold text-ink">New before / after pair</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tag" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">Category</label>
          <input id="tag" name="tag" required placeholder="Collision" className={field} />
        </div>
        <div>
          <label htmlFor="title" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">Title</label>
          <input id="title" name="title" required placeholder="Front-end impact rebuild" className={field} />
        </div>
        <div>
          <label htmlFor="before" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">Before photo</label>
          <input id="before" name="before" type="file" required accept="image/jpeg,image/png,image/webp"
                 className="mt-1.5 w-full text-sm text-steel file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
        </div>
        <div>
          <label htmlFor="after" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">After photo</label>
          <input id="after" name="after" type="file" required accept="image/jpeg,image/png,image/webp"
                 className="mt-1.5 w-full text-sm text-steel file:mr-3 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
        </div>
      </div>
      <p className="mt-4 text-xs text-steel">
        Shoot both frames from the same spot, same height and same angle — the sweep only
        looks right when they line up.
      </p>
      <button disabled={saving} className="btn btn-solid mt-6 !px-7 !py-3 !text-sm disabled:opacity-60">
        {saving ? <><Loader2 className="animate-spin" size={16} /> Uploading…</> : "Add to gallery"}
      </button>
    </form>
  );
}
