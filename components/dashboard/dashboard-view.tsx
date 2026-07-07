"use client";

import { useEffect, useMemo, useState } from "react";

import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { Greeting } from "@/components/dashboard/greeting";
import { HomeStatsBar } from "@/components/dashboard/home-stats-bar";
import { HourlySalesChart } from "@/components/dashboard/hourly-sales-chart";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";
import { computeHourlyStats, computeKpis } from "@/lib/derived";
import { computeVirtualTime } from "@/lib/simulation";
import { useDashboardStore } from "@/lib/store";

export function DashboardView() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const config = useDashboardStore((s) => s.config);
  const orders = useDashboardStore((s) => s.orders);
  const activity = useDashboardStore((s) => s.activity);
  const currentSessions = useDashboardStore((s) => s.currentSessions);
  const sessionsToday = useDashboardStore((s) => s.sessionsToday);
  const totals = useDashboardStore((s) => s.totals);
  const simStartedAt = useDashboardStore((s) => s.simStartedAt);
  const isRunning = useDashboardStore((s) => s.isRunning);
  const toggleRunning = useDashboardStore((s) => s.toggleRunning);
  const resetDay = useDashboardStore((s) => s.resetDay);

  const [now, setNow] = useState(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const interval = setInterval(tick, 1000);
    const timeout = setTimeout(tick, 0);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const virtualTime = useMemo(
    () => computeVirtualTime(config, simStartedAt, now),
    [config, simStartedAt, now]
  );

  const kpis = useMemo(
    () => computeKpis(totals, sessionsToday, config),
    [totals, sessionsToday, config]
  );
  const hourlyStats = useMemo(() => computeHourlyStats(orders), [orders]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
      <Greeting now={now} />

      <HomeStatsBar
        kpis={kpis}
        sessionsToday={sessionsToday}
        currentSessions={currentSessions}
        isRunning={isRunning}
        speed={config.speed}
        startTime={config.startTime}
        endTime={config.endTime}
        virtualTime={virtualTime}
        onToggleRunning={toggleRunning}
        onReset={resetDay}
      />

      <GoalsCard kpis={kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HourlySalesChart data={hourlyStats} />
        </div>
        <ActivityFeed events={activity} />
      </div>

      <RecentOrdersTable orders={orders} />
    </div>
  );
}
