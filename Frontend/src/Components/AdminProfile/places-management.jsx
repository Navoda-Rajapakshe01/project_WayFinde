"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";

const PlacesManagement = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(null);

  // Mock districts for filtering
  const districts = [
    "Colombo",
    "Galle",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Badulla",
    "Hambantota",
  ];

  useEffect(() => {
    // Simulate API call to fetch places
    const fetchPlaces = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockPlaces = [
          {
            id: 1,
            name: "Sigiriya",
            district: "Matale",
            category: "Historical",
            rating: 4.8,
            status: "active",
          },
          {
            id: 2,
            name: "Ella Rock",
            district: "Badulla",
            category: "Nature",
            rating: 4.6,
            status: "active",
          },
          {
            id: 3,
            name: "Galle Fort",
            district: "Galle",
            category: "Historical",
            rating: 4.7,
            status: "active",
          },
          {
            id: 4,
            name: "Nine Arch Bridge",
            district: "Badulla",
            category: "Landmark",
            rating: 4.5,
            status: "active",
          },
          {
            id: 5,
            name: "Yala National Park",
            district: "Hambantota",
            category: "Nature",
            rating: 4.4,
            status: "active",
          },
          {
            id: 6,
            name: "Kandy Temple",
            district: "Kandy",
            category: "Religious",
            rating: 4.7,
            status: "active",
          },
          {
            id: 7,
            name: "Mirissa Beach",
            district: "Matara",
            category: "Beach",
            rating: 4.5,
            status: "active",
          },
          {
            id: 8,
            name: "Dambulla Cave Temple",
            district: "Matale",
            category: "Religious",
            rating: 4.6,
            status: "active",
          },
          {
            id: 9,
            name: "Horton Plains",
            district: "Nuwara Eliya",
            category: "Nature",
            rating: 4.5,
            status: "active",
          },
          {
            id: 10,
            name: "Colombo National Museum",
            district: "Colombo",
            category: "Cultural",
            rating: 4.2,
            status: "inactive",
          },
        ];

        setPlaces(mockPlaces);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching places:", error);
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleAddPlace = () => {
    setCurrentPlace(null);
    setShowAddModal(true);
  };

  const handleEditPlace = (place) => {
    setCurrentPlace(place);
    setShowAddModal(true);
  };

  const handleDeletePlace = (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      // In a real app, this would be an API call
      setPlaces(places.filter((place) => place.id !== placeId));
    }
  };

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDistrict =
      selectedDistrict === "all" || place.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

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
        <button className="add-button" onClick={handleAddPlace}>
          <FaPlus /> Add New Place
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search places..."
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
            <option value="all">All Districts</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>District</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map((place) => (
              <tr key={place.id}>
                <td>{place.id}</td>
                <td>{place.name}</td>
                <td>{place.district}</td>
                <td>{place.category}</td>
                <td>
                  <div className="rating">
                    <span className="rating-stars">
                      {"★".repeat(Math.floor(place.rating))}
                      {"☆".repeat(5 - Math.floor(place.rating))}
                    </span>
                    <span className="rating-value">{place.rating}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${place.status}`}>
                    {place.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditPlace(place)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeletePlace(place.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentPlace ? "Edit Place" : "Add New Place"}</h2>
              <button
                className="close-button"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="name">Place Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={currentPlace?.name || ""}
                    placeholder="Enter place name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="district">District</label>
                    <select
                      id="district"
                      defaultValue={currentPlace?.district || ""}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      defaultValue={currentPlace?.category || ""}
                    >
                      <option value="">Select Category</option>
                      <option value="Historical">Historical</option>
                      <option value="Nature">Nature</option>
                      <option value="Beach">Beach</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Religious">Religious</option>
                      <option value="Landmark">Landmark</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    defaultValue={currentPlace?.description || ""}
                    placeholder="Enter place description"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="mainImage">Main Image URL</label>
                    <input
                      type="text"
                      id="mainImage"
                      defaultValue={currentPlace?.mainImageUrl || ""}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      defaultValue={currentPlace?.status || "active"}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="save-button">Save Place</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesManagement;
