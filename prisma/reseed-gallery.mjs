/**
 * Gallery placeholders, matched on make, model, colour AND camera angle, so the
 * sweep reads as one car rather than two photographs.
 *
 * Files live in public/images/gallery/ — self-hosted, cropped to the exact
 * card ratio (16:9 hero, 3:2 cards), and two mirrored so each pair faces the
 * same way. Mirroring is only done where no asymmetric badge or lettering is
 * readable: the crashed Corsa (front badge destroyed) and the Toyota 86 (oval
 * logo is symmetric). Sources: Pexels and Unsplash, both licensed for free
 * commercial use with modification.
 *
 * Still different vehicles either side. Replace with your own intake and
 * handover photos from the admin Gallery tab — no code needed.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const g = (f) => `/images/gallery/${f}`;

const PAIRS = [
  {
    // hero: shown full width, 16:9
    tag: "Collision",
    title: "Front-end rebuild after a lamp-post strike",
    before: g("corsa-before.jpg"),   // Vauxhall Corsa D, silver, into a lamp post
    after:  g("corsa-after.jpg")     // Vauxhall Corsa D, silver, same angle
  },
  {
    tag: "Recovery",
    title: "Off the verge and back on the road",
    before: g("fiesta-before.jpg"),  // Ford Fiesta Mk7, nose-down in a ditch, rear three-quarter
    after:  g("fiesta-after.jpg")    // Ford Fiesta ST Mk7, rear three-quarter
  },
  {
    tag: "Structural",
    title: "Front end and airbags restored",
    before: g("toyota-before.jpg"),  // white coupe, front destroyed, airbags deployed
    after:  g("toyota-after.jpg")    // white Toyota 86, same direction
  }
];

const existing = await prisma.galleryItem.findMany({ select: { beforeId: true, afterId: true } });
const blobIds = existing.flatMap((x) => [x.beforeId, x.afterId]).filter(Boolean);

await prisma.galleryItem.deleteMany({});
if (blobIds.length) {
  await prisma.mediaAsset.deleteMany({ where: { id: { in: blobIds } } });
  console.log(`Removed ${blobIds.length} orphaned image blob(s).`);
}

await prisma.galleryItem.createMany({
  data: PAIRS.map((p, i) => ({
    tag: p.tag, title: p.title,
    beforeUrl: p.before, afterUrl: p.after,
    sortOrder: i, published: true
  }))
});

for (const x of await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } })) {
  console.log(`  ${x.sortOrder}  ${x.tag.padEnd(11)} ${x.title}`);
}
await prisma.$disconnect();
