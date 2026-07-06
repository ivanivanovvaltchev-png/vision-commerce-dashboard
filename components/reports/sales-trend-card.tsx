"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HourlyStat } from "@/lib/types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}h`;
}

type TooltipPayloadItem = { payload: HourlyStat };

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const stat = payload[0].payload;

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="mb-1 font-medium text-popover-foreground">{formatHourLabel(stat.hour)}</div>
      <div className="tabular-nums font-medium text-popover-foreground">
        {formatCurrency(stat.revenue)}
      </div>
    </div>
  );
}

export function SalesTrendCard({
  data,
  totalRevenue,
}: {
  data: HourlyStat[];
  totalRevenue: number;
}) {
  return (
    <Card
      className="viz-root"
      style={{ "--series-1": "#2a78d6", "--grid-line": "#e1e0d9", "--axis-ink": "#898781" } as React.CSSProperties}
    >
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Ventas totales a lo largo del tiempo
        </CardTitle>
        <p className="text-2xl font-semibold tabular-nums">{formatCurrency(totalRevenue)}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--grid-line)" />
              <XAxis
                dataKey="hour"
                tickFormatter={formatHourLabel}
                stroke="var(--axis-ink)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                interval={1}
              />
              <YAxis
                tickFormatter={(v) => formatCurrency(v)}
                stroke="var(--axis-ink)"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={64}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--series-1)"
                strokeWidth={2}
                fill="url(#reportRevenueFill)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
