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

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch vehicles
    const fetchVehicles = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockVehicles = [
          {
            id: 1,
            name: "Toyota Prius",
            owner: "Lanka Car Rentals",
            type: "Car",
            location: "Colombo",
            capacity: 4,
            pricePerDay: 45,
            status: "approved",
            joinDate: "2022-04-10",
          },
          {
            id: 2,
            name: "Honda Activa",
            owner: "City Scooters",
            type: "Scooter",
            location: "Colombo",
            capacity: 2,
            pricePerDay: 15,
            status: "approved",
            joinDate: "2022-05-15",
          },
          {
            id: 3,
            name: "Toyota HiAce",
            owner: "Island Tours",
            type: "Van",
            location: "Negombo",
            capacity: 12,
            pricePerDay: 80,
            status: "approved",
            joinDate: "2022-06-20",
          },
          {
            id: 4,
            name: "Mahindra Thar",
            owner: "Adventure Wheels",
            type: "Jeep",
            location: "Kandy",
            capacity: 4,
            pricePerDay: 60,
            status: "approved",
            joinDate: "2022-07-12",
          },
          {
            id: 5,
            name: "Bajaj Pulsar",
            owner: "Bike Rentals Lanka",
            type: "Motorcycle",
            location: "Galle",
            capacity: 2,
            pricePerDay: 20,
            status: "pending",
            joinDate: "2022-08-05",
          },
          {
            id: 6,
            name: "Nissan Urvan",
            owner: "Family Travels",
            type: "Van",
            location: "Colombo",
            capacity: 15,
            pricePerDay: 90,
            status: "approved",
            joinDate: "2022-09-18",
          },
          {
            id: 7,
            name: "Suzuki Alto",
            owner: "Budget Cars",
            type: "Car",
            location: "Negombo",
            capacity: 4,
            pricePerDay: 30,
            status: "pending",
            joinDate: "2022-10-22",
          },
          {
            id: 8,
            name: "Mitsubishi Montero",
            owner: "Luxury Rides",
            type: "SUV",
            location: "Colombo",
            capacity: 7,
            pricePerDay: 100,
            status: "approved",
            joinDate: "2022-11-15",
          },
        ];

        setVehicles(mockVehicles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleAddVehicle = () => {
    setCurrentVehicle(null);
    setShowAddModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setCurrentVehicle(vehicle);
    setShowAddModal(true);
  };

  const handleDeleteVehicle = (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      // In a real app, this would be an API call
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
    }
  };

  const handleApproveVehicle = (vehicleId) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, status: "approved" } : vehicle
      )
    );
  };

  const handleRejectVehicle = (vehicleId) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, status: "rejected" } : vehicle
      )
    );
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || vehicle.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || vehicle.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get unique vehicle types for filter
  const vehicleTypes = [...new Set(vehicles.map((vehicle) => vehicle.type))];

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading vehicles...</p>
      </div>
    );
  }

  return (
    <div className="vehicle-management">
      <div className="adminsection-header">
        <h1 className="page-title">Vehicle Management</h1>
        <button className="add-button" onClick={handleAddVehicle}>
          <FaPlus /> Add New Vehicle
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search vehicles..."
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
              {vehicleTypes.map((type) => (
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
              <th>Capacity</th>
              <th>Price/Day</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.owner}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.location}</td>
                <td>{vehicle.capacity}</td>
                <td>${vehicle.pricePerDay}</td>
                <td>
                  <span className={`status-badge ${vehicle.status}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.joinDate}</td>
                <td>
                  <div className="action-buttons">
                    {vehicle.status === "pending" && (
                      <>
                        <button
                          className="approve-button"
                          onClick={() => handleApproveVehicle(vehicle.id)}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => handleRejectVehicle(vehicle.id)}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      className="edit-button"
                      onClick={() => handleEditVehicle(vehicle)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
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
              <h2>{currentVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h2>
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
                  <label htmlFor="name">Vehicle Name/Model</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={currentVehicle?.name || ""}
                    placeholder="Enter vehicle name or model"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="owner">Owner/Company</label>
                  <input
                    type="text"
                    id="owner"
                    defaultValue={currentVehicle?.owner || ""}
                    placeholder="Enter owner or company name"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select id="type" defaultValue={currentVehicle?.type || ""}>
                      <option value="">Select Type</option>
                      {vehicleTypes.map((type) => (
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
                      defaultValue={currentVehicle?.location || ""}
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="capacity">Capacity</label>
                    <input
                      type="number"
                      id="capacity"
                      defaultValue={currentVehicle?.capacity || ""}
                      placeholder="Enter capacity"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pricePerDay">Price Per Day ($)</label>
                    <input
                      type="number"
                      id="pricePerDay"
                      defaultValue={currentVehicle?.pricePerDay || ""}
                      placeholder="Enter price per day"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      defaultValue={currentVehicle?.status || "pending"}
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
                    defaultValue={currentVehicle?.description || ""}
                    placeholder="Enter vehicle description"
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
              <button className="save-button">Save Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
