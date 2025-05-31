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
            <FaFilter className="adminfilter-icon" />
            <select>
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
        </table>
      </div>

    </div>
  );
};

export default AccommodationManagement;
