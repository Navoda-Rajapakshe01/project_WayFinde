import React, { useState } from "react";
import VehicleDealCard from "../VehicleDealCard/VehicleDealCard";
import Pagination from "../Pagination/Pagination";
import "./VehicleDealSection.css";

// Mock data for vehicle deals
const vehicleDeals = [
  {
    id: 1,
    name: "Toyota Corolla",
    price: 50,
    type: "Sedan",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image:
      "data:image/jpeg;base64,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",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 2,
    name: "Honda CR-V",
    price: 70,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 3,
    name: "Honda Cvc",
    price: 90,
    type: "Car",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 4,
    name: "Toyota pado",
    price: 150,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 5,
    name: "Suzuki Alto",
    price: 30,
    type: "car",
    passengers: 4,
    fuelType: "Petrol",
    transmission: "manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 6,
    name: "Nissan Sunny",
    price: 40,
    type: "Car",
    passengers: 5,
    fuelType: "Desiel",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 7,
    name: "Toyota Corolla",
    price: 50,
    type: "Sedan",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 8,
    name: "Honda CR-V",
    price: 70,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 9,
    name: "Honda Cvc",
    price: 90,
    type: "Car",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 10,
    name: "Toyota pado",
    price: 150,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 11,
    name: "Suzuki Alto",
    price: 30,
    type: "car",
    passengers: 4,
    fuelType: "Petrol",
    transmission: "manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 12,
    name: "Nissan Sunny",
    price: 40,
    type: "Car",
    passengers: 5,
    fuelType: "Desiel",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 13,
    name: "Toyota Corolla",
    price: 50,
    type: "Sedan",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 14,
    name: "Honda CR-V",
    price: 70,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 15,
    name: "Honda Cvc",
    price: 90,
    type: "Car",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 16,
    name: "Toyota pado",
    price: 150,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 17,
    name: "Suzuki Alto",
    price: 30,
    type: "car",
    passengers: 4,
    fuelType: "Petrol",
    transmission: "manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 18,
    name: "Nissan Sunny",
    price: 40,
    type: "Car",
    passengers: 5,
    fuelType: "Desiel",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 19,
    name: "Toyota Corolla",
    price: 50,
    type: "Sedan",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 20,
    name: "Honda CR-V",
    price: 70,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 21,
    name: "Honda Cvc",
    price: 90,
    type: "Car",
    passengers: 5,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 22,
    name: "Toyota pado",
    price: 150,
    type: "SUV",
    passengers: 7,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 23,
    name: "Suzuki Alto",
    price: 30,
    type: "car",
    passengers: 4,
    fuelType: "Petrol",
    transmission: "manual",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 24,
    name: "Nissan Sunny",
    price: 40,
    type: "Car",
    passengers: 5,
    fuelType: "Desiel",
    transmission: "Automatic",
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  // Add more vehicles here...
];

function VehicleDealSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 4;

  // Calculate total pages
  const totalPages = Math.ceil(vehicleDeals.length / dealsPerPage);

  // Get current deals for the page
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = vehicleDeals.slice(indexOfFirstDeal, indexOfLastDeal);

  return (
    <div className="vehicle-deal-section">
      <h2>Vehicle Deals</h2>
      <div className="vehicle-deal-grid">
        {currentDeals.map((vehicle) => (
          <VehicleDealCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default VehicleDealSection;
