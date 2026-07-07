import { DailyTotals, DayConfig, HourlyStat, Order } from "./types";

export type Kpis = {
  revenue: number;
  profit: number;
  ordersCount: number;
  unitsSold: number;
  averageTicket: number;
  conversionRate: number;
  targetRevenue: number;
  targetProfit: number;
  targetOrders: number;
  revenueProgress: number; // 0-100
  profitProgress: number; // 0-100
  ordersProgress: number; // 0-100
};

export function computeTargetProfit(config: DayConfig): number {
  return config.profitMode === "margin"
    ? config.targetRevenue * (config.targetMargin / 100)
    : config.targetProfitAmount;
}

function progressPct(actual: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, (actual / target) * 100);
}

export function computeKpis(totals: DailyTotals, sessionsToday: number, config: DayConfig): Kpis {
  const { revenue, profit, ordersCount, unitsSold } = totals;
  const averageTicket = ordersCount > 0 ? revenue / ordersCount : 0;
  const conversionRate = sessionsToday > 0 ? (ordersCount / sessionsToday) * 100 : 0;
  const targetProfit = computeTargetProfit(config);

  return {
    revenue,
    profit,
    ordersCount,
    unitsSold,
    averageTicket,
    conversionRate,
    targetRevenue: config.targetRevenue,
    targetProfit,
    targetOrders: config.targetOrders,
    revenueProgress: progressPct(revenue, config.targetRevenue),
    profitProgress: progressPct(profit, targetProfit),
    ordersProgress: progressPct(ordersCount, config.targetOrders),
  };
}

export function computeHourlyStats(orders: Order[]): HourlyStat[] {
  const buckets = new Map<number, HourlyStat>();
  for (let hour = 0; hour < 24; hour++) {
    buckets.set(hour, { hour, revenue: 0, orders: 0 });
  }

  for (const order of orders) {
    const bucket = buckets.get(order.virtualHour);
    if (bucket) {
      bucket.revenue += order.amount;
      bucket.orders += 1;
    }
  }

  return Array.from(buckets.values());
}

export type CustomerAggregate = {
  key: string;
  name: string;
  city: string;
  country: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderAt: number;
};

export function computeCustomers(orders: Order[]): CustomerAggregate[] {
  const map = new Map<string, CustomerAggregate>();

  for (const order of orders) {
    const key = `${order.customerName}__${order.city}`;
    const existing = map.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.amount;
      existing.lastOrderAt = Math.max(existing.lastOrderAt, order.createdAt);
    } else {
      map.set(key, {
        key,
        name: order.customerName,
        city: order.city,
        country: order.country,
        ordersCount: 1,
        totalSpent: order.amount,
        lastOrderAt: order.createdAt,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export type ProductAggregate = {
  productId: string;
  productName: string;
  unitsSold: number;
  revenue: number;
};

export function computeTopProducts(orders: Order[], limit = 5): ProductAggregate[] {
  const map = new Map<string, ProductAggregate>();

  for (const order of orders) {
    const existing = map.get(order.productId);
    if (existing) {
      existing.unitsSold += order.quantity;
      existing.revenue += order.amount;
    } else {
      map.set(order.productId, {
        productId: order.productId,
        productName: order.productName,
        unitsSold: order.quantity,
        revenue: order.amount,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
