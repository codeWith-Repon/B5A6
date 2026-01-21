import { useMapEvents } from 'react-leaflet';

export function MapClickHandler({
  mode,
  onSelect,
}: {
  mode: 'pickup' | 'drop' | null;
  onSelect: (addr: string) => void;
}) {
  useMapEvents({
    click: async (e) => {
      if (!mode) return;
      const { lat, lng } = e.latlng;
      // Reverse Geocode (Lat/Lng -> Address Name)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      onSelect(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    },
  });
  return null;
}
