import React, { useState } from "react";
import { Button, Collapse } from "react-bootstrap";

const FilterSection = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    type: "",
    location: "",
    NumberOfPassengers: "",
    transmissionType: "",
    FuelType: "",
    searchTerm: "",
  });

  // Vehicle types
  const vehicleTypes = [
    "Motorcycle",
    "TukTuk",
    "Hatchback",
    "Sedan",
    "SUV",
    "Van",
    "Commuter",
  ];

  // Locations
  const locations = ["Colombo", "Kandy", "Galle", "Negombo", "Nuwara Eliya"];

  // Passenger options
  const NumberOfPassengers = ["2", "4", "5", "7", "8+"];

  // Transmission options
  const transmissionOptions = ["Automatic", "Manual", "Triptonic"];

  // Fuel options
  const FuelType = ["Petrol", "Diesel", "Hybrid", "Electric"];

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    let newRange = [...filters.priceRange];
    if (name === "minPrice") {
      newRange[0] = value ? parseInt(value, 10) : 0;
    } else {
      newRange[1] = value ? parseInt(value, 10) : 50000;
    }
    setFilters((prev) => ({
      ...prev,
      priceRange: newRange,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      priceRange: [0, 50000],
      type: "",
      location: "",
      NumberOfPassengers: "",
      transmissionType: "",
      FuelType: "",
      searchTerm: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <section className="vehicle-filter-section">
      <div
        className="filter-header"
        onClick={toggleFilters}
        style={{ cursor: "pointer" }}>
        <h2 className="vehicle-section-title">Find Your Ride</h2>
        <Button
          variant="link"
          className="toggle-filter-btn"
          aria-expanded={isOpen}
          onClick={(e) => {
            e.stopPropagation();
            toggleFilters();
          }}>
          <i
            className={`bi ${
              isOpen ? "bi-chevron-up" : "bi-chevron-down"
            }`}></i>
        </Button>
      </div>

      <Collapse in={isOpen}>
        <div className="vehicle-filter-grid" style={{ marginTop: "1rem" }}>
          <input
            type="text"
            placeholder="Search by brand, model or location"
            className="vehicle-filter-input"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleInputChange}
          />

          <select
            className="vehicle-filter-input"
            name="type"
            value={filters.type}
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
            name="FuelType"
            value={filters.FuelType}
            onChange={handleInputChange}>
            <option value="">Fuel Type</option>
            {FuelType.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="location"
            value={filters.location}
            onChange={handleInputChange}>
            <option value="">Location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="NumberOfPassengers"
            value={filters.NumberOfPassengers}
            onChange={handleInputChange}>
            <option value="">Capacity</option>
            {NumberOfPassengers.map((cap) => (
              <option key={cap} value={cap}>
                {cap} {cap === "8+" ? "or more" : "seats"}
              </option>
            ))}
          </select>

          <select
            className="vehicle-filter-input"
            name="transmissionType"
            value={filters.transmissionType}
            onChange={handleInputChange}>
            <option value="">Transmission</option>
            {transmissionOptions.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>

          <div className="price-range-container">
            <label>Price Range (Rs per day)</label>
            <div className="price-inputs">
              <input
                type="number"
                className="price-input"
                name="minPrice"
                min="0"
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={handlePriceRangeChange}
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                className="price-input"
                name="maxPrice"
                min={filters.priceRange[0]}
                value={filters.priceRange[1]}
                onChange={handlePriceRangeChange}
                placeholder="Max"
              />
            </div>
          </div>

          <button
            className="vehicle-reset-btn"
            onClick={handleResetFilters}
            type="button">
            Reset
          </button>
          <button
            className="vehicle-filter-btn"
            onClick={handleApplyFilters}
            type="button">
            Apply Filters
          </button>
        </div>
      </Collapse>
    </section>
  );
};

export default FilterSection;
