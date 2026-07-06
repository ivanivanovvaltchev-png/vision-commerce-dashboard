import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniSparkline } from "@/components/reports/mini-sparkline";
import { HourlyStat } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function AvgTicketCard({ data, averageTicket }: { data: HourlyStat[]; averageTicket: number }) {
  const perHourAvg = data.map((stat) => (stat.orders > 0 ? stat.revenue / stat.orders : 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valor medio del pedido a lo largo del tiempo</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-semibold tabular-nums">{formatCurrency(averageTicket)}</span>
        <MiniSparkline data={perHourAvg} color="#1baf7a" />
      </CardContent>
    </Card>
  );
}
