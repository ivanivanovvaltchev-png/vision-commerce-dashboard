import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductAggregate } from "@/lib/derived";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function TopProductsCard({ products }: { products: ProductAggregate[] }) {
  const maxRevenue = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas totales por producto</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {products.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Sin ventas todavía.</p>
        ) : (
          products.map((product) => (
            <div key={product.productId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium">{product.productName}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCurrency(product.revenue)}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[#2a78d6]"
                  style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
