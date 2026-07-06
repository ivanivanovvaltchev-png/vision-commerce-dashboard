export type GeoPoint = { city: string; country: string };

// Solo España peninsular: sin Baleares, Canarias, Ceuta ni Melilla.
export const GEO_POINTS: GeoPoint[] = [
  { city: "Madrid", country: "España" },
  { city: "Barcelona", country: "España" },
  { city: "Valencia", country: "España" },
  { city: "Sevilla", country: "España" },
  { city: "Zaragoza", country: "España" },
  { city: "Málaga", country: "España" },
  { city: "Bilbao", country: "España" },
  { city: "Murcia", country: "España" },
  { city: "Valladolid", country: "España" },
  { city: "Vigo", country: "España" },
];

const FIRST_NAMES = [
  "Alex",
  "María",
  "Jorge",
  "Lucía",
  "Carlos",
  "Sofía",
  "Diego",
  "Valentina",
  "Pablo",
  "Elena",
  "Nicolás",
  "Camila",
];

const LAST_NAMES = [
  "García",
  "Martínez",
  "Rodríguez",
  "López",
  "Fernández",
  "Gómez",
  "Díaz",
  "Torres",
  "Ramírez",
  "Flores",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomCustomerName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

export function randomGeoPoint(): GeoPoint {
  return pick(GEO_POINTS);
}
