"use client";
import { useState } from "react";
import { Phone, MessageCircle, Check } from "lucide-react";
import { telHref, waHref, toE164, prettyPhone } from "@/lib/contact";

/**
 * On a phone, tel: hands off to the dialer and wa.me opens WhatsApp.
 * On a desktop with no dialer registered, tel: does nothing at all and gives
 * no feedback — so the call button also copies the number, which makes the
 * click useful either way.
 */
export default function ContactActions({
  phone, name, variant = "ghost"
}: { phone: string; name: string; variant?: "ghost" | "outline" }) {
  const [copied, setCopied] = useState(false);

  const tel = telHref(phone);
  const wa = waHref(phone, name.split(" ")[0] ?? "there");
  const e164 = toE164(phone);
  const pretty = prettyPhone(phone);

  async function onCall() {
    if (!e164) return;
    try {
      await navigator.clipboard.writeText(e164);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the tel: link is still doing its job */
    }
  }

  const base =
    variant === "outline"
      ? "grid h-9 w-9 place-items-center rounded-lg border border-black/10 transition-colors"
      : "grid h-8 w-8 place-items-center rounded-lg transition-colors";

  if (!tel && !wa) {
    return <span className="text-xs text-steel-light" title={phone}>No valid number</span>;
  }

  return (
    <div className="relative flex items-center gap-1.5">
      {tel ? (
        <a
          href={tel}
          onClick={onCall}
          title={`Call ${pretty} — also copies the number`}
          aria-label={`Call ${name} on ${pretty}`}
          className={`${base} text-steel hover:bg-ink hover:text-white`}
        >
          {copied ? <Check size={15} className="text-emerald-600" /> : <Phone size={15} />}
        </a>
      ) : null}

      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          title={`WhatsApp ${pretty}`}
          aria-label={`Message ${name} on WhatsApp`}
          className={`${base} ${
            variant === "outline"
              ? "bg-[#25D366] text-white hover:brightness-110"
              : "text-steel hover:bg-[#25D366] hover:text-white"
          }`}
        >
          <MessageCircle size={15} />
        </a>
      ) : null}

      {copied && (
        <span
          role="status"
          className="pointer-events-none absolute bottom-full right-0 z-20 mb-1.5 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg"
        >
          {pretty} copied
        </span>
      )}
    </div>
  );
}
