"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaUserPlus,
} from "react-icons/fa";

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  return (
    <div className="users-management">
      <div className="adminsection-header">
        <h1 className="page-title">Users Management</h1>
      </div>

      <div className="adminfilter-bar">
        <div className="adminsearch-box">
          <FaSearch className="adminsearch-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
         
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentUser ? "Edit User" : "Add New User"}</h2>
              <button
                className="adminclose-button"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form className="form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    defaultValue={currentUser?.name || ""}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={currentUser?.email || ""}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      defaultValue={currentUser?.role || "user"}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      defaultValue={currentUser?.status || "active"}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {!currentUser && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                className="admincancel-button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="adminsave-button">Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
