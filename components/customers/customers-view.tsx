"use client";

import { useMemo } from "react";

import { ProductAvatar } from "@/components/products/product-avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { computeCustomers } from "@/lib/derived";
import { useDashboardStore } from "@/lib/store";
import { Users } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

export function CustomersView() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const orders = useDashboardStore((s) => s.orders);

  const customers = useMemo(() => computeCustomers(orders), [orders]);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b px-4 py-2 text-sm font-medium">
            <span className="rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground">
              {customers.length} clientes
            </span>
          </div>

          {customers.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Todavía no hay clientes registrados. Aparecerán con la primera venta.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Total gastado</TableHead>
                  <TableHead className="text-right">Última compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.key}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProductAvatar name={customer.name} />
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.city}, {customer.country}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {customer.ordersCount}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(customer.lastOrderAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
