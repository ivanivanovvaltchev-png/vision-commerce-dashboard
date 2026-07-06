import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniSparkline } from "@/components/reports/mini-sparkline";
import { HourlyStat } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

type Tile = {
  key: string;
  label: string;
  value: string;
  sparkline: number[];
  color: string;
};

export function ReportStatTiles({
  hourlyStats,
  revenue,
  fulfilledCount,
  ordersCount,
}: {
  hourlyStats: HourlyStat[];
  revenue: number;
  fulfilledCount: number;
  ordersCount: number;
}) {
  const revenueSeries = hourlyStats.map((s) => s.revenue);
  const ordersSeries = hourlyStats.map((s) => s.orders);

  const tiles: Tile[] = [
    {
      key: "gross",
      label: "Ventas brutas",
      value: formatCurrency(revenue),
      sparkline: revenueSeries,
      color: "#2a78d6",
    },
    {
      key: "fulfilled",
      label: "Pedidos preparados",
      value: fulfilledCount.toLocaleString("es-ES"),
      sparkline: ordersSeries,
      color: "#1baf7a",
    },
    {
      key: "orders",
      label: "Pedidos",
      value: ordersCount.toLocaleString("es-ES"),
      sparkline: ordersSeries,
      color: "#4a3aa7",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {tiles.map((tile) => (
        <Card key={tile.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {tile.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-xl font-semibold tabular-nums">{tile.value}</span>
            <MiniSparkline data={tile.sparkline} color={tile.color} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
