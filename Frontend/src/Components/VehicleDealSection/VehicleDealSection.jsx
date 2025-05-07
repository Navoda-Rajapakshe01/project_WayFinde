import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicles } from "../../api"; // Import getVehicles from axios.js
import Pagination from "../Pagination/Pagination"; // Assuming this exists
import VehicleDealCard from "../VehicleDealCard/VehicleDealCard"; // Assuming this exists
import "./VehicleDealSection.css";

const VehicleDealSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 4; // Display 4 vehicles per page
  const navigate = useNavigate();

  // Fetch vehicles from the backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVehicles(); // Calls GET /api/vehicle
        // Map backend response to frontend format
        const mappedVehicles = data.map((vehicle) => ({
          id: vehicle.id,
          name: `${vehicle.brand} ${vehicle.model}`,
          type: vehicle.type,
          price: `$${vehicle.pricePerDay.toFixed(2)}/day`,
          passengers: vehicle.numberOfPassengers,
          location: vehicle.location,
          fuelType: vehicle.fuelType,
          transmissionType: vehicle.transmissionType,
          image:
            vehicle.images?.[0]?.imageUrl || "https://via.placeholder.com/300", // Fallback image
        }));
        setVehicles(mappedVehicles);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "No vehicles found"
            : "Failed to load vehicle deals. Please try again."
        );
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Calculate vehicles to display on the current page
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = vehicles.slice(
    indexOfFirstVehicle,
    indexOfLastVehicle
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  // Handle "See More" button click
  const handleSeeMoreClick = () => {
    navigate("/vehicle"); // Navigate to the full vehicles page
  };

  return (
    <div className="vehicle-deal-section">
      <h2>Hot Vehicle Deals</h2>
      {loading && <div>Loading vehicle deals...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && vehicles.length === 0 && (
        <div>No vehicle deals available.</div>
      )}
      {!loading && !error && vehicles.length > 0 && (
        <>
          <div className="vehicle-deal-grid">
            {currentVehicles.map((vehicle) => (
              <VehicleDealCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          <Pagination
            totalItems={vehicles.length}
            itemsPerPage={vehiclesPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          <button className="see-more-button" onClick={handleSeeMoreClick}>
            See More Vehicles
          </button>
        </>
      )}
    </div>
  );
};

export default VehicleDealSection;
