import { prisma } from "@/lib/prisma";

export type JobStatusRow = {
  id: string;
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  isTerminal: boolean;
};

export async function getStatuses(): Promise<JobStatusRow[]> {
  return prisma.jobStatus.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true, name: true, slug: true, color: true,
      sortOrder: true, isDefault: true, isTerminal: true
    }
  });
}

/**
 * Where a new booking lands. Falls back to the first status by sort order so a
 * booking can still be taken if nobody has marked a default, and only throws
 * when the table is genuinely empty — which the admin UI prevents.
 */
export async function getDefaultStatusId(): Promise<string> {
  const chosen =
    (await prisma.jobStatus.findFirst({ where: { isDefault: true } })) ??
    (await prisma.jobStatus.findFirst({ orderBy: { sortOrder: "asc" } }));

  if (!chosen) throw new Error("No job statuses configured");
  return chosen.id;
}

/* ---- colour maths, so any hex an admin picks stays legible ---- */

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16)
  ];
}

const hx = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
const toHex = ([r, g, b]: [number, number, number]) => `#${hx(r)}${hx(g)}${hx(b)}`;

function luminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const l1 = luminance(a), l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Blend toward white — gives a solid tint rather than relying on alpha. */
function mixWhite(rgb: [number, number, number], amount: number): [number, number, number] {
  return rgb.map((c) => c + (255 - c) * amount) as [number, number, number];
}

/** Step the hue darker until it clears `target` against its own tint. */
function darkenUntilReadable(
  rgb: [number, number, number],
  bg: [number, number, number],
  target = 4.5
): [number, number, number] {
  let out = rgb;
  for (let i = 0; i < 24 && contrast(out, bg) < target; i++) {
    out = out.map((c) => c * 0.88) as [number, number, number];
  }
  return out;
}

export function readableOn(hex: string): string {
  const rgb = toRgb(hex);
  return luminance(rgb) > 0.45 ? "#0C0D0E" : "#FFFFFF";
}

/**
 * Admins pick one colour; the chip derives the rest. The background is a solid
 * tint (not alpha, which would show whatever sits behind it) and the text is
 * darkened until it clears 4.5:1 against that tint — so a pale yellow is as
 * readable as a deep blue.
 */
export function chipStyle(hex: string) {
  const base = toRgb(hex);
  const bg = mixWhite(base, 0.88);
  const text = darkenUntilReadable(base, bg);
  const border = mixWhite(base, 0.55);
  return {
    backgroundColor: toHex(bg),
    color: toHex(text),
    boxShadow: `inset 0 0 0 1px ${toHex(border)}`
  } as const;
}

/** The dot keeps the pure hue — it is decoration beside a readable label. */
export function dotColor(hex: string) {
  return toHex(darkenUntilReadable(toRgb(hex), mixWhite(toRgb(hex), 0.88), 3));
}
