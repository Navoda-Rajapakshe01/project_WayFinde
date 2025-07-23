import React, { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GoogleMapContent = ({ markers = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  // --- Initialize Map
  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 },
      zoom: 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });

    mapInstanceRef.current = map;
    setMapReady(true);
  };

  // --- Script Loader
  useEffect(() => {
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    if (!document.getElementById("google-maps-script")) {
      // Define initMap callback on window
      window.initMap = initializeMap;

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      // Fallback if script is loaded but google is not ready yet
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          initializeMap();
        }
      }, 300);
    }

    return () => {
      delete window.initMap;
    };
  }, []);

  // --- Add Markers
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstanceRef.current,
        title: markerData.title,
        animation: window.google.maps.Animation.DROP,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${markerData.title}</strong></div>`,
      });

      marker.addListener("click", () =>
        infoWindow.open(mapInstanceRef.current, marker)
      );

      markersRef.current.push(marker);
      bounds.extend(markerData.position);
    });

    if (markers.length === 1) {
      mapInstanceRef.current.setCenter(markers[0].position);
      mapInstanceRef.current.setZoom(14);
    } else {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers, mapReady]);

  return (
    <div className="google-map-container">
      <div className="google-map">
        <div ref={mapRef} className="map-inner" />
        {!mapReady && (
          <div className="map-loading-overlay">
            <div className="map-loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GoogleMap = (props) => <GoogleMapContent {...props} />;
export default GoogleMap;
