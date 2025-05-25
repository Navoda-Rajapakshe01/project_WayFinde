import React, { useState } from "react";
import { Form, Button, Row, Col, Collapse } from "react-bootstrap";
//import "../CSS/AccommodationFilter.css";

const AccommodationFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    accommodationType: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
  });

  // Accommodation types
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

  // Locations
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

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const newRange = [...filters.priceRange];
    if (name === "minPrice") {
      newRange[0] = parseInt(value);
    } else {
      newRange[1] = parseInt(value);
    }
    setFilters({
      ...filters,
      priceRange: newRange,
    });
  };

  const handleApplyFilters = () => {
    // Pass the filters up to the parent component
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: [0, 1000],
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
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
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
            <label>Price Range ($ per night)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                className="price-input"
                name="minPrice"
                min="0"
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={handlePriceRangeChange}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                className="price-input"
                name="maxPrice"
                min={filters.priceRange[0]}
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
