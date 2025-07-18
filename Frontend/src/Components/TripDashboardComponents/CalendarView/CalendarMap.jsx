// src/Components/TripDashboardComponents/CalendarView/CalendarMapGoogle.jsx
import React, { useMemo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// ⚙️ sized to fill the grey panel you showed
const containerStyle = { width: "100%", height: "350px", borderRadius: 12 };

const CalendarMapGoogle = ({ places }) => {
  // 1️⃣  Load the Google script once
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY, // same key you used before
  });

  // 2️⃣  Nothing to draw
  if (!isLoaded || !places || places.length === 0) return null;

  // 3️⃣  Center on first place ‑ memoised so it doesn’t recompute
  const center = useMemo(
    () => ({ lat: places[0].latitude, lng: places[0].longitude }),
    [places]
  );

  return (
    <GoogleMap mapContainerStyle={containerStyle} zoom={9} center={center}>
      {places.map((p) => (
        <Marker
          key={p.id}
          position={{ lat: p.latitude, lng: p.longitude }}
          title={p.name}
        />
      ))}
    </GoogleMap>
  );
};

export default CalendarMapGoogle;
