import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MARKS = ["ring", "bars", "chevron", "dot", "shield"] as const;

async function requireAdmin() {
  const s = await getSession();
  return s && s.role === "ADMIN" ? s : null;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const partners = await prisma.partner.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  return NextResponse.json({ partners });
}

const baseFields = {
  name:  z.string().min(1).max(40),
  href:  z.string().url().startsWith("https://", "Links must start with https://"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour such as #D81F26"),
  mark:  z.enum(MARKS)
};

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = z.object(baseFields).safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  try {
    const max = await prisma.partner.aggregate({ _max: { sortOrder: true } });
    const partner = await prisma.partner.create({
      data: { ...parsed.data, sortOrder: (max._max.sortOrder ?? -1) + 1 }
    });

    await prisma.auditLog.create({
      data: {
        actorEmail: session.email, action: "partner.created",
        entity: "Partner", entityId: partner.id, meta: { name: partner.name }
      }
    });

    revalidateSite();
    return NextResponse.json({ ok: true, partner }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save." }, { status: 503 });
  }
}

const patchSchema = z.object({
  id: z.string().cuid(),
  name:  baseFields.name.optional(),
  href:  baseFields.href.optional(),
  color: baseFields.color.optional(),
  mark:  baseFields.mark.optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(999).optional()
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { id, ...data } = parsed.data;
  try {
    await prisma.partner.update({ where: { id }, data });
    revalidateSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update." }, { status: 503 });
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const p = await prisma.partner.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        actorEmail: session.email, action: "partner.deleted",
        entity: "Partner", entityId: id, meta: { name: p.name }
      }
    });
    revalidateSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete." }, { status: 503 });
  }
}
