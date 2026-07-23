export type GeoPoint = { city: string; country: string };

// Ciudades por país, sin territorios insulares/exclaves (solo continental en
// cada caso). Un producto elige uno o varios de estos países como mercado y
// sus ventas simuladas solo saldrán de esas ciudades.
export const COUNTRY_CITIES: Record<string, string[]> = {
  España: [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Sevilla",
    "Zaragoza",
    "Málaga",
    "Bilbao",
    "Murcia",
    "Valladolid",
    "Vigo",
  ],
  México: [
    "Ciudad de México",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "León",
    "Querétaro",
    "Mérida",
  ],
  Colombia: ["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"],
  Argentina: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata"],
  Chile: ["Santiago", "Valparaíso", "Concepción", "Antofagasta"],
  Perú: ["Lima", "Arequipa", "Trujillo", "Cusco"],
  "Estados Unidos": ["Miami", "Los Ángeles", "Houston", "Nueva York", "Chicago"],
};

export const AVAILABLE_COUNTRIES = Object.keys(COUNTRY_CITIES);

const DEFAULT_COUNTRIES = ["España"];

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

/**
 * Sortea una ciudad dentro de los países dados (un producto puede vender en
 * varios países a la vez). Si no se pasa ninguno, o ninguno es válido, cae a
 * España por defecto para no romper productos ya creados.
 */
export function randomGeoPoint(countries?: string[]): GeoPoint {
  const pool = countries && countries.length > 0 ? countries : DEFAULT_COUNTRIES;
  const validCountries = pool.filter((c) => COUNTRY_CITIES[c]);
  const country = pick(validCountries.length > 0 ? validCountries : DEFAULT_COUNTRIES);
  const city = pick(COUNTRY_CITIES[country]);
  return { city, country };
}
