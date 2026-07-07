import { randomCustomerName, randomGeoPoint } from "./fake-data";
import { DayConfig, Order, OrderStatus, Product, SimulationSpeed } from "./types";

const DEMO_WINDOW_DURATION_MS = 2 * 60 * 1000; // toda la jornada se comprime en 2 min reales
const FAST_WINDOW_DURATION_MS = 10 * 60 * 1000; // toda la jornada se comprime en 10 min reales
const MEDIUM_WINDOW_DURATION_MS = 45 * 60 * 1000; // toda la jornada se comprime en 45 min reales

/** Duración real de toda la ventana configurada para velocidades comprimidas; null para "real". */
function compressedDurationMs(speed: SimulationSpeed): number | null {
  if (speed === "demo") return DEMO_WINDOW_DURATION_MS;
  if (speed === "fast") return FAST_WINDOW_DURATION_MS;
  if (speed === "medium") return MEDIUM_WINDOW_DURATION_MS;
  return null;
}

export const TICK_INTERVAL_MS = 1000;

export const STATUS_PROMOTION_MS: Record<OrderStatus, number> = {
  Processing: 6000,
  Paid: 18000,
  Fulfilled: Infinity,
};

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

const MINUTES_PER_DAY = 24 * 60;

/**
 * Resuelve la ventana horaria configurada. Si la hora de fin es igual o
 * anterior a la de inicio (p. ej. inicio 09:00, fin 00:00 o 02:00), se
 * interpreta como una jornada que cruza la medianoche, no como una ventana
 * de 0 minutos.
 */
function resolveWindow(config: DayConfig): {
  startMinutes: number;
  endMinutes: number;
  windowMinutes: number;
  crossesMidnight: boolean;
} {
  const startMinutes = parseTimeToMinutes(config.startTime);
  let endMinutes = parseTimeToMinutes(config.endTime);
  const crossesMidnight = endMinutes <= startMinutes;
  if (crossesMidnight) endMinutes += MINUTES_PER_DAY;
  const windowMinutes = Math.max(endMinutes - startMinutes, 1);
  return { startMinutes, endMinutes, windowMinutes, crossesMidnight };
}

export type VirtualTime = {
  fractionElapsed: number; // 0..1, recortado
  virtualHour: number; // 0-23
  hasStarted: boolean;
  hasFinished: boolean;
};

/**
 * Calcula en qué punto de la jornada configurada nos encontramos.
 * "real" ancla el reloj virtual al reloj real de hoy; "fast"/"demo" comprimen
 * toda la ventana start-end en una duración real corta desde que arrancó la simulación.
 */
export function computeVirtualTime(
  config: DayConfig,
  simStartedAt: number,
  now: number
): VirtualTime {
  const { startMinutes, windowMinutes, crossesMidnight } = resolveWindow(config);

  let fractionElapsed: number;
  const duration = compressedDurationMs(config.speed);

  if (duration === null) {
    const nowDate = new Date(now);
    let nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
    if (crossesMidnight && nowMinutes < startMinutes) nowMinutes += MINUTES_PER_DAY;
    fractionElapsed = (nowMinutes - startMinutes) / windowMinutes;
  } else {
    const elapsedReal = now - simStartedAt;
    fractionElapsed = elapsedReal / duration;
  }

  const hasStarted = fractionElapsed > 0;
  const hasFinished = fractionElapsed >= 1;
  const clamped = Math.min(Math.max(fractionElapsed, 0), 1);
  const virtualMinutes = startMinutes + clamped * windowMinutes;
  const virtualHour = Math.min(23, Math.floor(virtualMinutes / 60));

  return { fractionElapsed: clamped, virtualHour, hasStarted, hasFinished };
}

export function speedLabel(speed: SimulationSpeed): string {
  if (speed === "real") return "Tiempo real";
  if (speed === "medium") return "Media";
  if (speed === "fast") return "Rápida";
  return "Demo";
}

