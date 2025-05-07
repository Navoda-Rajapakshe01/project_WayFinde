"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch accommodations
    const fetchAccommodations = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockAccommodations = [
          {
            id: 1,
            name: "Cinnamon Grand Hotel",
            owner: "Cinnamon Hotels & Resorts",
            type: "Hotel",
            location: "Colombo",
            rooms: 501,
            rating: 4.7,
            status: "approved",
            joinDate: "2022-03-15",
          },
          {
            id: 2,
            name: "Ella Eco Lodge",
            owner: "Sarah Johnson",
            type: "Villa",
            location: "Ella",
            rooms: 8,
            rating: 4.9,
            status: "approved",
            joinDate: "2022-05-20",
          },
          {
            id: 3,
            name: "Kandy City Hostel",
            owner: "Michael Fernando",
            type: "Hostel",
            location: "Kandy",
            rooms: 12,
            rating: 4.2,
            status: "approved",
            joinDate: "2022-06-10",
          },
          {
            id: 4,
            name: "Beach Haven Resort",
            owner: "Coastal Properties Ltd",
            type: "Resort",
            location: "Bentota",
            rooms: 75,
            rating: 4.5,
            status: "approved",
            joinDate: "2022-07-05",
          },
          {
            id: 5,
            name: "Sigiriya Homestay",
            owner: "Pradeep Kumara",
            type: "Homestay",
            location: "Sigiriya",
            rooms: 4,
            rating: 4.8,
            status: "approved",
            joinDate: "2022-08-12",
          },
          {
            id: 6,
            name: "Green Valley Apartments",
            owner: "Green Valley Holdings",
            type: "Apartment",
            location: "Nuwara Eliya",
            rooms: 15,
            rating: 4.3,
            status: "pending",
            joinDate: "2023-01-20",
          },
          {
            id: 7,
            name: "Galle Fort Boutique",
            owner: "Heritage Stays Ltd",
            type: "Boutique Hotel",
            location: "Galle",
            rooms: 18,
            rating: 4.6,
            status: "approved",
            joinDate: "2023-02-15",
          },
          {
            id: 8,
            name: "Mirissa Beach Cabanas",
            owner: "Beachside Properties",
            type: "Cabana",
            location: "Mirissa",
            rooms: 10,
            rating: 4.4,
            status: "pending",
            joinDate: "2023-03-10",
          },
        ];

        setAccommodations(mockAccommodations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const handleAddAccommodation = () => {
    setCurrentAccommodation(null);
    setShowAddModal(true);
  };

  const handleEditAccommodation = (accommodation) => {
    setCurrentAccommodation(accommodation);
    setShowAddModal(true);
  };

  const handleDeleteAccommodation = (accommodationId) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      // In a real app, this would be an API call
      setAccommodations(
        accommodations.filter(
          (accommodation) => accommodation.id !== accommodationId
        )
      );
    }
  };

  const handleApproveAccommodation = (accommodationId) => {
    setAccommodations(
      accommodations.map((accommodation) =>
        accommodation.id === accommodationId
          ? { ...accommodation, status: "approved" }
          : accommodation
      )
    );
  };

  const handleRejectAccommodation = (accommodationId) => {
    setAccommodations(
      accommodations.map((accommodation) =>
        accommodation.id === accommodationId
          ? { ...accommodation, status: "rejected" }
          : accommodation
      )
    );
  };

  const filteredAccommodations = accommodations.filter((accommodation) => {
    const matchesSearch =
      accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accommodation.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || accommodation.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || accommodation.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get unique accommodation types for filter
  const accommodationTypes = [
    ...new Set(accommodations.map((accommodation) => accommodation.type)),
  ];

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading accommodations...</p>
      </div>
    );
  }

  return (
    <div className="accommodation-management">
      <div className="section-header">
        <h1 className="page-title">Accommodation Management</h1>
        <button className="add-button" onClick={handleAddAccommodation}>
          <FaPlus /> Add New Accommodation
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              {accommodationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Location</th>
              <th>Rooms</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccommodations.map((accommodation) => (
              <tr key={accommodation.id}>
                <td>{accommodation.id}</td>
                <td>{accommodation.name}</td>
                <td>{accommodation.owner}</td>
                <td>{accommodation.type}</td>
                <td>{accommodation.location}</td>
                <td>{accommodation.rooms}</td>
                <td>
                  <div className="rating">
                    <span className="rating-stars">
                      {"★".repeat(Math.floor(accommodation.rating))}
                      {"☆".repeat(5 - Math.floor(accommodation.rating))}
                    </span>
                    <span className="rating-value">{accommodation.rating}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${accommodation.status}`}>
                    {accommodation.status}
                  </span>
                </td>
                <td>{accommodation.joinDate}</td>
                <td>
                  <div className="action-buttons">
                    {accommodation.status === "pending" && (
                      <>
                        <button
                          className="approve-button"
                          onClick={() =>
                            handleApproveAccommodation(accommodation.id)
                          }
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="reject-button"
                          onClick={() =>
                            handleRejectAccommodation(accommodation.id)
                          }
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      className="edit-button"
                      onClick={() => handleEditAccommodation(accommodation)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteAccommodation(accommodation.id)
                      }
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
              <h2>
                {currentAccommodation
                  ? "Edit Accommodation"
                  : "Add New Accommodation"}
              </h2>
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
                  <label htmlFor="name">Accommodation Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={currentAccommodation?.name || ""}
                    placeholder="Enter accommodation name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="owner">Owner/Company</label>
                  <input
                    type="text"
                    id="owner"
                    defaultValue={currentAccommodation?.owner || ""}
                    placeholder="Enter owner or company name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select
                      id="type"
                      defaultValue={currentAccommodation?.type || ""}
                    >
                      <option value="">Select Type</option>
                      {accommodationTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      defaultValue={currentAccommodation?.location || ""}
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="rooms">Number of Rooms</label>
                    <input
                      type="number"
                      id="rooms"
                      defaultValue={currentAccommodation?.rooms || ""}
                      placeholder="Enter number of rooms"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      defaultValue={currentAccommodation?.status || "pending"}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    defaultValue={currentAccommodation?.description || ""}
                    placeholder="Enter accommodation description"
                  ></textarea>
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
              <button className="save-button">Save Accommodation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationManagement;
