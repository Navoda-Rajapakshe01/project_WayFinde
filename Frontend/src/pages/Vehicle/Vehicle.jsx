import React, { useEffect, useState, useMemo } from "react";
import HeroSection from "../../Components/HeroSection/HeroSection.jsx";
import axios from "axios";
import VehicleCard from "./VehicleCardTraveller.jsx";
import FilterSection from "./FilterSection.jsx";
import DestinationTags from "./DestinationTags.jsx";
import "../CSS/vehicle.css";

const Vehicle = ({ isSignedIn = true }) => {
  const [vehicles, setVehicles] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    type: "",
    location: "",
    NumberOfPassengers: "",
    transmissionType: "",
    FuelType: "",
    searchTerm: "",
  });

  const popularDestinations = [
    "Colombo",
    "Kandy",
    "Galle",
    "Nuwara Eliya",
    "Ella",
    "Negombo",
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5030/api/Vehicle");
        const allVehicles = response.data;
        setVehicles(allVehicles);

        const recentlyViewedIds =
          JSON.parse(localStorage.getItem("recentlyViewedVehicles")) || [];
        const recentVehicles = allVehicles
          .filter((v) => recentlyViewedIds.includes(v.id))
          .slice(0, 3);
        setRecentlyViewed(recentVehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]);
        setRecentlyViewed([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Filter vehicles based on filters
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      // Type filter
      if (
        filters.type &&
        vehicle.type?.toLowerCase() !== filters.type.toLowerCase()
      )
        return false;

      // Location filter
      if (
        filters.location &&
        vehicle.location?.toLowerCase() !== filters.location.toLowerCase()
      )
        return false;

      // FuelType filter
      if (
        filters.FuelType &&
        vehicle.FuelType?.toLowerCase() !== filters.FuelType.toLowerCase()
      )
        return false;

      // NumberOfPassengers filter
      if (filters.NumberOfPassengers) {
        const filterCap =
          filters.NumberOfPassengers === "8+"
            ? 8
            : parseInt(filters.NumberOfPassengers, 10);
        const vehicleCap = parseInt(vehicle.NumberOfPassengers, 10);
        if (filters.NumberOfPassengers === "8+") {
          if (!vehicleCap || vehicleCap < filterCap) return false;
        } else {
          if (vehicleCap !== filterCap) return false;
        }
      }

      // Transmission filter
      if (
        filters.transmissionType &&
        vehicle.transmissionType?.toLowerCase() !==
          filters.transmissionType.toLowerCase()
      )
        return false;

      // Price range filter
      if (
        vehicle.PricePerDay < filters.priceRange[0] ||
        vehicle.PricePerDay > filters.priceRange[1]
      )
        return false;

      // Search term filter (brand, model, location)
      if (filters.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        if (
          !vehicle.brand?.toLowerCase().includes(search) &&
          !vehicle.model?.toLowerCase().includes(search) &&
          !vehicle.location?.toLowerCase().includes(search)
        )
          return false;
      }

      return true;
    });
  }, [vehicles, filters]);

  const filteredRecentlyViewed = recentlyViewed.filter((vehicle) =>
    filteredVehicles.some((v) => v.id === vehicle.id)
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleBookNow = (vehicle) => {
    // You can implement booking logic here
    console.log("Book Now clicked for:", vehicle);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        title="Your Journey, Your Ride"
        subtitle="Discover and reserve top vehicles for your travel"
        backgroundImage="https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg"
        color="black"
        placeHolder="Search for vehicles..."
      />
      <div className="vehicle-page-container">
        <FilterSection onFilterChange={handleFilterChange} />

        {/* Vehicles Listing */}
        <section className="vehicle-featured-section">
          <h2 className="vehicle-section-title">Available Vehicles</h2>
          <div className="vehicle-card-grid">
            {filteredVehicles.slice(0, visibleCount).map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isSignedIn={isSignedIn}
                onBookNow={() => handleBookNow(vehicle)}
              />
            ))}
          </div>
          {visibleCount < filteredVehicles.length && (
            <button className="load-more-btn" onClick={handleLoadMore}>
              Load More
            </button>
          )}
        </section>

        {/* Recently Viewed */}
        {filteredRecentlyViewed.length > 0 && (
          <section>
            <h2 className="vehicle-section-title">Recently Viewed Vehicles</h2>
            <div className="vehicle-card-grid">
              {filteredRecentlyViewed.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSignedIn={isSignedIn}
                  onBookNow={() => handleBookNow(vehicle)}
                />
              ))}
            </div>
          </section>
        )}
        <br />
        <br />
        {/* Popular Destinations */}
        <DestinationTags destinations={popularDestinations} />
      </div>
    </>
  );
};

export default Vehicle;
