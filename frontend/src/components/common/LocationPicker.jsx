'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Loader2, Search, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { reverseGeocode, searchAddress } from '@/lib/geocode';

// react-leaflet touches `window` at import time, which breaks Next.js SSR —
// load the whole map client-side only.
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });

const DEFAULT_CENTER = [21.1938, 81.3509]; // Bhilai, Chhattisgarh

let leafletIconFixed = false;
// Leaflet's default marker icon resolves image paths relative to the bundler
// output, which breaks under Next.js/webpack — point it at the CDN copies
// instead. Done once, lazily, since this touches the `leaflet` module itself.
function ensureLeafletIcon(L) {
  if (leafletIconFixed) return;
  leafletIconFixed = true;
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Shared map-based address picker — drag/tap-to-move pin, Nominatim search,
// reverse-geocoded on every move. Used by both the registration form and
// checkout Step 2 rather than each building its own map component.
export default function LocationPicker({ isOpen, onClose, onConfirm, initialLat, initialLng }) {
  const [ready, setReady] = useState(false);
  const [position, setPosition] = useState(null);
  const [selected, setSelected] = useState(null); // { addressLine, city, pincode, lat, lng }
  const [resolving, setResolving] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  // A search pick needs to actively pan the already-mounted map — MapContainer's
  // `center` prop only sets the *initial* view, it doesn't react to later
  // changes, so this is a distinct signal (not just `position`) that the map
  // tree watches via useMap() and imperatively pans on.
  const [flyTo, setFlyTo] = useState(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(null);
    const start = initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_CENTER;
    setPosition(start);
    setReady(true);
    resolvePosition(start[0], start[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function resolvePosition(lat, lng) {
    setResolving(true);
    try {
      const { addressLine, city, pincode } = await reverseGeocode(lat, lng);
      setSelected({ addressLine, city: city || '', pincode, lat, lng });
    } catch {
      setSelected({ addressLine: '', city: '', pincode: '', lat, lng });
    } finally {
      setResolving(false);
    }
  }

  function handleMove(lat, lng) {
    setPosition([lat, lng]);
    resolvePosition(lat, lng);
  }

  function handleSearchChange(value) {
    setQuery(value);
    clearTimeout(searchTimeout.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      const found = await searchAddress(value);
      setResults(found);
      setSearching(false);
    }, 400);
  }

  function handlePickResult(result) {
    setResults([]);
    setQuery(result.label);
    setFlyTo({ lat: result.lat, lng: result.lng, zoom: 16, token: Date.now() });
    handleMove(result.lat, result.lng);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0F172A]/10">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2554F0]" /> Choose your location
          </h2>
          <button onClick={onClose} className="p-1.5 text-[#0F172A]/40 hover:bg-slate-100 rounded-full transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for an area, street or landmark"
              className="w-full pl-9 pr-3 py-2.5 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
            />
            {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F172A]/40 animate-spin" />}
            {results.length > 0 && (
              <div className="absolute z-1000 top-full mt-1 w-full bg-white border border-[#0F172A]/10 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {results.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePickResult(r)}
                    className="w-full text-left px-3 py-2 text-xs text-[#0F172A] hover:bg-slate-50 border-b border-[#0F172A]/5 last:border-0"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative isolate h-72 rounded-xl overflow-hidden border border-[#0F172A]/10 bg-slate-100">
            {ready && position ? (
              <MapPickerMap
                position={position}
                flyTo={flyTo}
                onMove={handleMove}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#2554F0] animate-spin" />
              </div>
            )}
          </div>

          <p className="text-xs text-[#0F172A]/50">
            Tap anywhere on the map or drag the pin to set your exact location.
          </p>

          {selected && (
            <div className="p-3 bg-[#F0F4FF]/60 rounded-xl text-xs text-[#0F172A]">
              {resolving ? 'Resolving address…' : (selected.addressLine || 'Address unavailable for this spot — you can still confirm and fill it in manually.')}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[#0F172A]/10">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-[#0F172A]/70 hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected || resolving}
            onClick={() => selected && onConfirm(selected)}
            className="px-5 py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-40"
          >
            Confirm location
          </button>
        </div>
      </div>
    </div>
  );
}

// Split out so the Leaflet-specific bits (useMapEvents, useMap, draggable
// Marker) only ever mount client-side, after the dynamic imports resolve.
function MapPickerMap({ position, flyTo, onMove }) {
  const [Leaflet, setLeaflet] = useState(null);
  const [hooks, setHooks] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import('leaflet'), import('react-leaflet')]).then(([L, RL]) => {
      if (cancelled) return;
      ensureLeafletIcon(L.default || L);
      setLeaflet(L.default || L);
      setHooks({ useMapEvents: RL.useMapEvents, useMap: RL.useMap });
    });
    return () => { cancelled = true; };
  }, []);

  if (!Leaflet || !hooks) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-[#2554F0] animate-spin" />
      </div>
    );
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker position={position} onMove={onMove} useMapEvents={hooks.useMapEvents} />
      <RecenterOnFlyTo flyTo={flyTo} useMap={hooks.useMap} />
    </MapContainer>
  );
}

function DraggableMarker({ position, onMove, useMapEvents }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          onMove(latlng.lat, latlng.lng);
        },
      }}
    />
  );
}

// Imperatively pans/zooms the live map instance whenever a search result is
// picked. Rendered inside <MapContainer> (not passed a ref from outside it)
// because useMap() is the reliable way to reach the map instance here — a
// ref threaded through next/dynamic-wrapped components onto MapContainer is
// not guaranteed to resolve, which is what silently broke "search result ->
// map should jump there" before this fix.
function RecenterOnFlyTo({ flyTo, useMap }) {
  const map = useMap();
  useEffect(() => {
    if (!flyTo) return;
    map.setView([flyTo.lat, flyTo.lng], flyTo.zoom || map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flyTo?.token]);
  return null;
}
