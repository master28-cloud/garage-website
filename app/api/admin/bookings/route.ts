import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}

export async function GET() {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { status: true }
  });
  return NextResponse.json({ bookings });
}

// Statuses are rows now, so the valid set is whatever the workshop has
// configured — it has to be checked against the table, not a literal union.
const patchSchema = z.object({
  id: z.string().cuid(),
  statusId: z.string().cuid()
});

export async function PATCH(req: Request) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const status = await prisma.jobStatus.findUnique({
    where: { id: parsed.data.statusId },
    select: { id: true, name: true }
  });
  if (!status) {
    return NextResponse.json({ error: "That status no longer exists." }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: parsed.data.id },
      data: { statusId: status.id },
      include: { status: true }
    });

    await prisma.auditLog.create({
      data: {
        actorEmail: s.email,
        action: "booking.status_change",
        entity: "Booking",
        entityId: booking.id,
        meta: { to: status.name, statusId: status.id }
      }
    });

    return NextResponse.json({ ok: true, booking });
  } catch {
    return NextResponse.json({ error: "Could not update the booking." }, { status: 503 });
  }
}
