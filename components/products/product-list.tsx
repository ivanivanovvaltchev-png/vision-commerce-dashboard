"use client";

import { ProductAvatar } from "@/components/products/product-avatar";
import { ProductFormDialog } from "@/components/products/product-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { estimateAverageProfit } from "@/lib/simulation";
import { useDashboardStore } from "@/lib/store";
import { Pencil, Plus, Trash2 } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

export function ProductList() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const products = useDashboardStore((s) => s.products);
  const addProduct = useDashboardStore((s) => s.addProduct);
  const updateProduct = useDashboardStore((s) => s.updateProduct);
  const removeProduct = useDashboardStore((s) => s.removeProduct);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Productos simulados</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Este catálogo alimenta el generador de pedidos del dashboard.
          </p>
        </div>
        <ProductFormDialog
          onSubmit={(draft) => addProduct({ id: crypto.randomUUID(), ...draft })}
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Nuevo producto
            </Button>
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No hay productos. Crea el primero para empezar a simular ventas.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Coste</TableHead>
                  <TableHead className="text-right">Beneficio neto medio</TableHead>
                  <TableHead className="text-right">Probabilidad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const netProfit = estimateAverageProfit(product);
                  const isAdvanced = Boolean(product.fixedQuantity);

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ProductAvatar name={product.name} />
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            {isAdvanced && (
                              <Badge variant="outline" className="mt-0.5 w-fit text-[10px]">
                                Pack real · {product.fixedQuantity} uds
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {formatCurrency(product.cost)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(netProfit)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        {product.probability}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <ProductFormDialog
                            product={product}
                            onSubmit={(draft) => updateProduct(product.id, draft)}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
