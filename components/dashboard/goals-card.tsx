import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Kpis } from "@/lib/derived";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

type Goal = {
  key: string;
  label: string;
  actualLabel: string;
  targetLabel: string;
  progress: number;
};

export function GoalsCard({ kpis }: { kpis: Kpis }) {
  const goals: Goal[] = [
    {
      key: "revenue",
      label: "Facturación",
      actualLabel: formatCurrency(kpis.revenue),
      targetLabel: formatCurrency(kpis.targetRevenue),
      progress: kpis.revenueProgress,
    },
    {
      key: "profit",
      label: "Beneficio",
      actualLabel: formatCurrency(kpis.profit),
      targetLabel: formatCurrency(kpis.targetProfit),
      progress: kpis.profitProgress,
    },
    {
      key: "orders",
      label: "Pedidos",
      actualLabel: kpis.ordersCount.toLocaleString("es-ES"),
      targetLabel: kpis.targetOrders.toLocaleString("es-ES"),
      progress: kpis.ordersProgress,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivos del día</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {goals.map((goal) => (
          <div key={goal.key} className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-sm">
              <span className="font-medium">{goal.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {goal.actualLabel} / {goal.targetLabel}
              </span>
            </div>
            <Progress value={goal.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
