import React, { useState, useEffect } from "react";
import "./FeaturedListingsSection.css";
import "../../App.css";

const FeaturedCard = ({ item }) => (
  <a href={item.link} className="featured-item-card-link">
    <div className="featured-item-card">
      <img src={item.image} alt={item.name} className="featured-item-image" />
      <div className="featured-item-content">
        <h4 className="featured-item-name">{item.name}</h4>
        <p className="featured-item-details">
          {item.type} - {item.price}
        </p>
      </div>
    </div>
  </a>
);

const FeaturedListingsSection = () => {
  const [featuredAccommodations, setFeaturedAccommodations] = useState([]);
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Helper to fetch both datasets in parallel
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [accommodationRes, vehicleRes] = await Promise.all([
          fetch("http://localhost:5030/api/Accommodation"), // Replace with your actual API
          fetch("http://localhost:5030/api/Vehicle"), // Replace with your actual API
        ]);

        if (!accommodationRes.ok || !vehicleRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const accommodationsData = await accommodationRes.json();
        const vehiclesData = await vehicleRes.json();

        // Format or map data if needed to match your component’s expected structure
        setFeaturedAccommodations(accommodationsData);
        setFeaturedVehicles(vehiclesData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading featured listings...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <section className="featured-listings-section homesection-padding">
      <div className="container">
        <h2 className="homesection-title text-center">Travel Essentials</h2>
        <p className="homesection-subtitle text-center">
          Find the perfect stay and ride for your adventure.
        </p>

        <div className="listings-container">
          {/* Accommodations */}
          <div className="listing-category">
            <h3 className="listing-category-title">Featured Accommodations</h3>
            <div className="featured-items-grid">
              {featuredAccommodations.length > 0 ? (
                featuredAccommodations.map((item) => (
                  <FeaturedCard
                    item={{
                      id: item.id,
                      name: item.name,
                      type: item.type,
                      image:
                        item.imageUrls?.[0] ||
                        "https://via.placeholder.com/300x200?text=No+Image",
                      price: `Rs ${item.pricePerNight}/night`,
                      link: `/accommodation/${item.id}`,
                    }}
                    key={item.id}
                  />
                ))
              ) : (
                <p>No featured accommodations available.</p>
              )}
            </div>
            <div className="view-all-container text-center">
              <a href="/accommodation" className="homebtn homebtn-outline">
                View All Stays
              </a>
            </div>
          </div>

          {/* Vehicles */}
          <div className="listing-category">
            <h3 className="listing-category-title">Popular Vehicles</h3>
            <div className="featured-items-grid">
              {featuredVehicles.length > 0 ? (
                featuredVehicles.map((item) => (
                  <FeaturedCard
                    item={{
                      id: item.id,
                      name: item.brand + " " + item.model,
                      type: item.type,
                      image:
                        item.imageUrl ||
                        "https://via.placeholder.com/300x200?text=No+Image",
                      price: `Rs ${item.pricePerDay}/day`,
                      link: `/vehicle/${item.id}`,
                    }}
                    key={item.id}
                  />
                ))
              ) : (
                <p>No popular vehicles available.</p>
              )}
            </div>
            <div className="view-all-container text-center">
              <a href="/vehicle" className="homebtn homebtn-outline">
                View All Rides
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListingsSection;
