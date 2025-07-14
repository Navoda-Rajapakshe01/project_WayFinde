import React, { useState, useEffect } from "react";
import { Form, Button, Collapse } from "react-bootstrap";
import "../CSS/Accommodation.css";

const AccommodationFilter = ({ onFilterChange, maxPrice }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [filters, setFilters] = React.useState({
    priceRange: [0, maxPrice || 1000000],
    accommodationType: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
  });

  React.useEffect(() => {
    // Whenever maxPrice changes, update filters.priceRange max
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

  const toggleFilters = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    let newRange = [...filters.priceRange];

    if (name === "minPrice") {
      // minPrice is fixed at 0, ignore changes
      newRange[0] = 0;
    } else if (name === "maxPrice") {
      const maxVal = Math.min(
        maxPrice || 1000000,
        Math.max(Number(value), newRange[0])
      );
      newRange[1] = maxVal;
    }

    setFilters({
      ...filters,
      priceRange: newRange,
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
          aria-expanded={isOpen}>
          <i
            className={`bi ${
              isOpen ? "bi-chevron-up" : "bi-chevron-down"
            }`}></i>
        </Button>
      </div>

      <Collapse in={isOpen}>
        <div className="accommodation-filter-grid">
          <div className="filter-group">
            <label>Location</label>
            <select
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
            <label>Accommodation Type</label>
            <select
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
            <label>Guests</label>
            <select
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
            <label>Bedrooms</label>
            <select
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
            <label>Bathrooms</label>
            <select
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
                value={0} // fixed minPrice
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
            <button className="reset-btn" onClick={handleResetFilters}>
              Reset
            </button>
            <button className="apply-btn" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </Collapse>
    </section>
  );
};

export default AccommodationFilter;
