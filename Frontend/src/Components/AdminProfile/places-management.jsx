"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import "../AdminProfile/edit-place";
import "./places-management.css";
import "../../App.css";

const PlacesManagement = () => {
  const [places, setPlaces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceDescription, setNewPlaceDescription] = useState("");
  const [newPlaceHistory, setNewPlaceHistory] = useState("");
  const [newPlaceMainImageUrl, setNewPlaceMainImageUrl] = useState("");
  const [newPlaceOpeningHours, setNewPlaceOpeningHours] = useState("");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");
  const [newPlaceGoogleMapLink, setNewPlaceGoogleMapLink] = useState("");
  const [newPlaceCategoryId, setNewPlaceCategoryId] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchDistricts();
        await fetchCategories();
        await fetchPlaces();
      } catch (error) {
        console.error("Error loading initial data:", error);
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
      Swal.fire("Error", "Failed to load districts.", "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5030/api/places/categories"
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      Swal.fire("Error", "Failed to load categories.", "error");
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:5030/api/places");
      setPlaces(response.data);
    } catch (err) {
      console.error("Error fetching places:", err);
      Swal.fire("Error", "Failed to load places.", "error");
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
        Swal.fire("Error", "Failed to delete the place.", "error");
      }
    }
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();

    // Reset form errors before validation
    setFormErrors({});

    let errors = {};

    // Validate form fields
    if (!newPlaceName) errors.name = "Name is required.";
    if (!newPlaceMainImageUrl)
      errors.mainImageUrl = "Main Image URL is required.";
    if (!newPlaceDescription) errors.description = "Description is required.";
    if (!newPlaceCategoryId) errors.categoryId = "Category is required.";

    // Check if any errors exist
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Check for duplicate places (e.g., same name)
    const isDuplicate = places.some(
      (place) => place.name.toLowerCase() === newPlaceName.toLowerCase()
    );

    if (isDuplicate) {
      Swal.fire(
        "Duplicate",
        "A place with this name already exists.",
        "warning"
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:5030/api/places", {
        name: newPlaceName,
        description: newPlaceDescription,
        history: newPlaceHistory,
        mainImageUrl: newPlaceMainImageUrl,
        openingHours: newPlaceOpeningHours,
        address: newPlaceAddress,
        googleMapLink: newPlaceGoogleMapLink,
        categoryId: newPlaceCategoryId,
        districtId: selectedDistrict,
      });

      setPlaces([...places, response.data]);
      setShowModal(false);
      clearForm();
      Swal.fire("Success", "Place added successfully!", "success");
    } catch (error) {
      console.error("Error adding place:", error);
      Swal.fire(
        "Error",
        "Failed to add place. Please try again later.",
        "error"
      );
    }
  };

  const clearForm = () => {
    setNewPlaceName("");
    setNewPlaceDescription("");
    setNewPlaceHistory("");
    setNewPlaceMainImageUrl("");
    setNewPlaceOpeningHours("");
    setNewPlaceAddress("");
    setNewPlaceGoogleMapLink("");
    setNewPlaceCategoryId("");
    setSelectedDistrict("");
    setFormErrors({});
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
    <div className="pm-container">
      <div className="pm-header">
        <h1 className="pm-title">Places Management</h1>
        <button className="pm-add-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add New Place
        </button>
      </div>

      <div className="pm-filter-bar">
        <div className="pm-search-box">
          <FaSearch className="pm-icon" />
          <input
            type="text"
            placeholder="Search places by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="pm-filter-select">
          <FaFilter className="pm-icon" />
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
        <div className="pm-no-results">
          <p>No places found matching your criteria.</p>
        </div>
      ) : (
        <div className="pm-grid">
          {filteredPlaces.map((place) => {
            const districtName =
              districts.find((d) => d.id === place.districtId)?.name || "N/A";
            return (
              <div key={place.id} className="pm-card">
                <div className="pm-card-content">
                  <h3 className="pm-place-name">{place.name}</h3>
                  <p className="pm-place-district">District: {districtName}</p>
                </div>
                <div className="pm-actions">
                  <button
                    className="pm-edit-btn"
                    onClick={() => navigate(`/admin/edit-place/${place.id}`)}
                  >
                    <FaEdit /> <span>Edit</span>
                  </button>
                  <button
                    className="pm-delete-btn"
                    onClick={() => deletePlace(place.id)}
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="pm-modal-overlay">
          <div className="pm-modal">
            <h2 className="pm-modal-title">Add New Place</h2>

            <form onSubmit={handleAddPlace} className="pm-form">
              <div className="pm-form-group">
                <select
                  className="pm-form-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <label>
                  Name: <span className="pm-required">*</span>
                  <input
                    type="text"
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                  />
                  {formErrors.name && (
                    <p className="pm-error">{formErrors.name}</p>
                  )}
                </label>

                <label>
                  Description: <span className="pm-required">*</span>
                  <textarea
                    value={newPlaceDescription}
                    onChange={(e) => setNewPlaceDescription(e.target.value)}
                  />
                  {formErrors.description && (
                    <p className="pm-error">{formErrors.description}</p>
                  )}
                </label>

                <label>
                  History:
                  <textarea
                    value={newPlaceHistory}
                    onChange={(e) => setNewPlaceHistory(e.target.value)}
                  />
                </label>

                <label>
                  Main Image URL: <span className="pm-required">*</span>
                  <input
                    type="text"
                    value={newPlaceMainImageUrl}
                    onChange={(e) => setNewPlaceMainImageUrl(e.target.value)}
                  />
                  {formErrors.mainImageUrl && (
                    <p className="pm-error">{formErrors.mainImageUrl}</p>
                  )}
                </label>

                <label>
                  Opening Hours:
                  <input
                    type="text"
                    value={newPlaceOpeningHours}
                    onChange={(e) => setNewPlaceOpeningHours(e.target.value)}
                  />
                </label>

                <label>
                  Address:
                  <input
                    type="text"
                    value={newPlaceAddress}
                    onChange={(e) => setNewPlaceAddress(e.target.value)}
                  />
                </label>

                <label>
                  Google Map Link:
                  <input
                    type="text"
                    value={newPlaceGoogleMapLink}
                    onChange={(e) => setNewPlaceGoogleMapLink(e.target.value)}
                  />
                </label>

                <label>
                  Category: <span className="pm-required">*</span>
                  <select
                    value={newPlaceCategoryId}
                    onChange={(e) => setNewPlaceCategoryId(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <p className="pm-error">{formErrors.categoryId}</p>
                  )}
                </label>

                <div className="pm-modal-actions">
                  <button type="submit" className="pm-save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="pm-cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesManagement;
