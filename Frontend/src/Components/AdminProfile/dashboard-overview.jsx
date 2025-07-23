"use client";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaStar,
  FaEye,
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
  const [activityData, setActivityData] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchPopularPlaces();
    fetchActivityData();
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

    try{
      const accommodationRes = await axios.get(
        "http://localhost:5030/api/accommodation/count"
      );
      setStats((prev) => ({
        ...prev,
        totalAccommodations: accommodationRes.data,
      }));
    }
    catch (error) {
      console.error("Failed to fetch accommodations count:", error);
    }
    finally {
      setIsLoading(false);
    }

    try {
      const vehicleRes = await axios.get(
        "http://localhost:5030/api/vehicle/count"
      );
      setStats((prev) => ({
        ...prev,
        totalVehicles: vehicleRes.data,
      }));
    } catch (error) {
      console.error("Failed to fetch vehicles count:", error);
    }
    finally {
      setIsLoading(false);
    }

    try {
      const userRes = await axios.get("http://localhost:5030/api/profile/count");
      setStats((prev) => ({
        ...prev,
        totalUsers: userRes.data,
      }));
    }
    catch (error) {
      console.error("Failed to fetch users count:", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const fetchPopularPlaces = async () => {
    try {
      const res = await axios.get("http://localhost:5030/api/places/popular");
      console.log('API /places/popular response:', res.data);
      setPopularPlaces(Array.isArray(res.data?.$values) ? res.data.$values : []);
    } catch (err) {
      console.error("Failed to fetch popular places:", err);
      setPopularPlaces([]); // Always set to array on error
    }
  };

  const fetchActivityData = async () => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      // Replace with your real backend endpoint
      const res = await axios.get('http://localhost:5030/api/activity/overview');
      setActivityData(res.data);
    } catch (err) {
      setActivityError('Failed to load activity data');
    } finally {
      setActivityLoading(false);
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
      </div>

      <div className="dashboard-grid" style={{ display: 'block' }}>
        {/* Popular Places Table */}
        <div className="dashboard-card recent-places popular-places-card">
          <div className="card-header popular-places-header">
            <h2>Popular Places</h2>
          </div>
          <table className="data-table popular-places-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Place</th>
                <th>District</th>
                <th>Category</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(popularPlaces) && popularPlaces.length > 0 ? (
                popularPlaces.map((place, idx) => {
                  const rating = Number(place.averageRating) || 0;
                  const reviewCount = place.reviewCount || 0;
                  const isTop = idx === 0;
                  return (
                    <tr key={place.id} className={`popular-place-row${isTop ? ' top-place' : ''}`}>
                      <td>{idx + 1}</td>
                      <td>
                        {place.mainImageUrl ? (
                          <img src={place.mainImageUrl} alt={place.name} className={`popular-place-img${isTop ? ' top-img' : ''}`} />
                        ) : (
                          <div className="popular-place-img placeholder" />
                        )}
                      </td>
                      <td className="popular-place-name">{place.name || 'Unnamed'}</td>
                      <td>{place.district?.name || 'Unknown'}</td>
                      <td>{place.category?.categoryName || 'N/A'}</td>
                      <td>
                        <div className="adminrating popular-place-rating">
                          <span className="adminrating-stars">
                            {'★'.repeat(Math.round(rating))}
                            {'☆'.repeat(5 - Math.round(rating))}
                          </span>
                          <span className="adminrating-value">
                            {rating.toFixed(1)}
                          </span>
                          <span className="popular-place-review-count">({reviewCount})</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No popular places found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Activity Overview */}
        <div className="dashboard-card activity-chart activity-overview-card">
          <div className="card-header activity-overview-header activity-overview-flex">
            <h2>Activity Overview</h2>
            <select className="time-selector activity-overview-filter">
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="chart-container">
            {activityLoading ? (
              <div style={{ textAlign: 'center', width: '100%' }}>Loading chart...</div>
            ) : activityError ? (
              <div style={{ color: 'red', textAlign: 'center', width: '100%' }}>{activityError}</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;