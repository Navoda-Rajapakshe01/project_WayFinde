import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaBuilding,
  FaTruck,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import axios from "axios";
import "../CSS/UserProfileDetail.css";

const UserProfileDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogCount, setBlogCount] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [accommodationCount, setAccommodationCount] = useState(0);
  const [accommodationBookingCount, setAccommodationBookingCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [vehicleBookingCount, setVehicleBookingCount] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5030/api/profile/admin/users/${userId}`
        );
        console.log("User data received:", response.data);
        setUser(response.data);
        // Fetch stats based on user role
        const role = response.data.role || response.data.Role;
        if (role === "NormalUser") {
          // Blogs
          const blogsRes = await axios.get("http://localhost:5030/api/Blog/all");
          const userBlogs = blogsRes.data.filter(
            (b) => b.User && (b.User.Id === userId || b.User.id === userId)
          );
          setBlogCount(userBlogs.length);
          // Trips
          const tripsRes = await axios.get(
            `http://localhost:5030/api/trips/user/${userId}`
          );
          setTripCount(Array.isArray(tripsRes.data) ? tripsRes.data.length : tripsRes.data?.length || 0);
        } else if (role === "AccommodationProvider") {
          // Accommodations
          const accRes = await axios.get("http://localhost:5030/api/accommodation");
          const userAccs = accRes.data.filter(a => a.ownerId === userId || a.OwnerId === userId);
          setAccommodationCount(userAccs.length);
          // Accommodation Bookings
          const bookingsRes = await axios.get("http://localhost:5030/api/AccommodationReservation");
          const userBookings = bookingsRes.data.filter(b => b.ownerId === userId || b.OwnerId === userId);
          setAccommodationBookingCount(userBookings.length);
        } else if (role === "TransportProvider" || role === "VehicleProvider") {
          // Vehicles
          const vehiclesRes = await axios.get("http://localhost:5030/api/vehicle");
          const userVehicles = vehiclesRes.data.filter(v => v.supplierId === userId || v.SupplierId === userId);
          setVehicleCount(userVehicles.length);
          // Vehicle Bookings
          const bookingsRes = await axios.get("http://localhost:5030/api/VehicleReservations");
          const userBookings = bookingsRes.data.filter(b => b.ownerId === userId || b.OwnerId === userId || b.supplierId === userId || b.SupplierId === userId);
          setVehicleBookingCount(userBookings.length);
        }
      } catch (err) {
        setError("Failed to fetch user details");
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  const getStatusText = (lastLogin) => {
    if (!lastLogin) return "Inactive";
    const lastLoginDate = new Date(lastLogin);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastLoginDate > threeMonthsAgo ? "Active" : "Inactive";
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
      case "Admin":
        return "Admin";
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

  const handleBlogsClick = () => {
    navigate(`/admin/user-blogs/${userId}`);
  };
  const handleTripsClick = () => {
    navigate(`/admin/user-trips/${userId}`);
  };

  if (loading) {
    return (
      <div className="user-profile-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-detail-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button
            className="back-button"
            onClick={() => navigate("/admin/users-management")}
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-detail-container">
        <div className="error-container">
          <h2>User Not Found</h2>
          <p>The requested user could not be found.</p>
          <button
            className="back-button"
            onClick={() => navigate("/admin/users-management")}
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-detail-container">
      <div className="page-title">
        <h1>User Profile Details</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header-section">
            <div className="profile-avatar">
              <img
                src={user.profilePicture || "/defaultprofilepicture.png"}
                alt={user.fullName || user.FullName}
                className="profile-image"
              />
            </div>
            <div className="profile-basic-info">
              <h2>{user.fullName || user.FullName || "N/A"}</h2>
              <p className="user-email">{user.email || user.Email}</p>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-section">
              <h3>Contact Information</h3>
              <div className="detail-item">
                <strong>Email:</strong> {user.email || user.Email}
              </div>
              <div className="detail-item">
                <strong>Phone:</strong>{" "}
                {user.phone || user.Phone || "Not provided"}
              </div>
            </div>

            <div className="detail-section">
              <h3>Account Information</h3>
              <div className="detail-item">
                <strong>Date Joined:</strong>{" "}
                {formatDate(user.dateJoined || user.DateJoined)}
              </div>
              <div className="detail-item">
                <strong>Last Login:</strong>{" "}
                {formatDate(user.lastLogin || user.LastLogin)}
              </div>
            </div>

            <div className="detail-section">
              <h3>Social Statistics</h3>
              <div className="detail-item">
                <strong>Followers:</strong>{" "}
                {user.followersCount || user.FollowersCount || 0}
              </div>
              <div className="detail-item">
                <strong>Following:</strong>{" "}
                {user.followingCount || user.FollowingCount || 0}
              </div>
            </div>

            {user.bio && (
              <div className="detail-section full-width">
                <h3>Bio</h3>
                <div className="user-bio">{user.bio}</div>
              </div>
            )}
          </div>
          <div className="user-activity-section">
            <h3>User Activity</h3>
            <div className="activity-stats">
              {user && (user.role === "NormalUser") && (
                <>
                  <div className="activity-stat clickable" onClick={handleBlogsClick} title="View all blogs by this user">
                    <span className="stat-label">Blogs Written:</span>
                    <span className="stat-value">{blogCount}</span>
                  </div>
                  <div className="activity-stat clickable" onClick={handleTripsClick} title="View all trips by this user">
                    <span className="stat-label">Trips Planned:</span>
                    <span className="stat-value">{tripCount}</span>
                  </div>
                </>
              )}
              {user && (user.role === "AccommodationProvider") && (
                <>
                  <div className="activity-stat">
                    <span className="stat-label">Accommodation Places:</span>
                    <span className="stat-value">{accommodationCount}</span>
                  </div>
                  <div className="activity-stat">
                    <span className="stat-label">Bookings:</span>
                    <span className="stat-value">{accommodationBookingCount}</span>
                  </div>
                </>
              )}
              {user && (user.role === "TransportProvider" || user.role === "VehicleProvider") && (
                <>
                  <div className="activity-stat">
                    <span className="stat-label">Vehicles:</span>
                    <span className="stat-value">{vehicleCount}</span>
                  </div>
                  <div className="activity-stat">
                    <span className="stat-label">Vehicle Bookings:</span>
                    <span className="stat-value">{vehicleBookingCount}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetail;
