"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaHotel,
  FaCar,
} from "react-icons/fa";
import "../AdminProfile/dashboard-overview.css";
import "../../App.css";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalPlaces: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalVisits: 0,
    totalAccommodations: 0,
    totalVehicles: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [popularPlaces, setPopularPlaces] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPopularPlaces();
  }, []);

  const fetchStats = async () => {
    try {
      const placeRes = await axios.get(
        "http://localhost:5030/api/places/count"
      );
      setStats((prev) => ({
        ...prev,
        totalPlaces: placeRes.data,
      }));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }

    try {
      const reviewsRes = await axios.get(
        "http://localhost:5030/api/reviews/Rcount"
      );
      setStats((prev) => ({
        ...prev,
        totalReviews: reviewsRes.data,
      }));
    }
    catch (error) {
      console.error("Failed to fetch reviews count:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const fetchPopularPlaces = async () => {
    try {
      const res = await axios.get("http://localhost:5030/api/places/popular");
      setPopularPlaces(res.data);
    } catch (err) {
      console.error("Failed to fetch popular places:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon places">
            <FaMapMarkerAlt />
          </div>
          <div className="stat-details">
            <h3>Total Places</h3>
            <p className="stat-value">{stats.totalPlaces}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon accommodations">
            <FaHotel />
          </div>
          <div className="stat-details">
            <h3>Accommodations</h3>
            <p className="stat-value">{stats.totalAccommodations}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon vehicles">
            <FaCar />
          </div>
          <div className="stat-details">
            <h3>Vehicles</h3>
            <p className="stat-value">{stats.totalVehicles}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon Adminreviews">
            <FaStar />
          </div>
          <div className="stat-details">
            <h3>Total Reviews</h3>
            <p className="stat-value">{stats.totalReviews}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon visits">
            <FaEye />
          </div>
          <div className="stat-details">
            <h3>Total Visits</h3>
            <p className="stat-value">{stats.totalVisits}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card activity-chart">
          <div className="card-header">
            <h2>Activity Overview</h2>
            <select className="time-selector">
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="chart-container">
            {/* using a charting library like Chart.js or Recharts */}
            <div className="chart-placeholder">
              <div className="chart-bars"></div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color visits"></div>
                  <span>Visits</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color reviews"></div>
                  <span>Reviews</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color signups"></div>
                  <span>Signups</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card recent-places">
          <div className="card-header">
            <h2>Popular Places</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Place</th>
                <th>District</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {popularPlaces.map((place) => {
                console.log("Place object:", place);
                const rating = Number(place.rating) || 0; 

                return (
                  <tr key={place.id}>
                    <td>{place.name || "Unnamed"}</td>
                    <td>{place.district?.name || "Unknown"}</td>
                    <td>
                      <div className="adminrating">
                        <span className="adminrating-stars">
                          {"★".repeat(Math.floor(rating))}
                          {"☆".repeat(5 - Math.floor(rating))}
                        </span>
                        <span className="adminrating-value">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-card recent-users">
        <div className="card-header">
          <h2>Recent User Signups</h2>
          <button className="view-all-btn">View All</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>User Type</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardOverview;
