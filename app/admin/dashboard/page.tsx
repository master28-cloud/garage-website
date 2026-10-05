import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  try {
    const [bookings, totals, todayCount, allTime] = await Promise.all([
      prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.booking.count({ where: { preferredDate: { gte: startOfToday, lt: endOfToday } } }),
      prisma.booking.count()
    ]);

    const by = (s: string) => totals.find((t) => t.status === s)?._count._all ?? 0;

    const stats = {
      allTime,
      today: todayCount,
      pending:    by("PENDING"),
      confirmed:  by("CONFIRMED"),
      inProgress: by("IN_PROGRESS"),
      completed:  by("COMPLETED"),
      cancelled:  by("CANCELLED")
    };

    return (
      <DashboardClient
        sessionEmail={session.email}
        initialBookings={JSON.parse(JSON.stringify(bookings))}
        stats={stats}
      />
    );
  } catch {
    return <DatabaseUnavailable email={session.email} />;
  }
}

function DatabaseUnavailable({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-ink px-5 py-20 text-white">
      <div className="container-x max-w-2xl">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tightest">Database not connected</h1>
        <p className="mt-5 leading-relaxed text-white/70">
          You are signed in as {email}, but the bookings database is unreachable. Check that
          the PostgreSQL service is running, or that{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">DATABASE_URL</code> in{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">.env</code> points at a live database.
        </p>
        <ol className="mt-8 space-y-4 text-white/80">
          {[
            <>Confirm the service is up: <code className="rounded bg-white/10 px-1.5 py-0.5">Get-Service postgresql*</code></>,
            <>Or point <code className="rounded bg-white/10 px-1.5 py-0.5">DATABASE_URL</code> at your Neon project.</>,
            <>Run <code className="rounded bg-white/10 px-1.5 py-0.5">npx prisma db push</code> to create the tables.</>,
            <>Reload this page.</>
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-signal text-sm font-bold">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
