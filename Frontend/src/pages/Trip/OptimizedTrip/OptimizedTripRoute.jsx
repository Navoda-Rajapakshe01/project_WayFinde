import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";
import MainNavbar from "../../../Components/MainNavbar/MainNavbar";
import Footer from "../../../Components/Footer/Footer";
import "./OptimizedTripRoute.css"; // Styling file

const GOOGLE_MAPS_API_KEY = "AIzaSyAM3iuCz-gy_ZCKscaWWhlsaQ5WUabyy2w"; // Replace with actual key

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
};

const center = { lat: 7.8731, lng: 80.7718 }; // Sri Lanka Center

const dummyDestinations = [
  {
    id: 1,
    name: "Shangri La Hotel Colombo",
    date: "15/02/2025",
    stay: "24 hours",
    cost: "LKR 90,000",
    image: "/path/to/image1.jpg",
  },
  {
    id: 2,
    name: "Kandy View Hotel",
    date: "16/02/2025",
    stay: "48 hours",
    cost: "LKR 50,000",
    image: "/path/to/image2.jpg",
  },
  {
    id: 3,
    name: "Jetwing Yala",
    date: "18/02/2025",
    stay: "72 hours",
    cost: "LKR 120,000",
    image: "/path/to/image3.jpg",
  },
  {
    id: 4,
    name: "Amaya Hills Kandy",
    date: "20/02/2025",
    stay: "24 hours",
    cost: "LKR 60,000",
    image: "/path/to/image4.jpg",
  },
  {
    id: 5,
    name: "Cinnamon Wild Yala",
    date: "22/02/2025",
    stay: "48 hours",
    cost: "LKR 80,000",
    image: "/path/to/image5.jpg",
  },
  {
    id: 6,
    name: "The Grand Kandyan",
    date: "24/02/2025",
    stay: "24 hours",
    cost: "LKR 70,000",
    image: "/path/to/image6.jpg",
  },
  {
    id: 7,
    name: "The Fortress Resort & Spa",
    date: "26/02/2025",
    stay: "48 hours",
    cost: "LKR 100,000",
    image: "/path/to/image7.jpg",
  },
  {
    id: 8,
    name: "The Kingsbury Colombo",
    date: "28/02/2025",
    stay: "24 hours",
    cost: "LKR 75,000",
    image: "/path/to/image8.jpg",
  },
];

const OptimizedTripRoute = () => {
  const navigate = useNavigate();
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const directionsService = useRef(null);
  const [directions, setDirections] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [tripName, setTripName] = useState("");

  useEffect(() => {
    if (isLoaded && !directions) {
      directionsService.current = new window.google.maps.DirectionsService();
      calculateOptimizedRoute();
    }
  }, [isLoaded]);

  const calculateOptimizedRoute = () => {
    if (!directionsService.current) return;

    directionsService.current.route(
      {
        origin: { lat: 6.9271, lng: 79.8612 },
        destination: { lat: 6.0535, lng: 80.2209 },
        waypoints: [
          { location: { lat: 7.2906, lng: 80.6337 }, stopover: true },
          { location: { lat: 6.9333, lng: 81.011 }, stopover: true },
        ],
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
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
          efficient travel route for a seamless experience. You can modify the
          order if needed or add more stops to your trip.
        </p>
      </div>

      <div className="content-container">
        <div className="trip-left-section">
          <div className="destination-list">
            {dummyDestinations.map((dest) => (
              <div key={dest.id} className="destination-card">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="destination-image"
                />
                <div className="destination-details">
                  <h3>{dest.name}</h3>
                  <p>Date: {dest.date}</p>
                  <p>Staying Time: {dest.stay}</p>
                  <p>Avg Spent: {dest.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trip-right-section">
          <div className="trip-actions">
            <button onClick={() => navigate("/trip/newTrip")}>
              Add More Places
            </button>
            <button>Rearrange Route</button>
            <button onClick={() => setShowPopup(true)}>Complete Trip</button>
          </div>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={7}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          )}

          <div className="trip-summary">
            <div className="summary-box">Travel Days: 14</div>
            <div className="summary-box">Total Destinations: 8</div>
            <div className="summary-box">Travel Distance: 245 km</div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay-2">
          <div className="popup-container-2">
            <button
              onClick={() => setShowPopup(false)}
              className="popup-close-2"
            >
              &times;
            </button>
            <h2 className="popup-title">Add Trip Name</h2>
            <p>Give your trip a name to get started.</p>
            <input
              type="text"
              className="popup-input"
              placeholder="Enter a trip name..."
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
            <button className="popup-confirm-2" onClick={handleConfirm}>
              Confirm & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedTripRoute;
