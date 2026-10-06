import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

async function requireAdmin() {
  const s = await getSession();
  return s && s.role === "ADMIN" ? s : null;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const statuses = await prisma.jobStatus.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { bookings: true } } }
  });
  return NextResponse.json({
    statuses: statuses.map((s) => ({
      id: s.id, name: s.name, slug: s.slug, color: s.color,
      sortOrder: s.sortOrder, isDefault: s.isDefault, isTerminal: s.isTerminal,
      inUse: s._count.bookings
    }))
  });
}

const createSchema = z.object({
  name: z.string().min(1).max(40),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Pick a colour"),
  isTerminal: z.boolean().optional()
});

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const slug = slugify(parsed.data.name);
  if (!slug) return NextResponse.json({ error: "Give the stage a name." }, { status: 400 });

  if (await prisma.jobStatus.findUnique({ where: { slug } })) {
    return NextResponse.json({ error: "A stage with that name already exists." }, { status: 409 });
  }

  const max = await prisma.jobStatus.aggregate({ _max: { sortOrder: true } });
  const status = await prisma.jobStatus.create({
    data: {
      name: parsed.data.name.trim(),
      slug,
      color: parsed.data.color,
      isTerminal: parsed.data.isTerminal ?? false,
      sortOrder: (max._max.sortOrder ?? -1) + 1
    }
  });

  await prisma.auditLog.create({
    data: {
      actorEmail: session.email, action: "status.created",
      entity: "JobStatus", entityId: status.id, meta: { name: status.name }
    }
  });

  revalidatePath("/admin/dashboard");
  return NextResponse.json({ ok: true, status }, { status: 201 });
}

const patchSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(40).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  isDefault: z.boolean().optional(),
  isTerminal: z.boolean().optional()
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });

  const { id, ...data } = parsed.data;

  try {
    // Exactly one default, or new bookings would have nowhere to land.
    if (data.isDefault === true) {
      await prisma.$transaction([
        prisma.jobStatus.updateMany({ where: { NOT: { id } }, data: { isDefault: false } }),
        prisma.jobStatus.update({ where: { id }, data })
      ]);
    } else {
      if (data.isDefault === false) {
        const current = await prisma.jobStatus.findUnique({ where: { id }, select: { isDefault: true } });
        if (current?.isDefault) {
          return NextResponse.json(
            { error: "Pick another stage as the default first — new bookings need somewhere to go." },
            { status: 400 }
          );
        }
      }
      await prisma.jobStatus.update({ where: { id }, data });
    }

    revalidatePath("/admin/dashboard");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save." }, { status: 503 });
  }
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const status = await prisma.jobStatus.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } }
  });
  if (!status) return NextResponse.json({ error: "Already gone." }, { status: 404 });

  // Guard rails: the FK is Restrict, so surface the reason rather than a 500.
  if (status._count.bookings > 0) {
    return NextResponse.json(
      {
        error: `${status._count.bookings} booking${status._count.bookings === 1 ? " is" : "s are"} still on "${status.name}". Move them to another stage first.`
      },
      { status: 409 }
    );
  }
  if (status.isDefault) {
    return NextResponse.json(
      { error: "That is the default stage. Make another one the default first." },
      { status: 409 }
    );
  }
  if ((await prisma.jobStatus.count()) <= 1) {
    return NextResponse.json({ error: "You need at least one stage." }, { status: 409 });
  }

  try {
    await prisma.jobStatus.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        actorEmail: session.email, action: "status.deleted",
        entity: "JobStatus", entityId: id, meta: { name: status.name }
      }
    });
    revalidatePath("/admin/dashboard");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete." }, { status: 503 });
  }
}
