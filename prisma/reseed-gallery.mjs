/**
 * Replaces the stock gallery pairs.
 *
 * Every image below was downloaded and looked at before being used, not
 * picked from alt text — that is how a laptop and a Mk4 Golf got through
 * earlier. Each one is landscape, because the cards crop 4:3 and a portrait
 * source collapses to a middle band.
 *
 * before = genuine collision damage.
 * after  = an ordinary car in a real working garage, rather than a studio
 *          glamour shot, which is what made the previous set read as stock.
 *
 * These are still different vehicles either side. Replace with your own
 * intake and handover photos — see public/images/gallery/README.md.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
const us = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

const PAIRS = [
  {
    tag: "Collision",
    title: "Front-end impact rebuild",
    // white hatchback, front destroyed, airbag deployed -> white saloon on a two-post lift
    before: us("photo-1687867451910-28941a460f35"),
    after:  px(4116170)
  },
  {
    tag: "Structural",
    title: "Chassis realignment after impact",
    // silver Corsa into a lamp post -> silver cars on lifts in a body shop
    before: px(38339706),
    after:  px(33814734)
  },
  {
    tag: "Panel & Paint",
    title: "Bonnet and front panel replacement",
    // silver car, crushed bonnet and headlight -> silver hatchback back in the bay
    before: us("photo-1597328290883-50c5787b7c7e"),
    after:  px(3807386)
  },
  {
    tag: "Recovery",
    title: "Off the verge, back on the road",
    // black Fiesta in a ditch, bumper torn off -> Forester up on the ramp
    before: px(11985216),
    after:  px(8986033)
  }
];

const existing = await prisma.galleryItem.findMany({
  select: { id: true, beforeId: true, afterId: true }
});

// Drop uploaded blobs too, or they orphan in the database.
const blobIds = existing.flatMap((g) => [g.beforeId, g.afterId]).filter(Boolean);
await prisma.galleryItem.deleteMany({});
if (blobIds.length) {
  await prisma.mediaAsset.deleteMany({ where: { id: { in: blobIds } } });
  console.log(`Removed ${blobIds.length} orphaned image blob(s).`);
}

await prisma.galleryItem.createMany({
  data: PAIRS.map((p, i) => ({
    tag: p.tag,
    title: p.title,
    beforeUrl: p.before,
    afterUrl: p.after,
    sortOrder: i,
    published: true
  }))
});

console.log(`Gallery rebuilt with ${PAIRS.length} pairs:`);
for (const g of await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } })) {
  console.log(`  ${g.sortOrder}  ${g.tag.padEnd(14)} ${g.title}`);
}

await prisma.$disconnect();
