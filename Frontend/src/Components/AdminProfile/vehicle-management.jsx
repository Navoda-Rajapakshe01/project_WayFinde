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
  const [searchTerm, setSearchTerm] = useState("");
 

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

      <div className="admin-table-container">
        <table className="admin-data-table">
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
        </table>
      </div>
    </div>
  );
};

export default VehicleManagement;
