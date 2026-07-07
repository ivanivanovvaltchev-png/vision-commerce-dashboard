"use client";

import { FulfillmentStatusBadge } from "@/components/orders/fulfillment-status-badge";
import { PaymentStatusBadge } from "@/components/orders/payment-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  itemsLabel,
  orderNumberLabel,
  SALES_CHANNEL_LABEL,
} from "@/lib/order-display";
import { useDashboardStore } from "@/lib/store";
import { Inbox, Package } from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(value);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString("es-ES", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersView() {
  const hasHydrated = useDashboardStore((s) => s.hasHydrated);
  const orders = useDashboardStore((s) => s.orders);

  if (!hasHydrated) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Exportar
          </Button>
          <Button size="sm" disabled title="Los pedidos se generan automáticamente por la simulación">
            Crear pedido
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b px-4 py-2 text-sm font-medium">
            <span className="rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground">
              Todos ({orders.length})
            </span>
          </div>

          {orders.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Todavía no hay pedidos. Arrancarán en cuanto la simulación esté en marcha.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Estado del pago</TableHead>
                  <TableHead>Estado de preparación</TableHead>
                  <TableHead className="text-right">Artículos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{orderNumberLabel(order)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {SALES_CHANNEL_LABEL}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <FulfillmentStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 justify-end">
                        <Package className="h-3.5 w-3.5" />
                        {itemsLabel(order.quantity)}
                      </span>
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
