import React, { useEffect } from "react";
import "./MapComponent.css";

const MapComponent = ({ map, setMap }) => {
  const GOOGLE_MAPS_API_KEY = "AIzaSyDtkIpde5Pm3BZ6L8lf6_AwdEBcpzXjazg";

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

  return (
    <div id="map" className="relative h-96 w-full rounded-lg shadow-md"></div>
  );
};

export default MapComponent;
