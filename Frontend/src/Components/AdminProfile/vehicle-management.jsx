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
import axios from "axios";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5030/api/vehicle");
        console.log('API /vehicle response:', res.data);
        setVehicles(Array.isArray(res.data?.$values) ? res.data.$values : []);
      } catch (err) {
        setError("Failed to load vehicles");
        setVehicles([]); // Always set to array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Filtered vehicles
  const filtered = Array.isArray(vehicles) ? vehicles.filter((v) => {
    return (
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) : [];
  console.log('Filtered vehicles:', filtered);

  return (
    <div className="vehicle-management">
      <div className="adminsection-header">
        <h1 className="page-title">Vehicle Management</h1>
      </div>
      <div className="adminfilter-bar">
        <div className="adminsearch-box">
          <FaSearch className="adminsearch-icon" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="section-loading">
          <div className="loading-spinner"></div>
          <p>Loading vehicles...</p>
        </div>
      ) : error ? (
        <div className="section-error">{error}</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>#</th>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No vehicles found.
                  </td>
                </tr>
              ) : (
                filtered.map((v, idx) => (
                  <tr key={v.id}>
                    <td>{idx + 1}</td>
                    <td>{v.brand} {v.model}</td>
                    <td>{v.supplierUsername || "N/A"}</td>
                    <td>{v.type}</td>
                    <td>{v.location}</td>
                    <td>{v.numberOfPassengers}</td>
                    <td>{v.pricePerDay}</td>
                    <td>{v.isAvailable ? "Available" : "Unavailable"}</td>
                    <td>N/A</td>
                    <td>
                      <div className="adminaction-buttons">
                        <button className="adminedit-button" title="Edit">
                          <FaEdit />
                        </button>
                        <button className="admindelete-button" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
