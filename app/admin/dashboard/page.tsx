import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [bookings, totals] = await Promise.all([
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.booking.groupBy({ by: ["status"], _count: { _all: true } })
  ]);

  const stats = {
    total: bookings.length,
    pending:   totals.find((t) => t.status === "PENDING")?._count._all   ?? 0,
    confirmed: totals.find((t) => t.status === "CONFIRMED")?._count._all ?? 0,
    completed: totals.find((t) => t.status === "COMPLETED")?._count._all ?? 0
  };

  return <DashboardClient
    sessionEmail={session.email}
    initialBookings={JSON.parse(JSON.stringify(bookings))}
    stats={stats}
  />;
}
