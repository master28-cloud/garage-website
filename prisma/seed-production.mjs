/**
 * Fills a fresh database with everything the site needs to render.
 * Idempotent: every block only fills gaps, so re-running is safe.
 *
 *   node --env-file=<file with DATABASE_URL> prisma/seed-production.mjs
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const STAGES = [
  { slug: "pending",     name: "Pending",     color: "#F59E0B", sortOrder: 0, isDefault: true,  isTerminal: false },
  { slug: "confirmed",   name: "Confirmed",   color: "#3B82F6", sortOrder: 1, isDefault: false, isTerminal: false },
  { slug: "in-progress", name: "In progress", color: "#FF5A1F", sortOrder: 2, isDefault: false, isTerminal: false },
  { slug: "completed",   name: "Completed",   color: "#10B981", sortOrder: 3, isDefault: false, isTerminal: true  },
  { slug: "cancelled",   name: "Cancelled",   color: "#94A3B8", sortOrder: 4, isDefault: false, isTerminal: true  }
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

// Self-hosted files in public/images/gallery, deployed with the site.
const g = (f) => `/images/gallery/${f}`;
const GALLERY = [
  { tag: "Collision",  title: "Front-end rebuild after a lamp-post strike", before: g("corsa-before.jpg"),  after: g("corsa-after.jpg") },
  { tag: "Recovery",   title: "Off the verge and back on the road",         before: g("fiesta-before.jpg"), after: g("fiesta-after.jpg") },
  { tag: "Structural", title: "Front end and airbags restored",             before: g("toyota-before.jpg"), after: g("toyota-after.jpg") }
];

for (const s of STAGES) {
  await prisma.jobStatus.upsert({ where: { slug: s.slug }, update: {}, create: s });
}

await prisma.siteSetting.upsert({
  where: { key: "whatsapp_number" },
  update: {},
  create: { key: "whatsapp_number", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254727718981" }
});

if ((await prisma.partner.count()) === 0) {
  await prisma.partner.createMany({ data: PARTNERS.map((p, i) => ({ ...p, sortOrder: i })) });
}

if ((await prisma.galleryItem.count()) === 0) {
  await prisma.galleryItem.createMany({
    data: GALLERY.map((x, i) => ({
      tag: x.tag, title: x.title, beforeUrl: x.before, afterUrl: x.after, sortOrder: i, published: true
    }))
  });
}

console.log("Seeded:", {
  jobStages: await prisma.jobStatus.count(),
  partners: await prisma.partner.count(),
  gallery: await prisma.galleryItem.count(),
  whatsapp: (await prisma.siteSetting.findUnique({ where: { key: "whatsapp_number" } }))?.value,
  bookings: await prisma.booking.count()
});

await prisma.$disconnect();
