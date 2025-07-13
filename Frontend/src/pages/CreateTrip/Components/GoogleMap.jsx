import React, { useState, useEffect, useRef, useCallback } from "react";
import { loadGoogleMapsApi } from "../../../utils/GoogleMapsLoader";
import ErrorBoundary from "../../../components/ErrorBoundary";
import MapFallback from "../../../Components/MapFallback";
import "../../../components/MapFallback.css";

const GoogleMapContent = ({ markers = [] }) => {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Initialize the Google Map
  const initMap = useCallback(async () => {
    if (!mapRef.current) return;

    try {
      // Load Google Maps API using our centralized loader
      const maps = await loadGoogleMapsApi();

      // Create a new Google Map instance
      const mapOptions = {
        center: { lat: 7.8731, lng: 80.7718 }, // Center of Sri Lanka
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }, { lightness: 17 }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }, { lightness: 18 }],
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }, { lightness: 16 }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#dedede" }, { lightness: 21 }],
          },
          {
            featureType: "administrative",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }, { lightness: 16 }],
          },
        ],
      };

      googleMapRef.current = new window.google.maps.Map(
        mapRef.current,
        mapOptions
      );
      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setMapError(error.message || "Failed to load Google Maps");
    }
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await initMap();
    };

    init();

    return () => {
      isMounted = false;

      // Clean up markers when component unmounts
      if (markersRef.current && markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => {
          if (marker) marker.setMap(null);
        });
        markersRef.current = [];
      }

      // Clean up map
      googleMapRef.current = null;
    };
  }, [initMap]);

  // Update markers when they change
  useEffect(() => {
    if (
      !mapLoaded ||
      !googleMapRef.current ||
      !window.google ||
      !window.google.maps
    )
      return;

    // Clear existing markers
    if (markersRef.current && markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];
    }

    // Add new markers
    if (markers.length > 0) {
      try {
        const bounds = new window.google.maps.LatLngBounds();

        markers.forEach((markerData) => {
          try {
            // Create marker
            const marker = new window.google.maps.Marker({
              position: markerData.position,
              map: googleMapRef.current,
              title: markerData.title,
              animation: window.google.maps.Animation.DROP,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#ef4444",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
                scale: 8,
              },
            });

            // Add info window
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div class="info-window"><strong>${markerData.title}</strong></div>`,
            });

            marker.addListener("click", () => {
              infoWindow.open(googleMapRef.current, marker);
            });

            // Add marker to ref array for cleanup
            markersRef.current.push(marker);

            // Extend bounds to include this marker
            bounds.extend(markerData.position);
          } catch (error) {
            console.error("Error creating marker:", error);
          }
        });

        // Fit map to bounds if we have markers
        if (markers.length > 1) {
          googleMapRef.current.fitBounds(bounds);
        } else if (markers.length === 1) {
          googleMapRef.current.setCenter(markers[0].position);
          googleMapRef.current.setZoom(14);
        }
      } catch (error) {
        console.error("Error updating map markers:", error);
      }
    }
  }, [markers, mapLoaded]);

  if (mapError) {
    return <MapFallback />;
  }

  return (
    <div className="google-map-container">
      <div ref={mapRef} className="google-map">
        {!mapLoaded && (
          <div className="map-loading">
            <div className="map-loading-spinner"></div>
            <p>Loading map...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap the map component with an error boundary
const GoogleMap = (props) => {
  return (
    <ErrorBoundary fallback={<MapFallback />}>
      <GoogleMapContent {...props} />
    </ErrorBoundary>
  );
};

export default GoogleMap;
