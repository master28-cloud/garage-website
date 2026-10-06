import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { normalizeKenyanNumber, WHATSAPP_KEY } from "@/lib/content";

export const runtime = "nodejs";

async function requireAdmin() {
  const s = await getSession();
  return s && s.role === "ADMIN" ? s : null;
}

/** Every page that renders the WhatsApp number or gallery/partner content. */
function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/our-work");
  revalidatePath("/services");
  revalidatePath("/about");
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.siteSetting.findMany();
  return NextResponse.json({
    settings: Object.fromEntries(rows.map((r) => [r.key, r.value]))
  });
}

const schema = z.object({ whatsapp: z.string().min(9).max(20) });

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Enter a phone number." }, { status: 400 });

  const normalized = normalizeKenyanNumber(parsed.data.whatsapp);
  if (!normalized) {
    return NextResponse.json(
      { error: "That doesn't look like a Kenyan mobile number. Try 0727718981 or +254727718981." },
      { status: 400 }
    );
  }

  try {
    await prisma.siteSetting.upsert({
      where:  { key: WHATSAPP_KEY },
      update: { value: normalized },
      create: { key: WHATSAPP_KEY, value: normalized }
    });

    await prisma.auditLog.create({
      data: {
        actorEmail: session.email,
        action: "setting.whatsapp_changed",
        entity: "SiteSetting",
        entityId: WHATSAPP_KEY,
        meta: { to: normalized }
      }
    });

    revalidateSite();
    return NextResponse.json({ ok: true, whatsapp: normalized });
  } catch (e) {
    console.error("[settings] save failed:", e);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 503 });
  }
}
