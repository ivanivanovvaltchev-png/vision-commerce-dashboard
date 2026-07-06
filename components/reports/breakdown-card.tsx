import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function BreakdownCard({ revenue }: { revenue: number }) {
  const rows = [
    { label: "Ventas brutas", value: revenue },
    { label: "Descuentos", value: 0 },
    { label: "Devoluciones", value: 0 },
    { label: "Ventas netas", value: revenue },
    { label: "Cargos de envío", value: 0 },
    { label: "Cargos por devolución", value: 0 },
    { label: "Impuestos", value: 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose de ventas totales</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="tabular-nums">{formatCurrency(row.value)}</span>
            </div>
            {index < rows.length - 1 && <Separator />}
          </div>
        ))}
        <Separator className="my-1" />
        <div className="flex items-center justify-between py-2 text-sm font-semibold">
          <span>Ventas totales</span>
          <span className="tabular-nums">{formatCurrency(revenue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
