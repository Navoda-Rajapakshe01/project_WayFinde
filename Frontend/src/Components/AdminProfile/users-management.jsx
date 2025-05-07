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
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockUsers = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
            status: "active",
            lastLogin: "2023-06-15",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            status: "active",
            lastLogin: "2023-06-14",
          },
          {
            id: 3,
            name: "Robert Johnson",
            email: "robert@example.com",
            role: "user",
            status: "active",
            lastLogin: "2023-06-10",
          },
          {
            id: 4,
            name: "Emily Davis",
            email: "emily@example.com",
            role: "editor",
            status: "active",
            lastLogin: "2023-06-12",
          },
          {
            id: 5,
            name: "Michael Wilson",
            email: "michael@example.com",
            role: "user",
            status: "inactive",
            lastLogin: "2023-05-30",
          },
          {
            id: 6,
            name: "Sarah Brown",
            email: "sarah@example.com",
            role: "user",
            status: "active",
            lastLogin: "2023-06-13",
          },
          {
            id: 7,
            name: "David Miller",
            email: "david@example.com",
            role: "editor",
            status: "active",
            lastLogin: "2023-06-11",
          },
          {
            id: 8,
            name: "Lisa Taylor",
            email: "lisa@example.com",
            role: "user",
            status: "inactive",
            lastLogin: "2023-05-25",
          },
        ];

        setUsers(mockUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // In a real app, this would be an API call
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-management">
      <div className="adminsection-header">
        <h1 className="page-title">Users Management</h1>
        <button className="add-button" onClick={handleAddUser}>
          <FaUserPlus /> Add New User
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <FaFilter className="filter-icon" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
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
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditUser(user)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
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
              <h2>{currentUser ? "Edit User" : "Add New User"}</h2>
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
                className="cancel-button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="save-button">Save User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
