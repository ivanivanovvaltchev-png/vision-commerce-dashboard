"use client";

import { useMemo } from "react";

import { AvgTicketCard } from "@/components/reports/avg-ticket-card";
import { BreakdownCard } from "@/components/reports/breakdown-card";
import { ChannelCard } from "@/components/reports/channel-card";
import { ReportStatTiles } from "@/components/reports/report-stat-tiles";
import { SalesTrendCard } from "@/components/reports/sales-trend-card";
import { TopProductsCard } from "@/components/reports/top-products-card";
import { Button } from "@/components/ui/button";
import { computeHourlyStats, computeKpis, computeTopProducts } from "@/lib/derived";
import { useDashboardStore } from "@/lib/store";
import { BarChart3 } from "lucide-react";

export function ReportsView() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const orders = useDashboardStore((s) => s.orders);
  const config = useDashboardStore((s) => s.config);
  const sessionsToday = useDashboardStore((s) => s.sessionsToday);

  const hourlyStats = useMemo(() => computeHourlyStats(orders), [orders]);
  const kpis = useMemo(
    () => computeKpis(orders, sessionsToday, config),
    [orders, sessionsToday, config]
  );
  const topProducts = useMemo(() => computeTopProducts(orders), [orders]);
  const fulfilledCount = useMemo(
    () => orders.filter((o) => o.status === "Fulfilled").length,
    [orders]
  );

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Informes y estadísticas</h1>
        </div>
        <Button variant="outline" size="sm" disabled title="Próximamente">
          Nueva exploración
        </Button>
      </div>

      <ReportStatTiles
        hourlyStats={hourlyStats}
        revenue={kpis.revenue}
        fulfilledCount={fulfilledCount}
        ordersCount={kpis.ordersCount}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendCard data={hourlyStats} totalRevenue={kpis.revenue} />
        </div>
        <BreakdownCard revenue={kpis.revenue} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChannelCard revenue={kpis.revenue} />
        <AvgTicketCard data={hourlyStats} averageTicket={kpis.averageTicket} />
        <TopProductsCard products={topProducts} />
      </div>
    </div>
  );
}
