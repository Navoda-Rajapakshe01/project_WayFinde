import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import "./OptimizedMap.css";

let loader;
const getLoader = () => {
  if (!loader) {
    loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
    });
  }
  return loader;
};

const OptimizedMap = ({ markers = [], onOptimizedOrder, onDistanceChange }) => {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);
  const [ready, setReady] = useState(false);

  const customMarkers = useRef([]);

  const clearCustomMarkers = () => {
    customMarkers.current.forEach((m) => m.setMap(null));
    customMarkers.current = [];
  };

  const drawCustomMarkers = (result) => {
    const legs = result.routes[0].legs;
    legs.forEach((leg, idx) => {
      const start = leg.start_location;
      const end = leg.end_location;

      customMarkers.current.push(
        new window.google.maps.Marker({
          position: start,
          map: mapRef.current,
          label: { text: `${idx + 1}`, color: "white", fontWeight: "bold" },
        })
      );

      if (idx === legs.length - 1) {
        customMarkers.current.push(
          new window.google.maps.Marker({
            position: end,
            map: mapRef.current,
            label: { text: `${idx + 2}`, color: "white", fontWeight: "bold" },
          })
        );
      }
    });

    const bounds = new window.google.maps.LatLngBounds();
    legs.forEach((leg) => {
      bounds.extend(leg.start_location);
      bounds.extend(leg.end_location);
    });
    mapRef.current.fitBounds(bounds);
  };

  useEffect(() => {
    getLoader()
      .load()
      .then(() => {
        if (!mapDivRef.current) return;
        mapRef.current = new window.google.maps.Map(mapDivRef.current, {
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        directionsRenderer.current = new window.google.maps.DirectionsRenderer({
          map: mapRef.current,
          suppressMarkers: true,
          polylineOptions: { strokeColor: "#2563EB", strokeWeight: 4 },
        });

        setReady(true);
      });

    return () => {
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
        directionsRenderer.current = null;
      }
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || markers.length === 0 || !mapRef.current) return;

    if (markers.length === 1) {
      mapRef.current.setCenter(markers[0].position);
      mapRef.current.setZoom(12);
      return;
    }

    if (markers.length > 1) {
      const service = new window.google.maps.DirectionsService();

      const origin = markers[0].position;
      const destination = markers[markers.length - 1].position;
      const waypoints = markers.slice(1, -1).map((m) => ({
        location: m.position,
        stopover: true,
      }));

      service.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === "OK" && result) {
            directionsRenderer.current.setDirections(result);
            clearCustomMarkers();
            drawCustomMarkers(result);

            const totalDistanceMeters = result.routes[0].legs.reduce(
              (sum, leg) => sum + (leg.distance?.value || 0),
              0
            );
            const totalDistanceKm = (totalDistanceMeters / 1000).toFixed(2);

            if (onDistanceChange) onDistanceChange(totalDistanceKm);
            if (onOptimizedOrder)
              onOptimizedOrder(result.routes[0].waypoint_order);
          } else {
            console.error("❌ Directions failed:", status);
            // fallback to simple fitBounds
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach((m) => bounds.extend(m.position));
            mapRef.current.fitBounds(bounds);
          }
        }
      );
    }
  }, [markers, ready]);

  return (
    <div className="optimized-map-container">
      <div ref={mapDivRef} className="optimized-map" />
      {!ready && (
        <div className="map-loading">
          <div className="map-loading-spinner" />
          <p>Loading map...</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedMap;
