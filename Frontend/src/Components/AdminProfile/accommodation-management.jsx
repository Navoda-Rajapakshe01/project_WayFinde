"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";

const AccommodationManagement = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:5030/api/accommodation");
        setAccommodations(res.data);
      } catch (err) {
        setError("Failed to load accommodations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Filtered accommodations
  const filtered = accommodations.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "approved" && a.isAvailable) ||
      (selectedStatus === "pending" && !a.isAvailable) ||
      (selectedStatus === "rejected" && false); // No rejected logic yet
    return matchesSearch && matchesStatus;
  });

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
        <div className="adminfilters">
          <div className="adminfilter-dropdown">
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
                <th>Rating</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No accommodations found.
                  </td>
                </tr>
              ) : (
                filtered.map((a, idx) => (
                  <tr key={a.id}>
                    <td>{idx + 1}</td>
                    <td>{a.name}</td>
                    <td>N/A</td>
                    <td>{a.type}</td>
                    <td>{a.location}</td>
                    <td>{a.bedrooms}</td>
                    <td>N/A</td>
                    <td>
                      {a.isAvailable ? (
                        <span className="status-badge approved">Approved</span>
                      ) : (
                        <span className="status-badge pending">Pending</span>
                      )}
                    </td>
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

export default AccommodationManagement;
