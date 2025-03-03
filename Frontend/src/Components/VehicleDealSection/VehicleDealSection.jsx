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
    image: "https://via.placeholder.com/300",
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
  },
  // Add more vehicles here...
];

function VehicleDealSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 15;

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
