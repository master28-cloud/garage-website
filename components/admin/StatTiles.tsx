import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type Stats = {
  allTime: number; today: number; pending: number; confirmed: number;
  inProgress: number; completed: number; cancelled: number;
  thisWeek: number; lastWeek: number;
};

function Delta({ now, before }: { now: number; before: number }) {
  if (before === 0 && now === 0) {
    return <span className="text-xs text-steel-light">no change</span>;
  }
  if (before === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <TrendingUp size={12} /> new
      </span>
    );
  }
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-steel">
        <Minus size={12} /> flat
      </span>
    );
  }
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-red-600"}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}{pct}%
    </span>
  );
}

export default function StatTiles({ stats }: { stats: Stats }) {
  const open = stats.pending + stats.confirmed + stats.inProgress;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Primary: demand this week, with the comparison that gives it meaning */}
      <div className="relative overflow-hidden rounded-2xl bg-ink p-7 text-white lg:col-span-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-signal/25 blur-2xl"
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-signal">
            Booked this week
          </p>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-6xl font-bold leading-none tracking-tightest">{stats.thisWeek}</span>
            <span className="mb-1.5">
              <Delta now={stats.thisWeek} before={stats.lastWeek} />
            </span>
          </div>
          <p className="mt-3 text-sm text-white/55">
            {stats.lastWeek} in the previous seven days
          </p>
        </div>
      </div>

      {/* Secondary tiles */}
      <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-4">
        <Tile label="In today" value={stats.today} hint="scheduled" accent />
        <Tile label="Open jobs" value={open} hint="not yet completed" />
        <Tile label="Awaiting confirmation" value={stats.pending} hint="needs a reply" warn={stats.pending > 0} />
        <Tile label="All time" value={stats.allTime} hint="bookings received" />
      </div>
    </div>
  );
}

function Tile({
  label, value, hint, accent, warn
}: { label: string; value: number; hint: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-xs font-medium text-steel">{label}</p>
      <div>
        <p className={`mt-4 text-4xl font-bold tracking-tight ${accent ? "text-signal" : "text-ink"}`}>
          {value}
        </p>
        <p className={`mt-1 text-xs ${warn ? "font-medium text-amber-600" : "text-steel-light"}`}>
          {hint}
        </p>
      </div>
    </div>
  );
}
