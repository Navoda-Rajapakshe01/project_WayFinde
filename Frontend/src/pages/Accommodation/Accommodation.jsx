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
    priceRange: [0, 10000], // initial dummy range
    accommodationType: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Fetch accommodations & dynamically update price range
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5030/api/accommodation");
        const data = res.data;

        setAccommodations(data);
        setFilteredAccommodations(data);

        if (data.length) {
          const prices = data.map((acc) => acc.pricePerNight);
          const minP = Math.min(...prices);
          const maxP = Math.max(...prices);
          setMinPrice(minP);
          setMaxPrice(maxP);
          setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
        }
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Apply filters whenever filters or accommodations change
  useEffect(() => {
    let results = [...accommodations];

    results = results.filter(
      (acc) =>
        acc.pricePerNight >= filters.priceRange[0] &&
        acc.pricePerNight <= filters.priceRange[1]
    );

    if (filters.accommodationType) {
      results = results.filter((acc) => acc.type === filters.accommodationType);
    }

    if (filters.location) {
      results = results.filter((acc) =>
        acc.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.guests) {
      results = results.filter(
        (acc) => acc.maxGuests >= parseInt(filters.guests)
      );
    }

    if (filters.bedrooms) {
      results = results.filter(
        (acc) => acc.bedrooms >= parseInt(filters.bedrooms)
      );
    }

    if (filters.bathrooms) {
      results = results.filter(
        (acc) => acc.bathrooms >= parseInt(filters.bathrooms)
      );
    }

    setFilteredAccommodations(results);
  }, [filters, accommodations]);

  // Handler to update filters from child component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setVisibleCount(6); // Reset visible count on filter change
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
        {/* Filters */}
        <AccommodationFilter
          onFilterChange={handleFilterChange}
          minPrice={0} // minPrice fixed as 0 per your requirement
          maxPrice={maxPrice} // maxPrice dynamic
        />

        {/* Listings */}
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
                  <AccommodationCard
                    key={acc.id}
                    accommodation={acc}
                    // You can add onBookNow handler here if needed
                  />
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

        {/* Popular Locations */}
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
[];
