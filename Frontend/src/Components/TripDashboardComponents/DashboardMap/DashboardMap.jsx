import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./DashboardMap.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DashboardMap = ({ tripId, selectedDate }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [totalDistance, setTotalDistance] = useState(null); // ✅

  useEffect(() => {
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.body.appendChild(script);
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 7.8731, lng: 80.7718 },
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });

    setMapReady(true);
  };

  useEffect(() => {
    if (!mapReady || !tripId) return;

    const fetchPlaces = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5030/api/trips/ordered-route/${tripId}`
        );
        const allPlaces = res.data;

        // ✅ Always calculate total distance from all places
        calculateTotalDistance(allPlaces);

        const filtered = selectedDate
          ? allPlaces.filter((p) => p.startDate === selectedDate)
          : allPlaces;

        updateMarkers(filtered);
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    fetchPlaces();
  }, [mapReady, tripId, selectedDate]);

  const updateMarkers = (places) => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (!places.length) return;

    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place, index) => {
      const coords = extractLatLngFromGoogleMapLink(place.googleMapLink);
      if (!coords) return;

      const isSingleMarker = places.length === 1;

      const marker = new window.google.maps.Marker({
        position: coords,
        map: mapInstance.current,
        ...(isSingleMarker
          ? {} // default red pin
          : {
              label: {
                text: (index + 1).toString(),
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              },
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 14,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 0,
              },
            }),
        title: place.name,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<strong>${index + 1}. ${place.name}</strong>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance.current, marker);
      });

      markersRef.current.push(marker);
      bounds.extend(coords);
    });

    if (places.length === 1) {
      const coords = extractLatLngFromGoogleMapLink(places[0].googleMapLink);
      if (coords) {
        mapInstance.current.setCenter(coords);
        mapInstance.current.setZoom(14);
      }
    } else {
      mapInstance.current.fitBounds(bounds);

      window.google.maps.event.addListenerOnce(
        mapInstance.current,
        "bounds_changed",
        () => {
          const currentZoom = mapInstance.current.getZoom();
          if (currentZoom > 14) {
            mapInstance.current.setZoom(14);
          }
        }
      );
    }
  };

  const calculateTotalDistance = (places) => {
    if (places.length < 2) {
      setTotalDistance(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    const origin = extractLatLngFromGoogleMapLink(places[0].googleMapLink);
    const destination = extractLatLngFromGoogleMapLink(
      places[places.length - 1].googleMapLink
    );

    const waypoints = places.slice(1, -1).map((place) => ({
      location: extractLatLngFromGoogleMapLink(place.googleMapLink),
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result.routes.length > 0) {
          const route = result.routes[0];
          let total = 0;
          route.legs.forEach((leg) => {
            total += leg.distance.value;
          });
          const km = (total / 1000).toFixed(1);
          setTotalDistance(`${km} km`);
        } else {
          setTotalDistance(null);
          console.error("Route calculation failed:", status);
        }
      }
    );
  };

  const extractLatLngFromGoogleMapLink = (link) => {
    try {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = link.match(regex);
      if (!match) return null;
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2]),
      };
    } catch {
      return null;
    }
  };

  return (
    <div className="dashboard-map-container">
      {totalDistance && (
        <div className="distance-info">
          <span role="img" aria-label="route">
            📍
          </span>{" "}
          Total Distance: <strong>{totalDistance}</strong>
        </div>
      )}
      <div className="dashboard-map-inner" ref={mapRef}></div>
    </div>
  );
};

export default DashboardMap;
