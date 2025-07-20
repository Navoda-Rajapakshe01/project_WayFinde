import React, { useEffect, useRef, useState } from "react";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const TripMap = ({ markers = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const allMarkersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // ✅ Initialize Google Maps once loaded
  useEffect(() => {
    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 7.8731, lng: 80.7718 },
        zoom: 8,
      });
      mapInstanceRef.current = map;
      setMapReady(true);
    };

    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // ✅ Only add script if not already added
      if (!document.getElementById("google-maps-script")) {
        window.initMap = initializeMap;

        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;

        script.onerror = () => {
          console.error("Failed to load Google Maps script");
        };

        document.body.appendChild(script);
      } else {
        // If script exists but Google isn't ready, wait a bit and retry
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval);
            initializeMap();
          }
        }, 300);
      }
    };

    loadGoogleMapsScript();

    return () => {
      delete window.initMap;
    };
  }, []);

  // ✅ Update markers when props change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    allMarkersRef.current.forEach((marker) => marker.setMap(null));
    allMarkersRef.current = [];

    if (markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((m) => {
      const marker = new window.google.maps.Marker({
        position: m.position,
        map: mapInstanceRef.current,
        title: m.title,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<strong>${m.title}</strong>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      allMarkersRef.current.push(marker);
      bounds.extend(m.position);
    });

    if (markers.length > 1) {
      mapInstanceRef.current.fitBounds(bounds);
    } else {
      mapInstanceRef.current.setCenter(markers[0].position);
      mapInstanceRef.current.setZoom(14);
    }
  }, [markers, mapReady]);

  return <div ref={mapRef} className="google-map" />;
};

export default TripMap;
