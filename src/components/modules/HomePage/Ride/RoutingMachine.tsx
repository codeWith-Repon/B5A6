/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import {  useMap } from 'react-leaflet';
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
      lineOptions: { styles: [{ color: '#f97316', weight: 5 }] },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      itineraryBuilder: new (L as any).Routing.ItineraryBuilder(),
      containerClassName: 'custom-itinerary-container',
    }).addTo(map);

    const itineraryDiv = routingControl.getContainer();
    if (itineraryRef.current) {
      itineraryRef.current.appendChild(itineraryDiv);
    }

    routingControl.on('routesfound', (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      const dist = (summary.totalDistance / 1000).toFixed(1);
      const time = Math.round(summary.totalTime / 60);
      onRouteFound(`${dist} km`, `${time} min`);
    });

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, start, end]);

  return null;
}
