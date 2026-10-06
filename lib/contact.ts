/**
 * Numbers are stored as the customer typed them, usually "0722114455".
 * Dialers and WhatsApp each want a different shape, so normalise at the
 * point of use rather than rewriting what was captured.
 */

/** "0722114455" -> "254722114455". Returns null if it cannot be made sense of. */
export function toKenyanDigits(raw: string): string | null {
  let n = raw.replace(/\D/g, "");
  if (n.startsWith("00")) n = n.slice(2);
  if (n.startsWith("0")) n = "254" + n.slice(1);
  else if (n.startsWith("7") || n.startsWith("1")) n = "254" + n;
  return /^254[17]\d{8}$/.test(n) ? n : null;
}

/** International form for tel: links — far more reliable than the local 0-prefix. */
export function toE164(raw: string): string | null {
  const d = toKenyanDigits(raw);
  return d ? `+${d}` : null;
}

export function telHref(raw: string): string | null {
  const e = toE164(raw);
  return e ? `tel:${e}` : null;
}

export function waHref(raw: string, firstName: string): string | null {
  const d = toKenyanDigits(raw);
  if (!d) return null;
  const text = `Hello ${firstName}, this is AutoPro Garage regarding your booking.`;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

/** "+254722114455" -> "+254 722 114 455" */
export function prettyPhone(raw: string): string {
  const d = toKenyanDigits(raw);
  if (!d) return raw;
  const m = d.match(/^254(\d{3})(\d{3})(\d{3})$/);
  return m ? `+254 ${m[1]} ${m[2]} ${m[3]}` : `+${d}`;
}
