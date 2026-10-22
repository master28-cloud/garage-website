import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rateLimit";
import { getStatuses, chipStyle, dotColor } from "@/lib/statuses";
import { bookingReference, referenceSuffix, phoneKey, serviceLabel } from "@/lib/booking";

export const runtime = "nodejs";

const schema = z.object({
  reference: z.string().max(20),
  phone: z.string().max(20)
});

// Same answer whether the reference or the phone was wrong, so the endpoint
// can't be used to confirm that a reference exists.
const NOT_FOUND =
  "We couldn't find a booking with that reference and phone number. Check both against your WhatsApp confirmation.";

export async function POST(req: Request) {
  const rl = rateLimit(`track:${clientKey(req)}`, 10, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } }
    );
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  const suffix = parsed.success ? referenceSuffix(parsed.data.reference) : null;
  const phone = parsed.success ? phoneKey(parsed.data.phone) : "";
  if (!suffix || phone.length !== 9) {
    return NextResponse.json(
      { error: "Enter your booking reference (for example APG-7K3Q9X) and the phone number you booked with." },
      { status: 400 }
    );
  }

  try {
    // The reference is the tail of the cuid. The phone has to match too, so a
    // guessed reference on its own reveals nothing.
    const candidates = await prisma.booking.findMany({
      where: { id: { endsWith: suffix } },
      include: { status: true },
      take: 10
    });
    const b = candidates.find((c) => phoneKey(c.phone) === phone);
    if (!b) return NextResponse.json({ error: NOT_FOUND }, { status: 404 });

    // The journey is every open stage in order, finishing at the first closing
    // stage (Completed). Any other closing stage, such as Cancelled, is an exit
    // rather than a step, so it is reported on its own.
    const stages = await getStatuses();
    const finish = stages.find((s) => s.isTerminal);
    const journey = [...stages.filter((s) => !s.isTerminal), ...(finish ? [finish] : [])];
    const at = journey.findIndex((s) => s.id === b.statusId);
    const outcome = at === -1 ? "closed" : b.status.isTerminal ? "complete" : "active";

    return NextResponse.json(
      {
        reference: bookingReference(b.id),
        firstName: b.name.trim().split(/\s+/)[0],
        vehicle: [b.vehicleMake, b.vehicleModel, b.vehicleYear].filter(Boolean).join(" "),
        service: serviceLabel(b.service),
        preferredDate: b.preferredDate.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        outcome,
        stage: { name: b.status.name, chip: chipStyle(b.status.color), dot: dotColor(b.status.color) },
        steps:
          at === -1
            ? []
            : journey.map((s, i) => ({
                name: s.name,
                state: outcome === "complete" || i < at ? "done" : i === at ? "current" : "upcoming"
              }))
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[track] lookup failed:", e);
    return NextResponse.json(
      { error: "Tracking is unavailable right now. Please message us on WhatsApp instead." },
      { status: 503 }
    );
  }
}
