"use client";
import React from "react";
import { useState, useEffect } from "react";
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

  return (
    <div className="user-analytics">
      <div className="adminsection-header">
        <h1 className="page-title">User Analytics</h1>
        <div className="analytics-filters">
          <div className="filter-item">
            <FaCalendarAlt className="filter-icon" />
            <select>
              <option value="last30Days">Last 30 Days</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="lastYear">Last Year</option>
            </select>
          </div>
          <div className="filter-item">
            <FaFilter className="filter-icon" />
            <select>
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

      <div className="analytics-summary">
        <div className="analytics-card">
          <div className="analytics-icon total-users">
            <FaUsers />
          </div>
          <div className="analytics-details">
            <h3>Total Users</h3>
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
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon inactive-users">
            <FaUserMinus />
          </div>
          <div className="analytics-details">
            <h3>Inactive Users</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
