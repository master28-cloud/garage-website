import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import StatusManager, { type StatusRow } from "./StatusManager";

export const dynamic = "force-dynamic";

export default async function StatusesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let statuses: StatusRow[] = [];
  try {
    const rows = await prisma.jobStatus.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: { _count: { select: { bookings: true } } }
    });
    statuses = rows.map((s) => ({
      id: s.id, name: s.name, slug: s.slug, color: s.color,
      sortOrder: s.sortOrder, isDefault: s.isDefault, isTerminal: s.isTerminal,
      inUse: s._count.bookings
    }));
  } catch { statuses = []; }

  return (
    <AdminShell email={session.email}>
      <StatusManager initial={statuses} />
    </AdminShell>
  );
}
