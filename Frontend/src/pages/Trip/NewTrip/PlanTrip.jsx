import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; //  Import useNavigate
import "./PlanTrip.css";
import MainNavbar from "../../../Components/MainNavbar/MainNavbar";
import placesData from "../places.json";
import { FaPlus, FaCheck } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyAM3iuCz-gy_ZCKscaWWhlsaQ5WUabyy2w";

const PlanTrip = () => {
  const navigate = useNavigate(); //  Initialize useNavigate correctly

  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showPopup, setShowPopup] = useState(null); // "location" or "dates"
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Initialize Google Maps
  useEffect(() => {
    setPlaces(placesData);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    window.initMap = () => {
      const googleMap = new window.google.maps.Map(
        document.getElementById("map"),
        {
          zoom: 6,
          center: { lat: 7.8731, lng: 80.7718 },
        }
      );
      setMap(googleMap);
    };
    document.body.appendChild(script);
  }, []);

  // Add or remove place from selection
  const handleSelectPlace = (place) => {
    const isSelected = selectedPlaces.find((p) => p.id === place.id);
    if (isSelected) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
      removeMarker(place);
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
      addMarker(place);
    }
  };

  // Add marker to Google Map
  const addMarker = (place) => {
    if (!map) return;
    const marker = new window.google.maps.Marker({
      position: place.location,
      map: map,
      title: place.name,
    });
    setMarkers([...markers, marker]);
  };

  // Remove marker from Google Map
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
    <div className="relative">
      <MainNavbar />

      {/* Header Section */}
      <div className="header-fixed">
        <h2>Find Your Next Adventure</h2>
        <p>Find places to visit and get personalized recommendations</p>
        <input
          type="text"
          placeholder="Search for Places you want to visit"
          className="search-bar"
        />
      </div>

      <div className="plantrip-content">
        {/* Left Side - Places Section */}
        <div className="pc-body-left">
          <h2>Handpicked Just for You</h2>
          <p>Based on your interests, here are some top destinations.</p>
          <div className="cards-container">
            {places.map((place) => (
              <div key={place.id} className="card">
                <img src={place.image} alt={place.name} />
                <div className="card-details">
                  <h4>{place.name}</h4>
                  <p>{place.type}</p>
                  <button
                    className="select-btn"
                    onClick={() => handleSelectPlace(place)}
                  >
                    {selectedPlaces.find((p) => p.id === place.id) ? (
                      <FaCheck />
                    ) : (
                      <FaPlus />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Map Section */}
        <div className="pc-body-right">
          <h2>Your Selected Destinations</h2>
          <p>Review and customize your trip itinerary</p>
          <div
            id="map"
            className="relative h-96 w-full rounded-lg shadow-md"
          ></div>

          {/* Next Button Below Map */}
          <div className="next-btn-container">
            <button
              onClick={() => setShowPopup("location")}
              className="next-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* First Popup: Select Starting Location */}
      {showPopup === "location" && (
        <div className="popup-overlay-1">
          <div className="popup-container-1">
            <button
              onClick={() => setShowPopup(null)}
              className="popup-close-1"
            >
              &times;
            </button>
            <h2 className="popup-title">Choose your Starting location</h2>
            <p>
              Choose your starting point to plan the best route for your trip.
            </p>
            <select className="popup-select">
              <option>Pick a starting location...</option>
            </select>
            <button
              className="popup-confirm-1"
              onClick={() => setShowPopup("dates")}
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      )}

      {/* Second Popup: Select Travel Dates */}
      {showPopup === "dates" && (
        <div className="popup-overlay-1">
          <div className="popup-container-1">
            {/* Back Button */}
            <button
              onClick={() => setShowPopup("location")}
              className="popup-back-1"
            >
              ←
            </button>
            <button
              onClick={() => setShowPopup(null)}
              className="popup-close-1"
            >
              &times;
            </button>

            <h2 className="popup-title">Select Your Travel Dates</h2>
            <p>
              Choose the date range for your trip to plan your itinerary
              efficiently.
            </p>

            {/* Date Pickers */}
            <div className="date-picker-container">
              <div className="date-picker">
                <label>Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd / MM / yyyy"
                  className="popup-select"
                  placeholderText="Select Start Date"
                />
              </div>
              <div className="date-picker">
                <label>End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd / MM / yyyy"
                  className="popup-select"
                  placeholderText="Select End Date"
                />
              </div>
            </div>

            {/*  Navigate to OptimizedTripRoute */}
            <button
              className="popup-confirm-1"
              onClick={() => navigate("/trip-planner")}
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTrip;
