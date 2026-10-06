import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { readImageUpload } from "@/lib/upload";

export const runtime = "nodejs";

async function requireAdmin() {
  const s = await getSession();
  return s && s.role === "ADMIN" ? s : null;
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/our-work");
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true, tag: true, title: true, sortOrder: true, published: true,
      beforeUrl: true, afterUrl: true, beforeId: true, afterId: true
    }
  });

  return NextResponse.json({
    items: items.map((i) => ({
      ...i,
      before: i.beforeId ? `/api/media/${i.beforeId}` : i.beforeUrl,
      after:  i.afterId  ? `/api/media/${i.afterId}`  : i.afterUrl
    }))
  });
}

/** Create a pair, or replace one side's image. multipart/form-data. */
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try { form = await req.formData(); }
  catch { return NextResponse.json({ error: "Expected a form upload." }, { status: 400 }); }

  const id    = String(form.get("id") ?? "");
  const tag   = String(form.get("tag") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();

  const stored: { beforeId?: string; afterId?: string } = {};

  for (const side of ["before", "after"] as const) {
    const file = form.get(side);
    if (!file || !(file instanceof File) || file.size === 0) continue;

    const result = await readImageUpload(file);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

    const asset = await prisma.mediaAsset.create({
      data: {
        mimeType: result.mimeType,
        bytes: result.bytes,
        data: result.buffer,
        alt: `${title || "Gallery image"} — ${side}`
      },
      select: { id: true }
    });
    stored[side === "before" ? "beforeId" : "afterId"] = asset.id;
  }

  try {
    if (id) {
      const existing = await prisma.galleryItem.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: "That item no longer exists." }, { status: 404 });

      await prisma.galleryItem.update({
        where: { id },
        data: {
          ...(tag ? { tag } : {}),
          ...(title ? { title } : {}),
          ...(stored.beforeId ? { beforeId: stored.beforeId, beforeUrl: null } : {}),
          ...(stored.afterId  ? { afterId:  stored.afterId,  afterUrl:  null } : {})
        }
      });
    } else {
      if (!tag || !title)
        return NextResponse.json({ error: "Category and title are required." }, { status: 400 });
      if (!stored.beforeId || !stored.afterId)
        return NextResponse.json({ error: "A new item needs both a before and an after image." }, { status: 400 });

      const max = await prisma.galleryItem.aggregate({ _max: { sortOrder: true } });
      await prisma.galleryItem.create({
        data: {
          tag, title,
          beforeId: stored.beforeId,
          afterId: stored.afterId,
          sortOrder: (max._max.sortOrder ?? -1) + 1
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        actorEmail: session.email,
        action: id ? "gallery.updated" : "gallery.created",
        entity: "GalleryItem",
        entityId: id || null,
        meta: { title, tag }
      }
    });

    revalidateSite();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[gallery] save failed:", e);
    return NextResponse.json({ error: "Could not save. Please try again." }, { status: 503 });
  }
}

const patchSchema = z.object({
  id: z.string().cuid(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
  tag: z.string().min(1).max(40).optional(),
  title: z.string().min(1).max(120).optional()
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { id, ...data } = parsed.data;
  try {
    await prisma.galleryItem.update({ where: { id }, data });
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
    const item = await prisma.galleryItem.delete({ where: { id } });

    // Drop the uploaded blobs too, or they sit in the database forever.
    const orphans = [item.beforeId, item.afterId].filter(Boolean) as string[];
    if (orphans.length) {
      await prisma.mediaAsset.deleteMany({ where: { id: { in: orphans } } });
    }

    await prisma.auditLog.create({
      data: {
        actorEmail: session.email,
        action: "gallery.deleted",
        entity: "GalleryItem",
        entityId: id,
        meta: { title: item.title }
      }
    });

    revalidateSite();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete." }, { status: 503 });
  }
}
