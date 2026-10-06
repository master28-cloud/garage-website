import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import GalleryManager from "./GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let items: Awaited<ReturnType<typeof load>> = [];
  try { items = await load(); } catch { items = []; }

  return (
    <AdminShell email={session.email}>
      <GalleryManager initial={items} />
    </AdminShell>
  );
}

async function load() {
  const rows = await prisma.galleryItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true, tag: true, title: true, published: true, sortOrder: true,
      beforeUrl: true, afterUrl: true, beforeId: true, afterId: true
    }
  });
  return rows.map((r) => ({
    id: r.id,
    tag: r.tag,
    title: r.title,
    published: r.published,
    sortOrder: r.sortOrder,
    before: r.beforeId ? `/api/media/${r.beforeId}` : r.beforeUrl ?? "",
    after:  r.afterId  ? `/api/media/${r.afterId}`  : r.afterUrl  ?? "",
    usesUpload: Boolean(r.beforeId || r.afterId)
  }));
}
