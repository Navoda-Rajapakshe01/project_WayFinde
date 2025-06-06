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

const OptimizedMap = ({ markers = [] }) => {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRenderer = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLoader()
      .load()
      .then(() => {
        if (cancelled || !mapDivRef.current) return;

        mapRef.current = new window.google.maps.Map(mapDivRef.current, {
          center: { lat: 7.8731, lng: 80.7718 },
          zoom: 7,
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
      cancelled = true;
      if (directionsRenderer.current) {
        directionsRenderer.current.setMap(null);
        directionsRenderer.current = null;
      }
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || markers.length < 2) return;

    const origin = markers[0].position;
    const destination = markers[markers.length - 1].position;
    const waypoints = markers.slice(1, -1).map((m) => ({
      location: m.position,
      stopover: true,
    }));

    const service = new window.google.maps.DirectionsService();
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
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [markers, ready]);

  const customMarkers = useRef([]);
  const clearCustomMarkers = () => {
    customMarkers.current.forEach((m) => m.setMap(null));
    customMarkers.current = [];
  };

  const drawCustomMarkers = (result) => {
    const routeLegs = result.routes[0].legs;
    routeLegs.forEach((leg, idx) => {
      const pos = leg.start_location;
      customMarkers.current.push(
        new window.google.maps.Marker({
          position: pos,
          map: mapRef.current,
          label: {
            text: String(idx + 1),
            color: "white",
            fontWeight: "bold",
          },
        })
      );
      /* draw last marker separately (destination) */
      if (idx === routeLegs.length - 1) {
        customMarkers.current.push(
          new window.google.maps.Marker({
            position: leg.end_location,
            map: mapRef.current,
            label: {
              text: String(idx + 2),
              color: "white",
              fontWeight: "bold",
            },
          })
        );
      }
    });

    /* fit bounds */
    const bounds = new window.google.maps.LatLngBounds();
    routeLegs.forEach((l) => {
      bounds.extend(l.start_location);
      bounds.extend(l.end_location);
    });
    mapRef.current.fitBounds(bounds);
  };

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
