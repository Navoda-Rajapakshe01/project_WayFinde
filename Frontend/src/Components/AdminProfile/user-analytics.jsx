"use client";
import React, { useState } from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import "../AdminProfile/user-analytics.css";
import "../../App.css";

const UserAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState("last6Months");
  const [userType, setUserType] = useState("all");

  return (
    <div className="user-analytics">
      <div className="adminsection-header">
        <h1 className="page-title">User Analytics</h1>
      </div>

      {/* Filter Bar */}
      <div className="adminfilter-bar">
          <div className="adminfilter-dropdown-group">
            <div className="adminfilter-dropdown">
              <FaCalendarAlt className="adminfilter-icon" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="last30Days">Last 30 Days</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="lastYear">Last Year</option>
              </select>
            </div>

            <div className="adminfilter-dropdown">
              <FaFilter className="adminfilter-icon" />
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="all">All User Types</option>
                <option value="travelers">Travelers</option>
                <option value="accommodationProviders">
                  Accommodation Providers
                </option>
                <option value="vehicleProviders">Vehicle Providers</option>
              </select>
            </div>
          </div>
        </div>

      {/* Analytics Cards */}
      <div className="analytics-summary">
        <div className="analytics-card">
          <div className="analytics-icon total-users">
            <FaUsers />
          </div>
          <div className="analytics-details">
            <h3>Total Users</h3>
            <p className="analytics-subtext">Including all user types</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon new-users">
            <FaUserPlus />
          </div>
          <div className="analytics-details">
            <h3>New Users</h3>
            <p className="analytics-subtext">Last 30 days</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon active-users">
            <FaUsers />
          </div>
          <div className="analytics-details">
            <h3>Active Users</h3>
            <p className="analytics-subtext">Based on recent logins</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon inactive-users">
            <FaUserMinus />
          </div>
          <div className="analytics-details">
            <h3>Inactive Users</h3>
            <p className="analytics-subtext">Haven't logged in recently</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
