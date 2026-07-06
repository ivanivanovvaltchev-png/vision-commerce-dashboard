import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SALES_CHANNEL_LABEL } from "@/lib/order-display";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function ChannelCard({ revenue }: { revenue: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas totales por canal de ventas</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#2a78d6 0% 100%, #e1e0d9 100% 100%)`,
          }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-sm font-semibold">
            100%
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2a78d6]" />
            <span className="text-muted-foreground">{SALES_CHANNEL_LABEL}</span>
          </div>
          <span className="text-lg font-semibold tabular-nums">{formatCurrency(revenue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
