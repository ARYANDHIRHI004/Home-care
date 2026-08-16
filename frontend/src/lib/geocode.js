// Nominatim (OpenStreetMap) — free, no API key. Both the map picker and the
// "Use current location" flow go through these two functions so there's one
// implementation of "coordinates -> address" and "text -> coordinates" in
// the codebase, not one per caller.

// Turns lat/lng into a street address. Has a hard timeout so a slow/blocked
// request can't leave the UI stuck on "resolving".
export async function reverseGeocode(lat, lng) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' }, signal: controller.signal }
    );
    if (!res.ok) throw new Error(`Nominatim returned ${res.status}`);
    const data = await res.json();
    const a = data.address || {};

    const addressLine =
      [a.house_number, a.road || a.neighbourhood || a.suburb].filter(Boolean).join(', ') ||
      data.display_name?.split(',')[0] ||
      '';

    const rawCity = a.city || a.town || a.village || a.county || '';
    const city = /bhilai/i.test(rawCity) ? 'Bhilai' : /durg/i.test(rawCity) ? 'Durg' : null;
    const pincode = a.postcode || '';

    return { addressLine, city, pincode };
  } finally {
    clearTimeout(timeout);
  }
}

// Forward search (address/place text -> candidate locations) — Nominatim's
// free equivalent of Places Autocomplete. Returns up to `limit` results.
export async function searchAddress(query, limit = 5) {
  if (!query?.trim()) return [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' }, signal: controller.signal }
    );
    if (!res.ok) throw new Error(`Nominatim returned ${res.status}`);
    const results = await res.json();
    return results.map((r) => ({
      label: r.display_name,
      lat: Number(r.lat),
      lng: Number(r.lon),
    }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
