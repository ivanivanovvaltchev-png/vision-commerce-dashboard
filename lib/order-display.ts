import { Order, OrderStatus } from "./types";

export const SALES_CHANNEL_LABEL = "Tienda online";

export function orderNumberLabel(order: Order): string {
  return `#${order.sequence}`;
}

export type PaymentStatus = "Pago pendiente" | "Pagado";
export type FulfillmentStatus = "No preparado" | "Preparado";

export function paymentStatusLabel(status: OrderStatus): PaymentStatus {
  return status === "Processing" ? "Pago pendiente" : "Pagado";
}

export function fulfillmentStatusLabel(status: OrderStatus): FulfillmentStatus {
  return status === "Fulfilled" ? "Preparado" : "No preparado";
}

export function itemsLabel(quantity: number): string {
  return quantity === 1 ? "1 artículo" : `${quantity} artículos`;
}
