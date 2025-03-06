import React, { useState } from "react";
import "./AccommodationDealSection.css";
import Pagination from "../Pagination/Pagination";
import AccommodationDealCard from "../AccommodationDealCard/AccommodationDealCard";

// Mock data for accommodation deals
const accommodationDeals = [
  {
    id: 1,
    name: "Hotel 1",
    price: 100,
    type: "Hotel",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 2,
    name: "Hotel 2",
    price: 150,
    type: "Hotel",
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 3,
    name: "Hotel 3",
    price: 200,
    type: "Hotel",
    guests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 3,
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 4,
    name: "Hotel 4",
    price: 250,
    type: "Hotel",
    guests: 8,
    bedrooms: 4,
    beds: 4,
    baths: 4,
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 5,
    name: "Hotel 5",
    price: 300,
    type: "Hotel",
    guests: 10,
    bedrooms: 5,
    beds: 5,
    baths: 5,
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
  {
    id: 6,
    name: "Hotel 6",
    price: 350,
    type: "Hotel",
    guests: 12,
    bedrooms: 6,
    beds: 6,
    baths: 6,
    image: "https://via.placeholder.com/300",
    location: "Colombo, Sri Lanka",
  },
];

const AccommodationDealSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 4;
  const indexOfLastDeal = currentPage * dealsPerPage;
  const indexOfFirstDeal = indexOfLastDeal - dealsPerPage;
  const currentDeals = accommodationDeals.slice(
    indexOfFirstDeal,
    indexOfLastDeal
  );
  const totalPages = Math.ceil(accommodationDeals.length / dealsPerPage);

  return (
    <div className="accommodation-deal-section">
      <h2>Accommodation Deals</h2>
      <div className="accommodation-deal-grid">
        {currentDeals.map((accommodation) => (
          <AccommodationDealCard
            key={accommodation.id}
            accommodation={accommodation}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AccommodationDealSection;
