"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSearch,
  FaUserShield,
  FaUser,
  FaEye,
  FaTrash,
  FaBuilding,
  FaTruck
} from "react-icons/fa";

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dateJoined");
  const [sortOrder, setSortOrder] = useState("desc");
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  // Get unique roles from the data
  const getUniqueRoles = (usersData) => {
    const roles = [...new Set(usersData.map(user => user.role))].filter(role => role);
    return roles;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch real users from the database
      const response = await axios.get("http://localhost:5030/api/profile/admin/users");
      
      // Transform the data to match our frontend format
      const users = response.data.map(user => ({
        id: user.id,
        fullName: user.fullName || "N/A",
        email: user.email || "N/A",
        role: user.role || "NormalUser",
        status: user.status || "active",
        dateJoined: user.dateJoined ? new Date(user.dateJoined) : null,
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
        profilePicture: user.profilePicture,
        phone: user.phone,
        bio: user.bio,
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0
      }));
      
      
      // Extract available roles from the data
      const roles = getUniqueRoles(users);
      setAvailableRoles(roles);
      
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setAvailableRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Remove admin users
    filtered = filtered.filter(user => user.role !== "Admin");

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id?.toString().includes(searchTerm)
      );
    }

    // Role filter - use exact matching with database values
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => {
        const matches = user.role === roleFilter;
        return matches;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "dateJoined":
          aValue = a.dateJoined || new Date(0);
          bValue = b.dateJoined || new Date(0);
          break;
        case "lastLogin":
          aValue = a.lastLogin || new Date(0);
          bValue = b.lastLogin || new Date(0);
          break;
        case "fullName":
          aValue = a.fullName || "";
          bValue = b.fullName || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        default:
          aValue = a[sortBy] || "";
          bValue = b[sortBy] || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <FaUserShield className="role-icon admin" />;
      case "AccommodationProvider":
        return <FaBuilding className="role-icon accommodation" />;
      case "TransportProvider":
        return <FaTruck className="role-icon vehicle" />;
      case "NormalUser":
        return <FaUser className="role-icon user" />;
      default:
        return <FaUser className="role-icon user" />;
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "AccommodationProvider":
        return "Accommodation Provider";
      case "TransportProvider":
        return "Transport Provider";
      case "NormalUser":
        return "Normal User";
      default:
        return role;
    }
  };

  const getStatusBadge = (status, lastLogin) => {
    // Determine if user is active based on last login (within 3 months)
    let isActive = true;
    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      isActive = lastLoginDate > threeMonthsAgo;
    } else {
      // If no last login, consider inactive
      isActive = false;
    }

    const statusClass = isActive ? 'active' : 'inactive';
    const statusText = isActive ? 'Active' : 'Inactive';

    return (
      <span className={`status-badge ${statusClass}`}>
        {statusText}
      </span>
    );
  };

  const handleViewUser = (user) => {
    navigate(`/admin/user-profile/${user.id}`);
  };

  const handleDeleteUser = (user) => {
    // TODO: Implement delete confirmation modal
  };

  if (loading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="adminsection-header">
        <h1 className="page-title">Users Management</h1>
      </div>

      {/* Search and Filter Section */}
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

        <div className="adminfilter-dropdown-group">
          <div className="adminfilter-dropdown">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              {availableRoles
                .filter(role => role !== "Admin")
                .map(role => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>
                # 
              </th>
              <th>
                Full Name 
              </th>
              <th>
                Email 
              </th>
              <th>Role</th>
              <th>Status</th>
              <th >
                Date Joined 
              </th>
              <th >
                Last Login 
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="user-number">{index + 1}</td>
                <td>
                  <div className="user-info">
                    <div className="user-details">
                      <div className="user-name">{user.fullName || "N/A"}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="user-email">{user.email}</div>
                </td>
                <td>
                  <div className="role-icon-container" title={getRoleDisplayName(user.role)}>
                    {getRoleIcon(user.role)}
                  </div>
                </td>
                <td>{getStatusBadge(user.status, user.lastLogin)}</td>
                <td>
                  <div className="user-date">
                    {user.dateJoined 
                      ? new Date(user.dateJoined).toLocaleDateString()
                      : "N/A"}
                  </div>
                </td>
                <td>
                  <div className="user-date">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </div>
                </td>
                <td>
                  <div className="adminaction-buttons">
                    <button
                      className="adminedit-button"
                      onClick={() => handleViewUser(user)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="admindelete-button"
                      onClick={() => handleDeleteUser(user)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-users-message">
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserManagement; 