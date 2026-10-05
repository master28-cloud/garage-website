import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppUrl, bookingMessage } from "@/lib/whatsapp";
import { rateLimit, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().regex(/^(\+254|0)[17]\d{8}$/, "Enter a valid Kenyan phone number"),
  email: z.string().email().optional().or(z.literal("")),
  vehicleMake: z.string().min(2).max(40),
  vehicleModel: z.string().min(1).max(40),
  vehicleYear: z.string().optional(),
  service: z.enum([
    "ENGINE_DIAGNOSTICS","PANEL_BEATING","WHEEL_ALIGNMENT","BRAKE_SUSPENSION",
    "AC_SERVICING","ELECTRICAL","PRE_PURCHASE_INSPECTION","INSURANCE_CLAIM","OTHER"
  ]),
  preferredDate: z.string().min(4),
  notes: z.string().max(500).optional().or(z.literal("")),
  consentPrivacy: z.union([z.literal("1"), z.literal("on")]),
  consentMarket: z.union([z.literal("1"), z.literal("on")]).optional()
});

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: Request) {
  const key = clientKey(req);
  const rl = rateLimit(`bookings:${key}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests, please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } }
    );
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }
  const d = parsed.data;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          || req.headers.get("x-real-ip")
          || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "";

  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        name: d.name.trim(),
        phone: d.phone.trim(),
        email: d.email?.trim() || null,
        vehicleMake: d.vehicleMake.trim(),
        vehicleModel: d.vehicleModel.trim(),
        vehicleYear: d.vehicleYear ? Number(d.vehicleYear) : null,
        service: d.service,
        preferredDate: new Date(d.preferredDate),
        notes: d.notes?.trim() || null,
        status: "PENDING",
        consentPrivacy: true,
        consentMarket: !!d.consentMarket,
        ipHash: hashIp(ip),
        userAgent: ua.slice(0, 200)
      },
      select: { id: true, name: true, phone: true, vehicleMake: true, vehicleModel: true, service: true, preferredDate: true }
    });
  } catch (e) {
    console.error("[bookings] database write failed:", e);
    return NextResponse.json(
      { error: "We couldn't save your booking right now. Please call us on +254 727 718 981." },
      { status: 503 }
    );
  }

  const reference = `APG-${booking.id.slice(-6).toUpperCase()}`;
  const whatsappUrl = buildWhatsAppUrl(
    bookingMessage({
      reference,
      name: booking.name,
      phone: booking.phone,
      vehicleMake: booking.vehicleMake,
      vehicleModel: booking.vehicleModel,
      service: booking.service.replace(/_/g, " "),
      preferredDate: booking.preferredDate.toISOString().slice(0, 10)
    })
  );

  return NextResponse.json({ ok: true, reference, whatsappUrl }, { status: 201 });
}
