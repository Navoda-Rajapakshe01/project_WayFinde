import React, { useState, useEffect } from "react";
import { Button, Collapse } from "react-bootstrap";
import "../CSS/Accommodation.css";

const AccommodationFilter = ({ onFilterChange, maxPrice }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, maxPrice || 1000000],
    accommodationType: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, maxPrice || 1000000],
    }));
  }, [maxPrice]);

  const accommodationTypes = [
    "Hotel",
    "Apartment",
    "Villa",
    "Cottage",
    "Homestay",
    "Cabin",
    "Bungalow",
    "Resort",
  ];

  const locations = [
    "Colombo",
    "Kandy",
    "Galle",
    "Nuwara Eliya",
    "Ella",
    "Bentota",
    "Mirissa",
    "Negombo",
  ];

  const toggleFilters = () => setIsOpen((open) => !open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newRange = [...prev.priceRange];
      if (name === "minPrice") {
        newRange[0] = 0; // fixed min price
      } else if (name === "maxPrice") {
        const maxVal = Math.min(
          maxPrice || 1000000,
          Math.max(Number(value), newRange[0])
        );
        newRange[1] = maxVal;
      }
      return {
        ...prev,
        priceRange: newRange,
      };
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: [0, maxPrice || 1000000],
      accommodationType: "",
      location: "",
      guests: "",
      bedrooms: "",
      bathrooms: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <section className="accommodation-filter-section">
      <div className="filter-header" onClick={toggleFilters}>
        <h2 className="accommodation-section-title">Find Your Perfect Stay</h2>
        <Button
          variant="link"
          className="toggle-filter-btn"
          aria-expanded={isOpen}
          aria-controls="accommodation-filters"
          type="button">
          <i
            className={`bi ${
              isOpen ? "bi-chevron-up" : "bi-chevron-down"
            }`}></i>
        </Button>
      </div>

      <Collapse in={isOpen}>
        <div id="accommodation-filters" className="accommodation-filter-grid">
          <div className="filter-group">
            <label htmlFor="location-select">Location</label>
            <select
              id="location-select"
              className="accommodation-filter-input"
              name="location"
              value={filters.location}
              onChange={handleInputChange}>
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-select">Accommodation Type</label>
            <select
              id="type-select"
              className="accommodation-filter-input"
              name="accommodationType"
              value={filters.accommodationType}
              onChange={handleInputChange}>
              <option value="">All Types</option>
              {accommodationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="guests-select">Guests</label>
            <select
              id="guests-select"
              className="accommodation-filter-input"
              name="guests"
              value={filters.guests}
              onChange={handleInputChange}>
              <option value="">Any</option>
              <option value="1">1+ guest</option>
              <option value="2">2+ guests</option>
              <option value="4">4+ guests</option>
              <option value="6">6+ guests</option>
              <option value="8">8+ guests</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="bedrooms-select">Bedrooms</label>
            <select
              id="bedrooms-select"
              className="accommodation-filter-input"
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleInputChange}>
              <option value="">Any</option>
              <option value="1">1+ bedroom</option>
              <option value="2">2+ bedrooms</option>
              <option value="3">3+ bedrooms</option>
              <option value="4">4+ bedrooms</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="bathrooms-select">Bathrooms</label>
            <select
              id="bathrooms-select"
              className="accommodation-filter-input"
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleInputChange}>
              <option value="">Any</option>
              <option value="1">1+ bathroom</option>
              <option value="2">2+ bathrooms</option>
              <option value="3">3+ bathrooms</option>
            </select>
          </div>

          <div className="filter-group price-range">
            <label>Price Range (Rs per night)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="price-input"
                name="minPrice"
                min={0}
                max={filters.priceRange[1]}
                value={0}
                readOnly
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="price-input"
                name="maxPrice"
                min={0}
                max={maxPrice || 1000000}
                value={filters.priceRange[1]}
                onChange={handlePriceRangeChange}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              className="reset-btn"
              onClick={handleResetFilters}>
              Reset
            </button>
            <button
              type="button"
              className="apply-btn"
              onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </Collapse>
    </section>
  );
};

export default AccommodationFilter;
