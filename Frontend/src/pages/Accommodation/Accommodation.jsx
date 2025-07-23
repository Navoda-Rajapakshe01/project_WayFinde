import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import HeroSection from "../../Components/HeroSection/HeroSection";
import AccommodationCard from "./AccommodationCardTraveller";
import AccommodationFilter from "./AccommodationFilter";
import PopularLocations from "./PopularLocations";
import "../CSS/Accommodation.css";

const Accommodation = ({ isSignedIn = true }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    accommodationType: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Fetch accommodations and update price range dynamically
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5030/api/Accommodation");

        const raw = res.data;
        const data = Array.isArray(raw) ? raw : raw?.$values || [];

        setAccommodations(data);
        setFilteredAccommodations(data);

        if (data.length > 0) {
          const prices = data.map((acc) => acc.pricePerNight || 0);
          const minP = Math.min(...prices);
          const maxP = Math.max(...prices);
          setMinPrice(minP);
          setMaxPrice(maxP);
          setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
        }
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
        setAccommodations([]);
        setFilteredAccommodations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Apply filters whenever filters or accommodations change
  useEffect(() => {
    let results = Array.isArray(accommodations) ? [...accommodations] : [];

    // Price range filter
    results = results.filter(
      (acc) =>
        acc.pricePerNight >= (filters.priceRange[0] || 0) &&
        acc.pricePerNight <= (filters.priceRange[1] || maxPrice)
    );

    // Accommodation type filter
    if (filters.accommodationType) {
      results = results.filter((acc) => acc.type === filters.accommodationType);
    }

    // Location filter (case insensitive includes)
    if (filters.location) {
      results = results.filter((acc) =>
        acc.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Guests filter
    if (filters.guests && !isNaN(parseInt(filters.guests))) {
      const guestsCount = parseInt(filters.guests);
      results = results.filter((acc) => acc.maxGuests >= guestsCount);
    }

    // Bedrooms filter
    if (filters.bedrooms && !isNaN(parseInt(filters.bedrooms))) {
      const bedroomsCount = parseInt(filters.bedrooms);
      results = results.filter((acc) => acc.bedrooms >= bedroomsCount);
    }

    // Bathrooms filter
    if (filters.bathrooms && !isNaN(parseInt(filters.bathrooms))) {
      const bathroomsCount = parseInt(filters.bathrooms);
      results = results.filter((acc) => acc.bathrooms >= bathroomsCount);
    }

    setFilteredAccommodations(results);
  }, [filters, accommodations, maxPrice]);

  // Update filters from child
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setVisibleCount(6); // reset visible count when filters change
  };

  // Load more button handler
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading accommodations...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        title="Find Your Perfect Stay"
        subtitle="Discover and book accommodations for your journey"
        backgroundImage="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
        color="white"
        placeHolder="Search for accommodations..."
      />

      <div className="accommodation-page-container">
        <AccommodationFilter
          onFilterChange={handleFilterChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <section className="accommodation-listings-section">
          <h2 className="accommodation-section-title">
            Available Accommodations
          </h2>

          {filteredAccommodations.length === 0 ? (
            <p>
              No accommodations found matching your criteria. Try adjusting your
              filters.
            </p>
          ) : (
            <>
              <div className="accommodation-card-grid">
                {filteredAccommodations.slice(0, visibleCount).map((acc) => (
                  <AccommodationCard key={acc.id} accommodation={acc} />
                ))}
              </div>

              {visibleCount < filteredAccommodations.length && (
                <div className="load-more-container">
                  <Button className="load-more-btn" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        <PopularLocations
          locations={[
            "Colombo",
            "Kandy",
            "Galle",
            "Nuwara Eliya",
            "Ella",
            "Bentota",
          ]}
        />
      </div>
    </>
  );
};

export default Accommodation;
