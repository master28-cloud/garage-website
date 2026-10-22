// Shared by the booking form, the booking API and the repair tracker.
// No server-only imports, so client components can use it too.

export const SERVICE_OPTIONS = [
  { v: "ENGINE_DIAGNOSTICS",      l: "Engine Diagnostics" },
  { v: "PANEL_BEATING",           l: "Panel Beating & Spray" },
  { v: "WHEEL_ALIGNMENT",         l: "Wheel Alignment & Balancing" },
  { v: "BRAKE_SUSPENSION",        l: "Brake & Suspension" },
  { v: "AC_SERVICING",            l: "AC Servicing" },
  { v: "ELECTRICAL",              l: "Electrical Repairs" },
  { v: "PRE_PURCHASE_INSPECTION", l: "Pre-Purchase Inspection" },
  { v: "INSURANCE_CLAIM",         l: "Insurance Claim Repairs" },
  { v: "OTHER",                   l: "Something else" }
] as const;

export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["v"];

export function serviceLabel(v: string): string {
  return SERVICE_OPTIONS.find((s) => s.v === v)?.l ?? "Workshop visit";
}

/** Customer-facing reference, e.g. APG-7K3Q9X: the tail of the booking's cuid. */
export function bookingReference(id: string): string {
  return `APG-${id.slice(-6).toUpperCase()}`;
}

/** "APG-7K3Q9X", "apg 7k3q9x" or "7K3Q9X" -> "7k3q9x" (the id tail), else null. */
export function referenceSuffix(input: string): string | null {
  const s = input.trim().toLowerCase().replace(/[\s-]/g, "");
  const tail = s.length === 9 && s.startsWith("apg") ? s.slice(3) : s;
  return /^[a-z0-9]{6}$/.test(tail) ? tail : null;
}

/** Compare phone numbers however they were typed: 0712…, +254712…, 254 712 … */
export function phoneKey(phone: string): string {
  return phone.replace(/\D/g, "").slice(-9);
}

/** Last booking made in this browser, so /track can offer it back. */
export const LAST_REF_KEY = "autopro:last-ref";

/* ---- Pre-filling the booking form from other sections ---- */

export type BookingPrefill = { service?: ServiceValue; notes?: string };
export const PREFILL_EVENT = "autopro:prefill-booking";

/**
 * Fill in the booking form and bring it into view. On a page without the
 * form, go to the homepage and carry the values in the URL instead.
 */
export function prefillBooking(p: BookingPrefill) {
  const form = document.getElementById("contact");
  if (form) {
    window.dispatchEvent(new CustomEvent<BookingPrefill>(PREFILL_EVENT, { detail: p }));
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const q = new URLSearchParams();
  if (p.service) q.set("service", p.service);
  if (p.notes) q.set("notes", p.notes);
  window.location.href = `/?${q.toString()}#contact`;
}
