import React from "react";
import { GoogleMap, DirectionsRenderer, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

const centerOfSriLanka = { lat: 7.8731, lng: 80.7718 }; // Default center if no directions yet

const RouteMap = ({ directions, startPlace }) => {
  return (
    <div className="route-map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={directions ? null : centerOfSriLanka}
        zoom={7}
      >
        {/* ✅ Manually add Start Location Marker ("A") */}
        {startPlace && directions && (
          <>
            <Marker
              position={{ lat: startPlace.latitude, lng: startPlace.longitude }}
              label="A"
            />
            <DirectionsRenderer directions={directions} />
          </>
        )}

        {/* ✅ Google Optimized Route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default RouteMap;
