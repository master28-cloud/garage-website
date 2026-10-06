import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStatuses } from "@/lib/statuses";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

const DAY = 86_400_000;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const today = startOfDay(new Date());
  const tomorrow = new Date(today.getTime() + DAY);
  const weekAgo = new Date(today.getTime() - 7 * DAY);
  const twoWeeksAgo = new Date(today.getTime() - 14 * DAY);
  const scheduleFrom = new Date(today.getTime() - 3 * DAY);
  const scheduleTo = new Date(today.getTime() + 11 * DAY);

  try {
    const [statuses, recent, byStatus, allTime, thisWeek, lastWeek, scheduleRows, serviceRows] =
      await Promise.all([
        getStatuses(),
        prisma.booking.findMany({
          orderBy: { createdAt: "desc" },
          take: 100,
          include: { status: true }
        }),
        prisma.booking.groupBy({ by: ["statusId"], _count: { _all: true } }),
        prisma.booking.count(),
        prisma.booking.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.booking.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
        prisma.booking.findMany({
          where: { preferredDate: { gte: scheduleFrom, lt: scheduleTo } },
          select: { preferredDate: true }
        }),
        prisma.booking.groupBy({ by: ["service"], _count: { _all: true } })
      ]);

    const countFor = (id: string) =>
      byStatus.find((r) => r.statusId === id)?._count._all ?? 0;

    // Counts follow whatever stages exist, rather than four fixed names.
    const statusCounts = statuses.map((s) => ({
      id: s.id, name: s.name, color: s.color,
      count: countFor(s.id), isTerminal: s.isTerminal
    }));

    const open = statusCounts
      .filter((s) => !s.isTerminal)
      .reduce((n, s) => n + s.count, 0);

    const firstOpen = statusCounts.find((s) => !s.isTerminal);

    const schedule = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(scheduleFrom.getTime() + i * DAY);
      const next = new Date(date.getTime() + DAY);
      return {
        date: date.toISOString(),
        count: scheduleRows.filter((r) => r.preferredDate >= date && r.preferredDate < next).length,
        isToday: date.getTime() === today.getTime(),
        isPast: date < today
      };
    });

    const serviceMix = serviceRows
      .map((r) => ({ service: r.service, count: r._count._all }))
      .sort((a, b) => b.count - a.count);

    const todays = recent
      .filter((b) => b.preferredDate >= today && b.preferredDate < tomorrow)
      .sort((a, b) => a.preferredDate.getTime() - b.preferredDate.getTime());

    const stats = {
      allTime,
      today: todays.length,
      open,
      firstOpenName: firstOpen?.name ?? "Open",
      firstOpenCount: firstOpen?.count ?? 0,
      thisWeek,
      lastWeek
    };

    return (
      <DashboardClient
        sessionEmail={session.email}
        initialBookings={JSON.parse(JSON.stringify(recent))}
        todays={JSON.parse(JSON.stringify(todays))}
        statuses={statuses}
        statusCounts={statusCounts}
        stats={stats}
        schedule={schedule}
        serviceMix={serviceMix}
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
