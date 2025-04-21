// MapComponent.jsx
import React, { useEffect } from "react";
import "./MapComponent.css";
// Importing useNavigate for navigation

const MapComponent = ({ places, map, setMap, markers, setMarkers }) => {
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    window.initMap = () => {
      const googleMap = new window.google.maps.Map(
        document.getElementById("map"),
        { zoom: 6, center: { lat: 7.8731, lng: 80.7718 } }
      );
      setMap(googleMap);
    };
    document.body.appendChild(script);
  }, [setMap]);

  const addMarker = (place) => {
    if (!map) return;
    const marker = new window.google.maps.Marker({
      position: place.location,
      map: map,
      title: place.name,
    });
    setMarkers([...markers, marker]);
  };

  const removeMarker = (place) => {
    const updatedMarkers = markers.filter(
      (marker) => marker.getTitle() !== place.name
    );
    markers.forEach((marker) => {
      if (marker.getTitle() === place.name) marker.setMap(null);
    });
    setMarkers(updatedMarkers);
  };

  return (
    <div id="map" className="relative h-96 w-full rounded-lg shadow-md"></div>
  );
};

export default MapComponent;