function pickWeightedProduct(products: Product[]): Product | null {
  const pool = products.filter((p) => p.probability > 0);
  if (pool.length === 0) return null;

  const total = pool.reduce((sum, p) => sum + p.probability, 0);
  let roll = Math.random() * total;

  for (const product of pool) {
    roll -= product.probability;
    if (roll <= 0) return product;
  }

  return pool[pool.length - 1];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

type OrderEconomics = {
  quantity: number;
  amount: number;
  profit: number;
};

/**
 * Si el producto define fixedQuantity, se trata como un pack de unidades fijas:
 * "price"/"cost" ya representan el total del pedido y se descuentan además los
 * gastos logísticos fijos (con su IVA), el coste de los regalos incluidos (con
 * un envío del regalo sorteado dentro de su rango) y el CPA. Para productos
 * genéricos se mantiene el cálculo simple por unidad de siempre.
 */
export function computeOrderEconomics(product: Product): OrderEconomics {
  if (product.fixedQuantity) {
    const amount = Number(product.price.toFixed(2));
    let deductions = product.cost;

    if (product.logisticsCost) {
      const vatRate = product.logisticsVatRate ?? 0;
      deductions += product.logisticsCost * (1 + vatRate / 100);
    }
    if (product.giftCost) {
      deductions += product.giftCost;
    }
    if (product.giftShippingMin !== undefined && product.giftShippingMax !== undefined) {
      deductions += randomFloat(product.giftShippingMin, product.giftShippingMax);
    }
    if (product.adCost) {
      deductions += product.adCost;
    }

    return {
      quantity: product.fixedQuantity,
      amount,
      profit: Number((amount - deductions).toFixed(2)),
    };
  }

  const quantity = randomInt(1, 2);
  const amount = Number((product.price * quantity).toFixed(2));
  const profit = Number(((product.price - product.cost) * quantity).toFixed(2));
  return { quantity, amount, profit };
}

/**
 * Beneficio medio esperado por pedido, sin aleatoriedad (usa el punto medio del
 * rango de envío del regalo). Pensado para mostrar una estimación estable en la UI.
 */
export function estimateAverageProfit(product: Product): number {
  if (product.fixedQuantity) {
    let deductions = product.cost;
    if (product.logisticsCost) {
      const vatRate = product.logisticsVatRate ?? 0;
      deductions += product.logisticsCost * (1 + vatRate / 100);
    }
    if (product.giftCost) {
      deductions += product.giftCost;
    }
    if (product.giftShippingMin !== undefined && product.giftShippingMax !== undefined) {
      deductions += (product.giftShippingMin + product.giftShippingMax) / 2;
    }
    if (product.adCost) {
      deductions += product.adCost;
    }
    return Number((product.price - deductions).toFixed(2));
  }

  return Number((product.price - product.cost).toFixed(2));
}

export function buildOrder(product: Product, virtualHour: number): Order {
  const { quantity, amount, profit } = computeOrderEconomics(product);
  const geo = randomGeoPoint();
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    sequence: 0, // el store asigna el correlativo real al insertar el pedido
    createdAt: now,
    virtualHour,
    productId: product.id,
    productName: product.name,
    customerName: randomCustomerName(),
    city: geo.city,
    country: geo.country,
    quantity,
    amount,
    profit,
    status: "Processing",
    statusUpdatedAt: now,
  };
}

/**
 * Genera un pedido nuevo si el sorteo de esta iteración lo decide. La probabilidad
 * se recalcula cada tick para converger hacia el objetivo de pedidos al final
 * de la ventana configurada, acelerando si vamos atrasados y ralentizando si vamos
 * adelantados.
 */
export function maybeGenerateOrder(
  config: DayConfig,
  products: Product[],
  ordersSoFar: number,
  virtualTime: VirtualTime,
  simStartedAt: number,
  now: number
): Order | null {
  if (!virtualTime.hasStarted || virtualTime.hasFinished) return null;

  const remainingFraction = 1 - virtualTime.fractionElapsed;
  if (remainingFraction <= 0) return null;

  const { windowMinutes } = resolveWindow(config);

  const duration = compressedDurationMs(config.speed);
  let remainingRealMs: number;
  if (duration === null) {
    remainingRealMs = remainingFraction * windowMinutes * 60 * 1000;
  } else {
    remainingRealMs = duration - (now - simStartedAt);
  }

  const remainingTicks = Math.max(remainingRealMs / TICK_INTERVAL_MS, 1);
  const neededOrders = Math.max(config.targetOrders - ordersSoFar, 0);
  const probability = Math.min(Math.max(neededOrders / remainingTicks, 0), 0.9);

  if (Math.random() > probability) return null;

  const product = pickWeightedProduct(products);
  if (!product) return null;

  return buildOrder(product, virtualTime.virtualHour);
}

export type SessionsTickResult = {
  currentSessions: number;
  sessionsToday: number;
  gainedSession: boolean;
};

const SESSION_JOIN_PROBABILITY = 0.5;
const SESSION_LEAVE_RATE_PER_VISITOR = 0.08;

/**
 * Avanza un tick de sesiones. "sessionsToday" es un acumulado que solo crece;
 * "currentSessions" (visitantes concurrentes en vivo) sube cuando entra una
 * sesión nueva y baja cuando alguien se va, pero nunca puede superar el
 * acumulado del día — no puede haber más gente navegando ahora mismo que el
 * total de sesiones que ha habido hoy.
 *
 * Cada visitante actual tiene una probabilidad independiente de irse en este
 * tick (no una cantidad fija) para que, en equilibrio, entradas y salidas se
 * compensen alrededor de un número estable en vez de colapsar siempre a 0
 * (que es lo que pasaba si la salida media superaba a la entrada media).
 */
export function tickSessions(currentSessions: number, sessionsToday: number): SessionsTickResult {
  const gainedSession = Math.random() < SESSION_JOIN_PROBABILITY;
  const nextSessionsToday = gainedSession ? sessionsToday + 1 : sessionsToday;

  let next = gainedSession ? currentSessions + 1 : currentSessions;
  for (let i = 0; i < next; i++) {
    if (Math.random() < SESSION_LEAVE_RATE_PER_VISITOR) {
      next -= 1;
    }
  }
  next = Math.max(0, next);
  next = Math.min(next, nextSessionsToday);

  return { currentSessions: next, sessionsToday: nextSessionsToday, gainedSession };
}
