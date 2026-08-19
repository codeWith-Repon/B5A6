/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export function RoutingMachine({
  start,
  end,
  itineraryRef,
  onRouteFound,
}: {
  start: [number, number] | null;
  end: [number, number] | null;
  itineraryRef: React.RefObject<HTMLDivElement | null>;
  onRouteFound: (distance: string, time: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: {
        styles: [
          // 1. Soft outer glow / halo
          {
            color: '#6366f1',
            weight: 12,
            opacity: 0.18,
            className: 'route-halo',
          },
          // 2. Main solid line — draws in on first paint
          {
            color: '#6366f1',
            weight: 5,
            opacity: 0.95,
            className: 'route-base',
          },
          // 3. Animated white dashes flowing along the path
          {
            color: '#ffffff',
            weight: 2.5,
            opacity: 0.95,
            dashArray: '8,14',
            className: 'route-flow',
          },
        ],
      },
      // Pickup/drop pins are drawn by BookingMapSection. Without this the
      // control adds its own waypoint markers on Leaflet's default icon, which
      // resolves to a broken image in the production build.
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      itineraryBuilder: new (L as any).Routing.ItineraryBuilder(),
      containerClassName: 'custom-itinerary-container',
    }).addTo(map);

    const itineraryDiv = routingControl.getContainer();
    if (itineraryRef.current) {
      itineraryRef.current.innerHTML = '';
      itineraryRef.current.appendChild(itineraryDiv);
    }

    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      const dist = (summary.totalDistance / 1000).toFixed(1);
      const time = Math.round(summary.totalTime / 60);
      onRouteFound(`${dist} km`, `${time} min`);
    });

    routingControl.on('routingerror', (e: any) => {
      console.error('Routing error:', e);
      onRouteFound('Route not found', 'N/A');
    });

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
      if (itineraryRef.current) {
        itineraryRef.current.innerHTML = '';
      }
    };
  }, [map, start, end]);

  return null;
}
