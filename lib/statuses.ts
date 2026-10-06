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

/** Readable text on a given background — keeps chips legible whatever hue is picked. */
export function readableOn(hex: string): string {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.45 ? "#0C0D0E" : "#FFFFFF";
}

/** Soft tinted chip derived from one hex, so admins only ever pick one colour. */
export function chipStyle(hex: string) {
  return {
    backgroundColor: `${hex}1A`,
    color: hex,
    boxShadow: `inset 0 0 0 1px ${hex}44`
  } as const;
}
