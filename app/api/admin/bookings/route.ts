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
    take: 200
  });
  return NextResponse.json({ bookings });
}

const patchSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(["PENDING","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED"])
});

export async function PATCH(req: Request) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const booking = await prisma.booking.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status }
  });

  await prisma.auditLog.create({
    data: {
      actorEmail: s.email,
      action: "booking.status_change",
      entity: "Booking",
      entityId: booking.id,
      meta: { to: parsed.data.status }
    }
  });

  return NextResponse.json({ ok: true, booking });
}
