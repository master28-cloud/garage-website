import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export const WHATSAPP_KEY = "whatsapp_number";

const FALLBACK_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254727718981";

/** Digits only, e.g. 254727718981. Falls back to env if the DB is unreachable. */
export async function getWhatsAppNumber(): Promise<string> {
  noStore();
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: WHATSAPP_KEY } });
    return row?.value || FALLBACK_WHATSAPP;
  } catch {
    return FALLBACK_WHATSAPP;
  }
}

/** Kenyan input in any common shape -> 2547XXXXXXXX. Returns null if invalid. */
export function normalizeKenyanNumber(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let n = digits;
  if (n.startsWith("0")) n = "254" + n.slice(1);
  else if (n.startsWith("7") || n.startsWith("1")) n = "254" + n;
  if (!/^254[17]\d{8}$/.test(n)) return null;
  return n;
}

export function formatForDisplay(digits: string): string {
  // 254727718981 -> +254 727 718 981
  const m = digits.match(/^254(\d{3})(\d{3})(\d{3})$/);
  return m ? `+254 ${m[1]} ${m[2]} ${m[3]}` : `+${digits}`;
}

export type GalleryPair = {
  id: string;
  tag: string;
  title: string;
  before: string;
  after: string;
};

export async function getGallery(): Promise<GalleryPair[]> {
  noStore();
  try {
    const rows = await prisma.galleryItem.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });
    return rows
      .map((r) => ({
        id: r.id,
        tag: r.tag,
        title: r.title,
        before: r.beforeId ? `/api/media/${r.beforeId}` : r.beforeUrl ?? "",
        after:  r.afterId  ? `/api/media/${r.afterId}`  : r.afterUrl  ?? ""
      }))
      .filter((r) => r.before && r.after);
  } catch {
    return [];
  }
}

export type PartnerRow = {
  id: string;
  name: string;
  href: string;
  color: string;
  mark: string;
};

export async function getPartners(): Promise<PartnerRow[]> {
  noStore();
  try {
    const rows = await prisma.partner.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });
    return rows.map((p) => ({
      id: p.id, name: p.name, href: p.href, color: p.color, mark: p.mark
    }));
  } catch {
    return [];
  }
}
