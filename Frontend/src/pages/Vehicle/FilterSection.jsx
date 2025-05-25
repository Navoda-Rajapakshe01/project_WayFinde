import React, { useState } from "react";
import { Form, Button, Row, Col, Collapse } from "react-bootstrap";
//import "../../CSS/vehicle.css";

const FilterSection = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    vehicleType: "",
    location: "",
    capacity: "",
    transmission: "",
    fuel: "",
  });

  // Vehicle types
  const vehicleTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Van",
    "Luxury",
    "Minibus",
  ];

  // Locations
  const locations = ["Colombo", "Kandy", "Galle", "Negombo", "Nuwara Eliya"];

  // Capacity options
  const capacityOptions = ["2", "4", "5", "7", "8+"];

  // Transmission options
  const transmissionOptions = ["Automatic", "Manual"];

  // Fuel options
  const fuelOptions = ["Petrol", "Diesel", "Hybrid", "Electric"];

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
      priceRange: [0, 500],
      vehicleType: "",
      location: "",
      capacity: "",
      transmission: "",
      fuel: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <section className="vehicle-filter-section">
      <div className="filter-header" onClick={toggleFilters}>
        <h2 className="vehicle-section-title">Find Your Ride</h2>
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
        <div className="vehicle-filter-grid">
          <input
            type="text"
            placeholder="Search by brand or location"
            className="vehicle-filter-input"
            name="searchTerm"
            value={filters.searchTerm || ""}
            onChange={handleInputChange}
          />

          <select
            className="vehicle-filter-input"
            name="vehicleType"
            value={filters.vehicleType}
            onChange={handleInputChange}>
            <option value="">Vehicle Type</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="fuel"
            value={filters.fuel}
            onChange={handleInputChange}>
            <option value="">Fuel Type</option>
            {fuelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="location"
            value={filters.location}
            onChange={handleInputChange}>
            <option value="">Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="capacity"
            value={filters.capacity}
            onChange={handleInputChange}>
            <option value="">Capacity</option>
            {capacityOptions.map((option) => (
              <option key={option} value={option}>
                {option} seats
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="transmission"
            value={filters.transmission}
            onChange={handleInputChange}>
            <option value="">Transmission</option>
            {transmissionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="price-range-container">
            <label>Price Range:</label>
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

          <button className="vehicle-filter-btn" onClick={handleApplyFilters}>
            Apply Filters
          </button>

          <button className="vehicle-reset-btn" onClick={handleResetFilters}>
            Reset
          </button>
        </div>
      </Collapse>
    </section>
  );
};

export default FilterSection;
