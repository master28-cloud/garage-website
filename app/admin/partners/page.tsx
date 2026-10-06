import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import PartnersManager from "./PartnersManager";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let partners: {
    id: string; name: string; href: string; color: string; mark: string;
    published: boolean; sortOrder: number;
  }[] = [];

  try {
    partners = await prisma.partner.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, href: true, color: true, mark: true, published: true, sortOrder: true }
    });
  } catch { partners = []; }

  return (
    <AdminShell email={session.email}>
      <PartnersManager initial={partners} />
    </AdminShell>
  );
}
