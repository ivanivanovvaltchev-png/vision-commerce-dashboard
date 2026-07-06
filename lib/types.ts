export type Product = {
  id: string;
  name: string;
  price: number; // precio de venta total del pedido (del pack, si aplica)
  cost: number; // coste de producto (COGS) del pedido completo
  probability: number; // peso relativo 1-100 usado en el sorteo ponderado

  // Economía avanzada de pedido real (opcional). Si fixedQuantity está definido,
  // el producto se trata como un pack de unidades fijas (no se sortea cantidad
  // y "price"/"cost" ya representan el total del pack, no el precio unitario).
  fixedQuantity?: number;
  logisticsCost?: number; // envío + contrareembolso + fulfillment, fijo por pedido
  logisticsVatRate?: number; // % de IVA aplicado sobre logisticsCost
  adCost?: number; // CPA: coste de adquisición por venta
  giftCost?: number; // coste de regalos incluidos, no se muestra al cliente
  giftShippingMin?: number; // envío del regalo, rango aleatorio (€)
  giftShippingMax?: number;
};

export type OrderStatus = "Processing" | "Paid" | "Fulfilled";

export type Order = {
  id: string;
  sequence: number; // correlativo para mostrar "#1001" como en un pedido real
  createdAt: number; // timestamp real, para "hace X segundos"
  virtualHour: number; // 0-23, hora dentro del día simulado, para el gráfico
  productId: string;
  productName: string;
  customerName: string;
  city: string;
  country: string;
  quantity: number;
  amount: number;
  profit: number;
  status: OrderStatus;
  statusUpdatedAt: number;
};

export type ProfitMode = "margin" | "amount";
export type SimulationSpeed = "real" | "medium" | "fast" | "demo";

export type DayConfig = {
  targetRevenue: number;
  profitMode: ProfitMode;
  targetMargin: number; // %
  targetProfitAmount: number;
  targetOrders: number;
  avgTicket: number;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  speed: SimulationSpeed;
  soundEnabled: boolean;
  soundFile: string;
  ntfyEnabled: boolean;
  ntfyTopic: string;
};

export type ActivityEventType = "sale" | "session" | "milestone";

export type ActivityEvent = {
  id: string;
  timestamp: number;
  type: ActivityEventType;
  message: string;
};

export type HourlyStat = {
  hour: number;
  revenue: number;
  orders: number;
};
