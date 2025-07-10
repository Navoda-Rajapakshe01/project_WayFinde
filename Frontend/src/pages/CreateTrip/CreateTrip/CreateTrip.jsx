import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Search } from "lucide-react";
import DistrictCategories from "../Components/DistrictCategories";
import PlacesList from "../Components/PlacesList";
import TripMap from "../Components/TripMap";
import StartLocationModal from "../Components/Modals/StartLocationModal";
import TravelDatesModal from "../Components/Modals/TravelDatesModal";
import TripNameModal from "../Components/Modals/TripNameModal";
import "./CreateTrip.css";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapMarkers, setMapMarkers] = useState([]);

  // Trip details state
  const [startingLocation, setStartingLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tripName, setTripName] = useState("");
  const [tripDistance, setTripDistance] = useState(0);
  const [tripTime, setTripTime] = useState("");
  const [totalSpend, setTotalSpend] = useState(0);

  // Modal states
  const [showStartLocationModal, setShowStartLocationModal] = useState(false);
  const [showTravelDatesModal, setShowTravelDatesModal] = useState(false);
  const [showTripNameModal, setShowTripNameModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch all districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5030/api/district/getAll"
        );
        console.log("Fetched districts:", response.data);
        setDistricts(response.data?.$values || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  // Fetch all places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5030/api/places/getAll"
        );
        setPlaces(response.data?.$values || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  // Calculate total spend whenever selected places change
  useEffect(() => {
    if (selectedPlaces.length > 0) {
      // Calculate total spend
      const spend = selectedPlaces.reduce((total, place) => {
        return total + (place.avgSpend || 0);
      }, 0);
      setTotalSpend(spend);

      // Calculate trip time
      const timeInHours = selectedPlaces.reduce((total, place) => {
        // Extract hours from avgTime (e.g., "4 hours" -> 4)
        const hours = Number.parseInt(place.avgTime?.split(" ")[0]) || 0;
        return total + hours;
      }, 0);

      // Convert hours to days/hours format
      const days = Math.floor(timeInHours / 24);
      const remainingHours = timeInHours % 24;

      if (days > 0) {
        setTripTime(
          `${days} day${days > 1 ? "s" : ""} ${
            remainingHours > 0
              ? `${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
              : ""
          }`
        );
      } else {
        setTripTime(`${timeInHours} hour${timeInHours !== 1 ? "s" : ""}`);
      }
    } else {
      setTotalSpend(0);
      setTripTime("");
    }
  }, [selectedPlaces]);

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlaces = selectedDistrict
    ? places.filter(
        (place) =>
          (place.district?.name === selectedDistrict.name ||
            place.district === selectedDistrict.id) &&
          place.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Group places by type
  const doPlaces = filteredPlaces.filter((place) => place.placeType === "Do");
  const relaxPlaces = filteredPlaces.filter(
    (place) => place.placeType === "Relax"
  );
  const stayPlaces = filteredPlaces.filter(
    (place) => place.placeType === "Stay"
  );

  // Handle district selection
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setMapMarkers([]);
  };

  // Function to extract coordinates from Google Maps URL
  const extractCoordinates = (googleUrl) => {
    try {
      // Try to extract coordinates from URL format like "https://maps.google.com/?q=6.0269,80.2167"
      const match = googleUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match && match.length === 3) {
        return {
          lat: Number.parseFloat(match[1]),
          lng: Number.parseFloat(match[2]),
        };
      }

      // Try to extract from format like "https://maps.google.com/?q=Place+Name,+Location"
      const placeMatch = googleUrl.match(/q=([^&]+)/);
      if (placeMatch && placeMatch.length > 1) {
        // This is a place name, use a default position with slight randomization
        return {
          lat: 6.0329 + Math.random() * 0.05,
          lng: 80.2168 + Math.random() * 0.05,
        };
      }

      // If no coordinates found, return default coordinates for Sri Lanka
      return {
        lat: 6.0329 + Math.random() * 0.05,
        lng: 80.2168 + Math.random() * 0.05,
      };
    } catch (error) {
      console.error("Error extracting coordinates:", error);
      return {
        lat: 6.0329 + Math.random() * 0.05,
        lng: 80.2168 + Math.random() * 0.05,
      };
    }
  };

  // Handle adding a place to the trip
  const handleAddPlace = (place, isAlreadySelected = false) => {
    if (isAlreadySelected) {
      // Unselect the place
      setSelectedPlaces((prev) => prev.filter((p) => p.id !== place.id));
      setMapMarkers((prev) => prev.filter((marker) => marker.id !== place.id));

      // If this was the starting location, reset it
      if (startingLocation && startingLocation.id === place.id) {
        setStartingLocation(null);
      }
    } else {
      // Select the place
      setSelectedPlaces((prev) => [...prev, place]);

      if (place.googleMapLink) {
        const position = extractCoordinates(place.googleMapLink);
        const newMarker = {
          id: place.id,
          position,
          title: place.name,
        };
        setMapMarkers((prev) => [...prev, newMarker]);
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calculate trip distance using Google Maps Distance Matrix API
  const calculateTripDistance = async (startLocationId, destinations) => {
    // Find the starting location
    const start = selectedPlaces.find((place) => place.id === startLocationId);
    if (!start || !start.googleUrl) return 0;

    // Extract coordinates
    const startCoords = extractCoordinates(start.googleUrl);

    // In a real implementation, you would use the Google Maps Distance Matrix API
    // For now, we'll simulate with a simple calculation
    let totalDistance = 0;
    let lastCoords = startCoords;

    // Create an ordered list of destinations (starting with the selected starting point)
    const orderedPlaces = [
      start,
      ...selectedPlaces.filter((place) => place.id !== startLocationId),
    ];

    // Calculate distances between consecutive points
    for (let i = 1; i < orderedPlaces.length; i++) {
      const place = orderedPlaces[i];
      if (place.googleMapLink) {
        const coords = extractCoordinates(place.googleMapLink);

        // Simple distance calculation (this is just an approximation)
        const latDiff = coords.lat - lastCoords.lat;
        const lngDiff = coords.lng - lastCoords.lng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough conversion to km

        totalDistance += distance;
        lastCoords = coords;
      }
    }

    return Math.round(totalDistance);
  };

  // Start the trip creation flow
  const handleNextStep = () => {
    if (selectedPlaces.length === 0) return;
    setShowStartLocationModal(true);
  };

  // Handle starting location selection
  const handleStartLocationSelect = async (locationId) => {
    const location = selectedPlaces.find((place) => place.id === locationId);
    setStartingLocation(location);

    // Calculate trip distance
    const distance = await calculateTripDistance(locationId, selectedPlaces);
    setTripDistance(distance);

    setShowStartLocationModal(false);
    setShowTravelDatesModal(true);
  };

  // Handle travel dates selection
  const handleTravelDatesSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setShowTravelDatesModal(false);
    setShowTripNameModal(true);
  };

  // Handle trip name submission
  const handleTripNameSubmit = async (name) => {
    setTripName(name);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the trip data
      const tripData = {
        tripName: name,
        tripDistance,
        tripTime,
        totalSpend,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        userId: "66492bce7d660de8701c9aa1",
        PlaceIds: selectedPlaces.map((place) => place.id),
      };

      console.log(
        "Sending trip data to backend:",
        JSON.stringify(tripData, null, 2)
      );

      // Send the data to the API
      const response = await axios.post(
        "http://localhost:5030/api/trips/add-trip",
        tripData
      );

      setSubmitSuccess(true);
      setShowTripNameModal(false);

      // Navigate to the optimized route page with the new trip ID
      if (response.data && response.data.tripId) {
        setTimeout(() => {
          navigate(`/optimizedroute/${response.data.tripId}`);
        }, 1500);
      } else {
        // Reset the form after successful submission if no trip ID is returned
        setTimeout(() => {
          setSelectedPlaces([]);
          setMapMarkers([]);
          setStartingLocation(null);
          setStartDate(null);
          setEndDate(null);
          setTripName("");
          setTripDistance(0);
          setSubmitSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      console.error("Full error response:", error.response);

      // Try to show a detailed error message if available
      const backendMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error.response?.data));

      setSubmitError(
        backendMessage || "Failed to create trip. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-header">
        <h1 className="create-trip-title">Find Your Next Adventure</h1>
        <p className="create-trip-subtitle">
          Find places to visit and get personalized recommendations
        </p>

        <div className="search-container-trip">
          <input
            type="text"
            placeholder=" Search for Places you want to visit"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input-trip"
          />
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading districts and places...</p>
          </div>
        )}
      </div>

      <div className="create-trip-content">
        <div className="create-trip-left">
          {selectedDistrict ? (
            <div className="selected-district-view">
              <button
                onClick={() => setSelectedDistrict(null)}
                className="flex items-center gap-2 text-blue-600 font-medium hover:underline mb-4"
              >
                <ArrowLeft size={20} />
                Back to Districts
              </button>

              <h2 className="district-title">
                {selectedDistrict.districtName} District
              </h2>

              {doPlaces.length > 0 && (
                <div className="places-section">
                  <h3 className="section-title">Do</h3>
                  <PlacesList
                    places={doPlaces}
                    onAddPlace={handleAddPlace}
                    selectedPlaces={selectedPlaces}
                  />
                </div>
              )}

              {relaxPlaces.length > 0 && (
                <div className="places-section">
                  <h3 className="section-title">Relax</h3>
                  <PlacesList
                    places={relaxPlaces}
                    onAddPlace={handleAddPlace}
                    selectedPlaces={selectedPlaces}
                  />
                </div>
              )}

              {stayPlaces.length > 0 && (
                <div className="places-section">
                  <h3 className="section-title">Stay</h3>
                  <PlacesList
                    places={stayPlaces}
                    onAddPlace={handleAddPlace}
                    selectedPlaces={selectedPlaces}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {console.log("Passing districts to UI:", districts)}
              <DistrictCategories
                districts={districts.filter((district) =>
                  district.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )}
                onSelectDistrict={handleDistrictSelect}
              />
            </>
          )}
        </div>

        <div className="create-trip-right">
          <div className="selected-destinations">
            <h2 className="destinations-title">Your Selected Destinations</h2>
            <p className="destinations-subtitle">
              Review and customize your trip itinerary
            </p>

            {selectedPlaces.length > 0 && (
              <div className="trip-summary">
                <div className="summary-item">
                  <span className="summary-label">Places:</span>
                  <span className="summary-value">{selectedPlaces.length}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Est. Time:</span>
                  <span className="summary-value">{tripTime || "N/A"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Est. Cost:</span>
                  <span className="summary-value">
                    Rs. {totalSpend.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="map-container">
              <TripMap markers={mapMarkers} />
              <button
                className="next-button"
                onClick={handleNextStep}
                disabled={selectedPlaces.length === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStartLocationModal && (
        <StartLocationModal
          places={selectedPlaces}
          onSelect={handleStartLocationSelect}
          onClose={() => setShowStartLocationModal(false)}
        />
      )}

      {showTravelDatesModal && (
        <TravelDatesModal
          onSelect={handleTravelDatesSelect}
          onBack={() => {
            setShowTravelDatesModal(false);
            setShowStartLocationModal(true);
          }}
          onClose={() => setShowTravelDatesModal(false)}
        />
      )}

      {showTripNameModal && (
        <TripNameModal
          onSubmit={handleTripNameSubmit}
          isSubmitting={isSubmitting}
          error={submitError}
          onBack={() => {
            setShowTripNameModal(false);
            setShowTravelDatesModal(true);
          }}
          onClose={() => setShowTripNameModal(false)}
        />
      )}

      {/* Success message */}
      {submitSuccess && (
        <div className="success-message">
          <div className="success-content">
            <div className="success-icon">✓</div>
            <h3>Trip Created Successfully!</h3>
            <p>Redirecting to your optimized route...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTrip;
