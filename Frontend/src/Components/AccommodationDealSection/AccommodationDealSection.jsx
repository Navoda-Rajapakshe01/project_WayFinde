import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccommodations } from "../../api"; // Changed to match your api.js
import Pagination from "../Pagination/Pagination";
import AccommodationDealCard from "../AccommodationDealCard/AccommodationDealCard";
import "./AccommodationDealSection.css";

const AccommodationDealSection = () => {
  const [accommodationDeals, setAccommodationDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dealsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAccommodations();
        const mappedAccommodations = data.map((accommodation) => ({
          id: accommodation.id,
          name: accommodation.name,
          type: accommodation.type,
          price: `${accommodation.pricePerDay.toFixed(2)}`,
          guests: accommodation.numberOfGuests,
          rooms: accommodation.numberOfBedRooms,
          beds: accommodation.numberOfBeds,
          bathRooms: accommodation.numberOfBathRooms,
          location: accommodation.location,
          ownerName: accommodation.ownerName,
          ownerCity: accommodation.ownerCity,
          image:
            accommodation.images?.[0]?.imageUrl ||
            "https://via.placeholder.com/300",
        }));
        setAccommodationDeals(mappedAccommodations);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "No Accommodations found"
            : "Failed to load Accommodation deals. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

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
      {loading && <p>Loading accommodations...</p>}
      {error && <p className="error">{error}</p>}
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
