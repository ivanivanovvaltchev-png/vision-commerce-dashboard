"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HourlyStat } from "@/lib/types";
import {
  Bar,
  BarChart,
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

type TooltipPayloadItem = {
  payload: HourlyStat;
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const stat = payload[0].payload;

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="mb-1 font-medium text-popover-foreground">
        {formatHourLabel(stat.hour)}
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--series-1)" }} />
        <span>Facturación</span>
        <span className="ml-auto tabular-nums font-medium text-popover-foreground">
          {formatCurrency(stat.revenue)}
        </span>
      </div>
      <div className="text-xs text-muted-foreground">{stat.orders} pedidos</div>
    </div>
  );
}

export function HourlySalesChart({ data }: { data: HourlyStat[] }) {
  return (
    <Card
      className="viz-root"
      style={
        {
          "--series-1": "#2a78d6",
          "--grid-line": "#e1e0d9",
          "--axis-ink": "#898781",
        } as React.CSSProperties
      }
    >
      <CardHeader>
        <CardTitle>Ventas por hora</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--grid-line)", opacity: 0.4 }} />
              <Bar dataKey="revenue" name="Facturación" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
