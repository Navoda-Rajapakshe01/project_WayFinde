import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation
import VehicleCard from "../VehicleCard/VehicleCard"; // Import the VehicleCard component
import "./VehicleSection.css"; // Update the CSS file name

const VehicleSection = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch data from your database (e.g., API call to fetch vehicles)
    // Replace with your actual API call
    const fetchedVehicles = [
      {
        id: 1,
        name: "Toyota Corolla",
        type: "Sedan",
        price: "$50/day",
        image: "/images/toyota-corolla.jpg",
        updatedAt: "2023-10-01", // Add a timestamp or date field
      },
      {
        id: 2,
        name: "Honda Civic",
        type: "Sedan",
        price: "$55/day",
        image: "/images/honda-civic.jpg",
        updatedAt: "2023-10-05",
      },
      {
        id: 3,
        name: "Ford Mustang",
        type: "Sports Car",
        price: "$120/day",
        image: "/images/ford-mustang.jpg",
        updatedAt: "2023-10-03",
      },
      {
        id: 4,
        name: "Tesla Model 3",
        type: "Electric Car",
        price: "$100/day",
        image: "/images/tesla-model3.jpg",
        updatedAt: "2023-10-07",
      },
      {
        id: 5,
        name: "Yamaha MT-15",
        type: "Motorcycle",
        price: "$30/day",
        image: "/images/yamaha-mt15.jpg",
        updatedAt: "2023-10-02",
      },
      {
        id: 6,
        name: "Vespa Scooter",
        type: "Scooter",
        price: "$25/day",
        image: "/images/vespa-scooter.jpg",
        updatedAt: "2023-10-06",
      },
    ];

    // Sort vehicles by the `updatedAt` field in descending order (newest first)
    const sortedVehicles = fetchedVehicles.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    setVehicles(sortedVehicles);
  }, []);

  // Display only the first 4 newest vehicles initially
  const displayedVehicles = showAll ? vehicles : vehicles.slice(0, 4);

  // Function to handle "See More" button click
  const handleSeeMoreClick = () => {
    navigate("/vehicle"); // Use navigate to redirect to the vehicles page
  };

  return (
    <div className="vehicle-section">
      <h2>Available Vehicles</h2>
      <div className="vehicle-cards">
        {displayedVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
      {!showAll && (
        <button className="see-more" onClick={handleSeeMoreClick}>
          See More Vehicles
        </button>
      )}
    </div>
  );
};

export default VehicleSection;
