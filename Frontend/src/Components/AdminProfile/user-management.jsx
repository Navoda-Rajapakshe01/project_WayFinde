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
  FaTruck,
  FaBell
} from "react-icons/fa";
import "./user-management.css";
import "../../pages/OptimizedRoute/Components/AddPlaceModal.css";

const DeclineRequestModal = ({ open, onClose, onConfirm, loading }) => {
  const DECLINE_REASONS = [
    'User has ongoing trips with bookings',
    'User has pending payments',
    'User account under review',
    'Other (please specify)'
  ];
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
      setCustomReason("");
      setError("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
    if (reason === 'Other (please specify)' && !customReason.trim()) {
      setError("Please enter a custom reason.");
      return;
    }
    setError("");
    onConfirm(reason === 'Other (please specify)' ? customReason.trim() : reason);
  };

  if (!open) return null;
  return (
    <div className="modal-overlay-adp" style={{ zIndex: 1000 }}>
      <div className="add-place-modal-adp" style={{ maxWidth: 400, padding: 0 }}>
        <div className="modal-header-adp">
          <h2 className="modal-title-adp" style={{ fontSize: 20 }}>Decline Account Deletion Request</h2>
          <button className="modal-close-adp" onClick={onClose}>X</button>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>Reason</label>
          <select
            className="decline-modal-select"
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            <option value="">Select a reason</option>
            {DECLINE_REASONS.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {reason === 'Other (please specify)' && (
            <input
              className="decline-modal-input"
              placeholder="Enter reason..."
              value={customReason}
              onChange={e => setCustomReason(e.target.value)}
            />
          )}
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 0 }}>
            <button
              className="decline-modal-btn decline-cancel-btn"
              onClick={onClose}
              disabled={loading}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') onClose(); }}
            >
              Cancel
            </button>
            <button
              className="decline-modal-btn decline-confirm-btn"
              onClick={handleConfirm}
              disabled={loading}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
            >
              {loading ? 'Declining...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [requestLoading, setRequestLoading] = useState(true);
  const [requestError, setRequestError] = useState(null);
  const [actionLoading, setActionLoading] = useState({}); // { [requestId]: true/false }
  const [declineDropdown, setDeclineDropdown] = useState({ open: false, requestId: null, reason: '' });
  const [declineModal, setDeclineModal] = useState({ open: false, requestId: null });
  const [declineReasonLoading, setDeclineReasonLoading] = useState(false);
  const DECLINE_REASONS = [
    'User has ongoing trips with bookings',
    'User has pending payments',
    'User account under review',
    'Other (please specify)'
  ];

  useEffect(() => {
    fetchUsers();
    fetchDeletionRequests();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchTerm, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    // Listen for custom event from notification click
    const handler = () => setShowRequests(true);
    window.addEventListener('show-pending-deletion-requests', handler);
    return () => window.removeEventListener('show-pending-deletion-requests', handler);
  }, []);

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
      console.log('API /profile/admin/users response:', response.data);
      const usersArray = Array.isArray(response.data?.$values) ? response.data.$values : [];
      // Transform the data to match our frontend format
      const users = usersArray.map(user => ({
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

  const fetchDeletionRequests = async () => {
    try {
      setRequestLoading(true);
      setRequestError(null);
      const res = await axios.get("http://localhost:5030/api/account-deletion/requests");
      let requests = res.data;
      if (requests && requests.$values) {
        requests = requests.$values;
      }
      setDeletionRequests(Array.isArray(requests) ? requests : []);
    } catch (err) {
      setRequestError("Failed to fetch account deletion requests.");
      setDeletionRequests([]);
    } finally {
      setRequestLoading(false);
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

  // Accept deletion request
  const handleAcceptRequest = async (requestId) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`http://localhost:5030/api/account-deletion/approve/${requestId}`);
      await fetchDeletionRequests();
    } catch (err) {
      alert(
        err?.response?.data ||
        err?.message ||
        "Failed to approve account deletion request."
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  // Decline deletion request (with SweetAlert2 popup and custom input)
  const handleDeclineRequest = (requestId) => {
    setDeclineModal({ open: true, requestId });
  };

  const handleConfirmDecline = async (reason) => {
    const requestId = declineModal.requestId;
    setDeclineReasonLoading(true);
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(`http://localhost:5030/api/account-deletion/decline/${requestId}`, reason, {
        headers: { 'Content-Type': 'application/json' },
      });
      await fetchDeletionRequests();
      setDeclineModal({ open: false, requestId: null });
    } catch (err) {
      alert(err?.response?.data || err?.message || 'Failed to decline account deletion request.');
    } finally {
      setDeclineReasonLoading(false);
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const pendingCount = Array.isArray(deletionRequests) ? deletionRequests.filter(r => r.status === 'Pending').length : 0;

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
      {/* Account Deletion Requests Notification & List */}
      {pendingCount > 0 && (
        <div className="account-deletion-requests-bar">
          <div className="account-deletion-requests-header">
            <FaBell style={{ color: '#e74c3c', fontSize: 22 }} />
            <span className="account-deletion-requests-count">
              {pendingCount} Pending Account Deletion Requests
            </span>
            <span
              className="show-requests-toggle"
              onClick={() => setShowRequests((prev) => !prev)}
            >
              {showRequests ? 'Hide Requests' : 'Show Requests'}
            </span>
          </div>
          {showRequests && (
            <div style={{ marginTop: 18 }}>
              {requestLoading ? (
                <div>Loading requests...</div>
              ) : requestError ? (
                <div style={{ color: 'red' }}>{requestError}</div>
              ) : !Array.isArray(deletionRequests) || deletionRequests.length === 0 ? (
                <div style={{ color: '#7b8794' }}>No account deletion requests.</div>
              ) : (
                <table className="account-deletion-requests-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Requested At</th>
                      <th>Status</th>
                      <th>Admin Reply</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(deletionRequests) && deletionRequests.map((req) => (
                      <tr key={req.id}>
                        <td
                          className="account-deletion-requests-userid clickable-userid"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/admin/user-profile/${req.userId}`)}
                          title="View User Profile"
                        >
                          {req.userId}
                        </td>
                        <td>{new Date(req.requestedAt).toLocaleString()}</td>
                        <td className={
                          req.status === 'Pending' ? 'account-deletion-requests-status-pending' :
                          req.status === 'Approved' ? 'account-deletion-requests-status-approved' :
                          'account-deletion-requests-status-declined'
                        }>{req.status}</td>
                        <td className="account-deletion-requests-admin-reply">{req.adminReply || '-'}</td>
                        <td>
                          {req.status === 'Pending' && (
                            <>
                              {/* Removed View Details button */}
                              {actionLoading[req.id] ? (
                                <span style={{ marginLeft: 12, color: '#888' }}>Processing...</span>
                              ) : (
                                <>
                                  <span
                                    style={{ color: 'green', marginLeft: 12, cursor: 'pointer', fontWeight: 500 }}
                                    title="Accept Request"
                                    onClick={() => handleAcceptRequest(req.id)}
                                  >
                                    Accept
                                  </span>
                                  <span
                                    style={{ color: 'red', marginLeft: 16, cursor: 'pointer', fontWeight: 500 }}
                                    title="Decline Request"
                                    onClick={() => handleDeclineRequest(req.id)}
                                  >
                                    Decline
                                  </span>
                                </>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

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

      <DeclineRequestModal
        open={declineModal.open}
        onClose={() => setDeclineModal({ open: false, requestId: null })}
        onConfirm={handleConfirmDecline}
        loading={declineReasonLoading}
      />
    </div>
  );
};

export default UserManagement; 