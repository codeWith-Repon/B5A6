import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

/**
 * Pin Leaflet's default marker images to the bundled assets.
 *
 * Leaflet resolves them at runtime by reading the background-image of
 * `.leaflet-default-icon-path` and swapping the filename onto that path. The
 * production build inlines that PNG as a base64 data URI, so the swap yields a
 * garbage URL and every default marker renders as a broken image — dev works,
 * prod doesn't. Deleting the override makes Icon.Default read the options below
 * directly instead of prefixing the detected path.
 */
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
