import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PRODUCTS, RETIRED_DEFAULT_PRODUCT_IDS } from "./default-products";
import { STATUS_PROMOTION_MS } from "./simulation";
import { ActivityEvent, DayConfig, Order, Product } from "./types";

const MAX_ORDERS = 300;
const MAX_ACTIVITY = 150;

export const DEFAULT_CONFIG: DayConfig = {
  targetRevenue: 5000,
  profitMode: "margin",
  targetMargin: 35,
  targetProfitAmount: 1750,
  targetOrders: 120,
  avgTicket: 42,
  startTime: "09:00",
  endTime: "21:00",
  speed: "fast",
  soundEnabled: true,
  soundFile: "ka-ching.mp3",
  ntfyEnabled: false,
  ntfyTopic: "",
};

type DashboardState = {
  config: DayConfig;
  products: Product[];
  orders: Order[];
  activity: ActivityEvent[];
  currentSessions: number;
  sessionsToday: number;
  reachedMilestones: number[];
  orderSequence: number;
  simStartedAt: number;
  isRunning: boolean;
  hasHydrated: boolean;

  setConfig: (config: Partial<DayConfig>) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  addOrder: (order: Order) => void;
  promoteOrderStatuses: (now: number) => void;
  addActivity: (event: ActivityEvent) => void;
  setCurrentSessions: (value: number) => void;
  incrementSessionsToday: () => void;
  markMilestone: (pct: number) => void;

  toggleRunning: () => void;
  resetDay: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      config: DEFAULT_CONFIG,
      products: DEFAULT_PRODUCTS,
      orders: [],
      activity: [],
      currentSessions: 0,
      sessionsToday: 0,
      reachedMilestones: [],
      orderSequence: 1000,
      simStartedAt: Date.now(),
      isRunning: true,
      hasHydrated: false,

      setConfig: (partial) =>
        set((state) => ({ config: { ...state.config, ...partial } })),

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, partial) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...partial } : p)),
        })),
      removeProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      addOrder: (order) =>
        set((state) => {
          const sequence = state.orderSequence + 1;
          return {
            orders: [{ ...order, sequence }, ...state.orders].slice(0, MAX_ORDERS),
            orderSequence: sequence,
          };
        }),

      promoteOrderStatuses: (now) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            const elapsed = now - order.statusUpdatedAt;
            if (order.status === "Processing" && elapsed >= STATUS_PROMOTION_MS.Processing) {
              return { ...order, status: "Paid", statusUpdatedAt: now };
            }
            if (order.status === "Paid" && elapsed >= STATUS_PROMOTION_MS.Paid) {
              return { ...order, status: "Fulfilled", statusUpdatedAt: now };
            }
            return order;
          }),
        })),

      addActivity: (event) =>
        set((state) => ({ activity: [event, ...state.activity].slice(0, MAX_ACTIVITY) })),

      setCurrentSessions: (value) => set({ currentSessions: value }),
      incrementSessionsToday: () =>
        set((state) => ({ sessionsToday: state.sessionsToday + 1 })),

      markMilestone: (pct) =>
        set((state) => ({ reachedMilestones: [...state.reachedMilestones, pct] })),

      toggleRunning: () => set((state) => ({ isRunning: !state.isRunning })),

      resetDay: () =>
        set({
          orders: [],
          activity: [],
          reachedMilestones: [],
          currentSessions: 0,
          sessionsToday: 0,
          orderSequence: 1000,
          simStartedAt: Date.now(),
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "vision-commerce-dashboard",
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<DashboardState>) };
        merged.config = { ...current.config, ...(persisted as Partial<DashboardState>)?.config };
        const retired = new Set(RETIRED_DEFAULT_PRODUCT_IDS);
        const keptProducts = merged.products.filter((p) => !retired.has(p.id));
        const existingIds = new Set(keptProducts.map((p) => p.id));
        const missingDefaults = DEFAULT_PRODUCTS.filter((p) => !existingIds.has(p.id));
        merged.products = [...keptProducts, ...missingDefaults];
        return merged;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
