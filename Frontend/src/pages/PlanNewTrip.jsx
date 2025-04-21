import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Initialize useNavigate
import axios from "axios";
import "../pages/CSS/PlanNewTrip.css";
import MainNavbar from "../Components/MainNavbar/MainNavbar";
import { FaPlus, FaCheck } from "react-icons/fa"; // Icons for select/unselect
import LocationPopup from "../components/PlanNewTrip/LocationPopup"; // Import LocationPopup component
import DatePickerPopup from "../components/PlanNewTrip/DatePickerPopup"; // Import DatePickerPopup component
import MapComponent from "../components/PlanNewTrip/MapComponent"; // Import MapComponent for Google Maps
import useFetchPlaces from "./customHooks/useFetchPlaces";

const PlanNewTrip = () => {
  const navigate = useNavigate();

  const [selectedPlaces, setSelectedPlaces] = useState([]); // Track selected places
  const [districts, setDistricts] = useState([]); // List of districts
  const [selectedDistrict, setSelectedDistrict] = useState(null); // Selected district
  const [startDate, setStartDate] = useState(null); // Start date
  const [endDate, setEndDate] = useState(null); // End date
  const [showPopup, setShowPopup] = useState(null); // Show location or dates popup
  const [map, setMap] = useState(null); // Google Map state
  const [markers, setMarkers] = useState([]); // Markers on the map

  // Fetch places based on selected district using custom hook
  const { places, loading, error } = useFetchPlaces(selectedDistrict);

  useEffect(() => {
    // Fetch available districts when the component mounts
    axios
      .get("http://localhost:5000/api/districts")
      .then((response) => {
        setDistricts(response.data); // Set districts from the API
      })
      .catch((error) => {
        console.error("Error fetching districts:", error); // Error handling
      });
  }, []);

  // Handle district change and fetch places based on selected district
  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
  };

  // Handle place selection and unselection
  const handleSelectPlace = (place) => {
    const isSelected = selectedPlaces.find((p) => p.id === place.id);
    if (isSelected) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id)); // Deselect place
    } else {
      setSelectedPlaces([...selectedPlaces, place]); // Select place
    }
  };

  // Handle form submission to save trip
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tripData = {
      tripName: "My Trip", // Default trip name (can be dynamic)
      startDate,
      endDate,
      locations: selectedPlaces.map((place) => place.id), // Send selected place IDs
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/trips",
        tripData
      );
      console.log("Trip saved:", response.data); // Log success
      navigate("/upcoming-trips"); // Navigate to upcoming trips page
    } catch (error) {
      console.error("Error saving trip:", error); // Error handling
    }
  };
  const handleNextClick = () => {
    setShowPopup("location"); // Show location popup when Next is clicked
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
            {places &&
              places.map((place) => (
                <div key={place.id} className="card">
                  <img src={place.image} alt={place.name} />
                  <div className="card-details">
                    <h4>{place.name}</h4>
                    <p>{place.type}</p>
                    <button
                      className="select-btn"
                      onClick={() => handleSelectPlace(place)} // Handle place selection
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
          <div className="top-of-map">
            <div className="map-header">
              <h2>Your Selected Destinations</h2>
              <p>Review and customize your trip itinerary</p>
            </div>
            {/* Next Button Below Map */}
            <div className="continue-btn-container">
              <button
                onClick={handleNextClick} // Trigger the popup to open on Next button click
                className="continue-btn"
              >
                Continue
              </button>
            </div>
          </div>

          <MapComponent
            places={places}
            map={map}
            setMap={setMap}
            markers={markers}
            setMarkers={setMarkers}
          />
        </div>
      </div>

      {/* First Popup: Select Starting Location */}
      {showPopup === "location" && (
        <LocationPopup
          places={places}
          setShowPopup={setShowPopup}
          handleSelectPlace={handleSelectPlace}
        />
      )}

      {/* Second Popup: Select Travel Dates */}
      {showPopup === "dates" && (
        <DatePickerPopup
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setShowPopup={setShowPopup}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default PlanNewTrip;
