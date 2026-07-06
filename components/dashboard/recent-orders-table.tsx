"use client";

import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orderNumberLabel } from "@/lib/order-display";
import { Order } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  const recent = orders.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Esperando el primer pedido del día...
          </p>
        ) : (
          <ScrollArea className="h-[380px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ciudad / País</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  <TableHead className="text-right">Beneficio</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{orderNumberLabel(order)}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {formatTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.city}, {order.country}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatCurrency(order.profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
