import ServiceArea from "../models/serviceArea.model.js";

const SECTOR_PATTERN = /\bsector\s*-?\s*\d{1,2}\b/i;

const normalize = (s) => (s || "").trim().toLowerCase();

// Matches on the resolved locality name against the seeded serviceAreas list
// — not GPS polygon geofencing, which would need boundary data this app
// doesn't have. Sector areas are a pattern match ("Sector 4", "sector-9"),
// everything else is exact-or-alias, case-insensitive.
export async function matchServiceArea(locality) {
  const norm = normalize(locality);
  if (!norm) return null;

  const areas = await ServiceArea.find({ active: true }).lean();

  for (const area of areas) {
    if (area.matchType === "sector") {
      if (SECTOR_PATTERN.test(norm)) return area;
      continue;
    }
    if (normalize(area.name) === norm) return area;
    if ((area.aliases || []).some((alias) => normalize(alias) === norm)) return area;
  }

  return null;
}

// Best-effort reverse geocode via Nominatim (OpenStreetMap) — no API key,
// same provider already used client-side in the register page's
// "use current location" flow. Only used when the caller has coordinates but
// no locality name yet (e.g. a raw lat/lng from a map picker).
export async function resolveLocalityFromLatLng(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "homecare247-backend/1.0 (service-area-check)",
      "Accept-Language": "en",
    },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const a = data.address || {};
  return a.suburb || a.neighbourhood || a.residential || a.city_district || null;
}

export async function checkServiceability({ locality, lat, lng }) {
  let resolvedLocality = locality;

  if (!resolvedLocality && typeof lat === "number" && typeof lng === "number") {
    resolvedLocality = await resolveLocalityFromLatLng(lat, lng);
  }

  if (!resolvedLocality) {
    return { serviceable: false, matchedArea: null, resolvedLocality: null };
  }

  const matched = await matchServiceArea(resolvedLocality);
  return {
    serviceable: !!matched,
    matchedArea: matched?.name || null,
    resolvedLocality,
  };
}
