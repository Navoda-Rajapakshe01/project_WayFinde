import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

import MainNavbar from "../Components/MainNavbar/MainNavbar";
import Footer from "../Components/Footer/Footer";
import "../pages/CSS/OptimizedTripRoute.css"; // Correct CSS path
import { useTrip } from "../context/TripContext"; // Correct context path
import TripDestinationCard from "../components/OptimizedTrip/TripDestinationCard";
import RouteMap from "../components/OptimizedTrip/RouteMap";
import TripSummaryBox from "../components/OptimizedTrip/TripSummaryBox";
import AddTripNamePopup from "../components/OptimizedTrip/AddTripNamePopup";

const GOOGLE_MAPS_API_KEY = "AIzaSyAM3iuCz-gy_ZCKscaWWhlsaQ5WUabyy2w"; // Your actual key

const OptimizedTripRoute = () => {
  const navigate = useNavigate();
  const { selectedPlaces, startingLocation, startDate, endDate } = useTrip();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = useState(null);
  const [tripName, setTripName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [orderedPlaces, setOrderedPlaces] = useState([]); // 🆕 Optimized order

  const directionsService = useRef(null);

  useEffect(() => {
    if (isLoaded && selectedPlaces.length > 0 && startingLocation) {
      directionsService.current = new window.google.maps.DirectionsService();
      calculateOptimizedRoute();
    }
  }, [isLoaded, selectedPlaces, startingLocation]);

  const calculateOptimizedRoute = () => {
    if (!directionsService.current || selectedPlaces.length === 0) return;

    const startPlace = selectedPlaces.find(
      (p) => p.id === parseInt(startingLocation)
    );

    const waypointsOnly = selectedPlaces
      .filter((place) => place.id !== parseInt(startingLocation))
      .map((place) => ({
        location: { lat: place.latitude, lng: place.longitude },
        stopover: true,
      }));

    directionsService.current.route(
      {
        origin: { lat: startPlace.latitude, lng: startPlace.longitude },
        destination: { lat: startPlace.latitude, lng: startPlace.longitude }, // Round trip
        waypoints: waypointsOnly,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);

          // 🧠 Calculate total distance
          const legs = result.routes[0].legs;
          let distance = 0;
          for (let i = 0; i < legs.length; i++) {
            distance += legs[i].distance.value;
          }
          setTotalDistance(distance / 1000); // meters to kilometers

          // 🧠 Reorder places based on optimized Google order
          const waypointOrder = result.routes[0].waypoint_order;

          const waypointsPlaces = selectedPlaces.filter(
            (place) => place.id !== parseInt(startingLocation)
          );

          const reorderedWaypoints = waypointOrder.map(
            (index) => waypointsPlaces[index]
          );

          const finalOrdered = [startPlace, ...reorderedWaypoints];
          setOrderedPlaces(finalOrdered); // Set to display ordered
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  const handleConfirm = () => {
    if (!tripName.trim()) {
      alert("Please enter a trip name before continuing.");
      return;
    }
    navigate("/upcomingtrips", { state: { tripName } });
  };

  return (
    <div className="optimized-trip-route-container">
      <MainNavbar />

      <div className="page-header">
        <h2>Optimized Route for Your Journey</h2>
        <p>
          Your selected destinations are arranged in the shortest and most
          efficient travel route for a seamless experience.
        </p>
      </div>

      <div className="content-container">
        <div className="trip-left-section">
          <div className="destination-list">
            {orderedPlaces.map((place, index) => (
              <TripDestinationCard
                key={place.id}
                place={place}
                index={index + 1} // ✅ Show as 1,2,3 optimized
                startDate={startDate}
              />
            ))}
          </div>
        </div>

        <div className="trip-right-section">
          <button
            className="complete-trip-btn"
            onClick={() => setShowPopup(true)}
          >
            Complete Trip
          </button>

          {/* Map */}
          {isLoaded && (
            <RouteMap
              directions={directions}
              startPlace={orderedPlaces.length > 0 ? orderedPlaces[0] : null}
            />
          )}

          {/* Summary */}
          <TripSummaryBox
            travelDays={
              startDate && endDate
                ? Math.ceil(
                    (new Date(endDate) - new Date(startDate)) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                : "-"
            }
            destinationCount={orderedPlaces.length}
            travelDistance={totalDistance.toFixed(2)} // 🆕 Show distance
          />
        </div>
      </div>

      {/* Popup for Trip Name */}
      {showPopup && (
        <AddTripNamePopup
          tripName={tripName}
          setTripName={setTripName}
          onConfirm={handleConfirm}
          onClose={() => setShowPopup(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default OptimizedTripRoute;
