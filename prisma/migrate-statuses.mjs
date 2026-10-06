/**
 * Moves bookings off the fixed BookingStatus enum and onto the editable
 * JobStatus table. Safe to re-run: it only fills rows that are still unset.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const SEED = [
  { slug: "pending",     name: "Pending",     color: "#F59E0B", sortOrder: 0, isDefault: true,  isTerminal: false },
  { slug: "confirmed",   name: "Confirmed",   color: "#3B82F6", sortOrder: 1, isDefault: false, isTerminal: false },
  { slug: "in-progress", name: "In progress", color: "#FF5A1F", sortOrder: 2, isDefault: false, isTerminal: false },
  { slug: "completed",   name: "Completed",   color: "#10B981", sortOrder: 3, isDefault: false, isTerminal: true  },
  { slug: "cancelled",   name: "Cancelled",   color: "#94A3B8", sortOrder: 4, isDefault: false, isTerminal: true  }
];

// old enum value -> new slug
const MAP = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};

for (const s of SEED) {
  await prisma.jobStatus.upsert({ where: { slug: s.slug }, update: {}, create: s });
}
console.log(`Statuses in table: ${await prisma.jobStatus.count()}`);

const statuses = await prisma.jobStatus.findMany();
const bySlug = Object.fromEntries(statuses.map((s) => [s.slug, s.id]));

const unset = await prisma.booking.findMany({
  where: { statusId: null },
  select: { id: true, status: true }
});

let moved = 0;
for (const b of unset) {
  const slug = MAP[b.status] ?? "pending";
  await prisma.booking.update({ where: { id: b.id }, data: { statusId: bySlug[slug] } });
  moved++;
}

console.log(`Backfilled ${moved} booking(s).`);
console.log(`Still unmapped: ${await prisma.booking.count({ where: { statusId: null } })}`);

for (const s of await prisma.jobStatus.findMany({ orderBy: { sortOrder: "asc" } })) {
  const n = await prisma.booking.count({ where: { statusId: s.id } });
  console.log(`  ${s.name.padEnd(12)} ${n}`);
}

await prisma.$disconnect();
