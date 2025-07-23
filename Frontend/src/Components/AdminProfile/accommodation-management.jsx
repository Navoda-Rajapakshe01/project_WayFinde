"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEye,
} from "react-icons/fa";
import axios from "axios";

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5030/api/accommodation");
        console.log('API /accommodation response:', res.data);
        setAccommodations(Array.isArray(res.data?.$values) ? res.data.$values : []);
      } catch (err) {
        setError("Failed to load accommodations");
        setAccommodations([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Filtered accommodations
  const filtered = Array.isArray(accommodations) ? accommodations.filter((a) => {
    return a.name.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];
  console.log('Filtered accommodations:', filtered);

  return (
    <div className="accommodation-management">
      <div className="adminsection-header">
        <h1 className="page-title">Accommodation Management</h1>
      </div>
      <div className="adminfilter-bar">
        <div className="adminsearch-box">
          <FaSearch className="adminsearch-icon" />
          <input
            type="text"
            placeholder="Search accommodations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Removed status filter dropdown */}
      </div>
      {isLoading ? (
        <div className="section-loading">
          <div className="loading-spinner"></div>
          <p>Loading accommodations...</p>
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
                <th>Rooms</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No accommodations found.
                  </td>
                </tr>
              ) : (
                filtered.map((a, idx) => (
                  <tr key={a.id}>
                    <td>{idx + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.supplierUsername || a.SupplierUsername || "N/A"}</td>
                    <td>{a.type}</td>
                    <td>{a.location}</td>
                    <td>{a.bedrooms}</td>
                    <td>
                      <div className="adminaction-buttons">
                        <button className="adminedit-button" title="View">
                          <FaEye />
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

export default AccommodationManagement;
