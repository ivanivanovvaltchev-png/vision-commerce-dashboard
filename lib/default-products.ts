import { Product } from "./types";

// Ids de productos genéricos de demo que existían antes de fijar el catálogo
// solo a Luméra EyeLift™. Se usan en lib/store.ts para depurarlos de cualquier
// estado ya guardado en localStorage sin tocar productos añadidos por el usuario.
export const RETIRED_DEFAULT_PRODUCT_IDS = [
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "p10",
];

// Luméra EyeLift™ — economía real de pedido (COD/Dropea): precio y coste ya
// representan el total del pack, con gastos logísticos, IVA, CPA y regalos
// incluidos (envío del regalo aleatorio por pedido).
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "lumera-1",
    name: "Luméra EyeLift™ — 1 unidad",
    price: 39.99,
    cost: 4.55,
    probability: 45,
    fixedQuantity: 1,
    logisticsCost: 5.68,
    logisticsVatRate: 18,
    adCost: 15.26,
  },
  {
    id: "lumera-2",
    name: "Luméra EyeLift™ — Pack Duo (2 uds)",
    price: 59.99,
    cost: 9.1,
    probability: 35,
    fixedQuantity: 2,
    logisticsCost: 5.68,
    logisticsVatRate: 18,
    adCost: 15.26,
    giftCost: 1.95, // rodillo de jade, no se muestra al cliente
    giftShippingMin: 3,
    giftShippingMax: 5,
  },
  {
    id: "lumera-3",
    name: "Luméra EyeLift™ — Pack Trio (3 uds)",
    price: 74.99,
    cost: 13.65,
    probability: 20,
    fixedQuantity: 3,
    logisticsCost: 5.68,
    logisticsVatRate: 18,
    adCost: 15.26,
    giftCost: 5.95, // rodillo de jade + parches de colágeno, no se muestran al cliente
    giftShippingMin: 3,
    giftShippingMax: 5,
  },
];
