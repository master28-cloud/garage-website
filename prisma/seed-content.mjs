/**
 * Moves the previously hard-coded content into the database so it becomes
 * editable from the admin dashboard. Safe to re-run: it only fills gaps.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

const GALLERY = [
  { tag: "Collision",    title: "Front-end impact rebuild",            before: u("photo-1597328290883-50c5787b7c7e"), after: u("photo-1774874441703-6cdc9f51a8ab") },
  { tag: "Bodywork",     title: "Front bumper and grille replacement", before: u("photo-1662541547523-118842914aa7"), after: u("photo-1758855307960-3a6339cb2c27") },
  { tag: "Panel & Paint",title: "Full respray after impact",           before: u("photo-1687867451910-28941a460f35"), after: u("photo-1767972885673-1cc21432a2ba") },
  { tag: "Structural",   title: "Chassis realignment",                 before: u("photo-1745845979138-be64a85272a5"), after: u("photo-1764023874797-43f097631e50") },
  { tag: "Recovery",     title: "Written-off to roadworthy",           before: u("photo-1673187139211-1e7ec3dd60ec"), after: u("photo-1653983476757-54dc3c9a4a7c") },
  { tag: "Insurance",    title: "Assessed, repaired, returned",        before: u("photo-1673187139612-6bf684a74815"), after: u("photo-1758793248110-f5c1d35e5a95") }
];

const PARTNERS = [
  { name: "AutoXpress",    href: "https://auto-xpress.co.ke",    color: "#D81F26", mark: "chevron" },
  { name: "CFAO Mobility", href: "https://cfaomobility.co.ke",   color: "#EB0A1E", mark: "ring" },
  { name: "Isuzu EA",      href: "https://www.isuzu.co.ke",      color: "#C8102E", mark: "bars" },
  { name: "Simba Corp",    href: "https://simbacorp.com",        color: "#0F7B3E", mark: "dot" },
  { name: "Jubilee",       href: "https://jubileeinsurance.com", color: "#00843D", mark: "shield" },
  { name: "Britam",        href: "https://britam.com",           color: "#F58220", mark: "dot" },
  { name: "APA Insurance", href: "https://www.apainsurance.org", color: "#005DAA", mark: "ring" }
];

await prisma.siteSetting.upsert({
  where:  { key: "whatsapp_number" },
  update: {},
  create: { key: "whatsapp_number", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254727718981" }
});

if ((await prisma.galleryItem.count()) === 0) {
  await prisma.galleryItem.createMany({
    data: GALLERY.map((g, i) => ({
      tag: g.tag, title: g.title,
      beforeUrl: g.before, afterUrl: g.after,
      sortOrder: i
    }))
  });
  console.log(`Seeded ${GALLERY.length} gallery items.`);
} else {
  console.log("Gallery already has rows, left alone.");
}

if ((await prisma.partner.count()) === 0) {
  await prisma.partner.createMany({
    data: PARTNERS.map((p, i) => ({ ...p, sortOrder: i }))
  });
  console.log(`Seeded ${PARTNERS.length} partners.`);
} else {
  console.log("Partners already exist, left alone.");
}

console.log("WhatsApp number:", (await prisma.siteSetting.findUnique({ where: { key: "whatsapp_number" } }))?.value);
await prisma.$disconnect();
