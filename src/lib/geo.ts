/** Approximate city coordinates (India) for demo distance calc. */
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  thanjavur: { lat: 10.787, lng: 79.1378 },
  theni: { lat: 10.0104, lng: 77.4768 },
  erode: { lat: 11.341, lng: 77.7172 },
  pollachi: { lat: 10.658, lng: 77.008 },
  nagapattinam: { lat: 10.7672, lng: 79.8449 },
  salem: { lat: 11.6643, lng: 78.146 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  tirupur: { lat: 11.1085, lng: 77.3411 },
  namakkal: { lat: 11.2189, lng: 78.1674 },
  tuticorin: { lat: 8.7642, lng: 78.1348 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  "tamil nadu": { lat: 11.1271, lng: 78.6569 },
};

export function resolveCoords(
  location: string,
): { lat: number; lng: number } | null {
  const lower = location.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (lower.includes(city)) return coords;
  }
  return null;
}

/** Haversine distance in km */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export function distanceBetweenLocations(
  from: string,
  to: string,
): number {
  const a = resolveCoords(from);
  const b = resolveCoords(to);
  if (a && b) return Math.max(1, haversineKm(a, b));
  // fallback deterministic estimate
  let hash = 0;
  const key = `${from}|${to}`.toLowerCase();
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return 80 + (hash % 220);
}

export const PLATFORM_FEE_PCT = 0.03; // 3% platform take rate
