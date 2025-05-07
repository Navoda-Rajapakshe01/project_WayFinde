"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaImage,
} from "react-icons/fa";
import "./places-management.css"; // New CSS file for this component
import "../../App.css"; // Assuming this holds global styles and CSS variables

const PlacesManagement = () => {
  const [places, setPlaces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch districts first or in parallel
        await fetchDistricts();
        await fetchPlaces();
      } catch (error) {
        console.error("Error loading initial data:", error);
        // Potentially set an error state here to show to the user
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get("http://localhost:5030/api/district");
      setDistricts(response.data);
    } catch (err) {
      console.error("Error fetching districts:", err);
      // Optionally, set an error message for districts
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:5030/api/places");
      setPlaces(response.data);
    } catch (err) {
      console.error("Error fetching places:", err);
      // Optionally, set an error message for places
    }
  };

  const deletePlace = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to undo this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5030/api/places/${id}`);
        setPlaces((prev) => prev.filter((place) => place.id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "The place has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error!", "Failed to delete the place.", "error");
      }
    }
  };

  const filteredPlaces = places
    .filter((p) =>
      selectedDistrict ? p.districtId === parseInt(selectedDistrict) : true
    )
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading places...</p>
      </div>
    );
  }

  return (
    <div className="places-management">
      <div className="section-header">
        <h1 className="page-title">Places Management</h1>
        <button
          className="add-button"
          onClick={() => navigate("/admin/place/add")}
        >
          <FaPlus /> Add New Place
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search places by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <FaFilter className="filter-icon" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPlaces.length === 0 ? (
        <div className="no-data-message">
          <p>No places found matching your criteria.</p>
        </div>
      ) : (
        <div className="places-grid">
          {filteredPlaces.map((place) => {
            const districtName =
              districts.find((d) => d.id === place.districtId)?.name || "N/A";
            return (
              <div key={place.id} className="place-card-item">
                <div className="place-card-content">
                  <h3 className="place-card-name">{place.name}</h3>
                  <p className="place-card-district">
                    District: {districtName}
                  </p>
                </div>
                <div className="place-card-actions action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/admin/place/${place.id}/edit`)}
                    title="Edit Place"
                  >
                    <FaEdit /> <span>Edit</span>
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deletePlace(place.id)}
                    title="Delete Place"
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlacesManagement;
