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
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("last6Months");
  const [userType, setUserType] = useState("all");

  useEffect(() => {
    // Simulate API call to fetch user analytics data
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call with the selected filters
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData = {
          totalUsers: 2845,
          newUsers: 245,
          activeUsers: 1876,
          inactiveUsers: 969,
          userTypes: {
            travelers: 2145,
            accommodationProviders: 420,
            vehicleProviders: 280,
          },
          signupTrend: [
            {
              month: "Jan",
              travelers: 85,
              accommodationProviders: 12,
              vehicleProviders: 8,
            },
            {
              month: "Feb",
              travelers: 110,
              accommodationProviders: 15,
              vehicleProviders: 10,
            },
            {
              month: "Mar",
              travelers: 145,
              accommodationProviders: 18,
              vehicleProviders: 12,
            },
            {
              month: "Apr",
              travelers: 130,
              accommodationProviders: 20,
              vehicleProviders: 15,
            },
            {
              month: "May",
              travelers: 160,
              accommodationProviders: 25,
              vehicleProviders: 18,
            },
            {
              month: "Jun",
              travelers: 195,
              accommodationProviders: 30,
              vehicleProviders: 22,
            },
          ],
          retentionRate: 78,
          conversionRate: 12,
          usersByCountry: [
            { country: "Sri Lanka", count: 1245, percentage: 43.8 },
            { country: "India", count: 420, percentage: 14.8 },
            { country: "United Kingdom", count: 380, percentage: 13.4 },
            { country: "Australia", count: 320, percentage: 11.2 },
            { country: "United States", count: 280, percentage: 9.8 },
            { country: "Other", count: 200, percentage: 7.0 },
          ],
          usersByDevice: [
            { device: "Mobile", count: 1650, percentage: 58 },
            { device: "Desktop", count: 950, percentage: 33.4 },
            { device: "Tablet", count: 245, percentage: 8.6 },
          ],
        };

        setAnalyticsData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange, userType]);

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="user-analytics">
      <div className="section-header">
        <h1 className="page-title">User Analytics</h1>
        <div className="analytics-filters">
          <div className="filter-item">
            <FaCalendarAlt className="filter-icon" />
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
          <div className="filter-item">
            <FaFilter className="filter-icon" />
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

      <div className="analytics-summary">
        <div className="analytics-card">
          <div className="analytics-icon total-users">
            <FaUsers />
          </div>
          <div className="analytics-details">
            <h3>Total Users</h3>
            <p className="analytics-value">{analyticsData.totalUsers}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon new-users">
            <FaUserPlus />
          </div>
          <div className="analytics-details">
            <h3>New Users</h3>
            <p className="analytics-value">{analyticsData.newUsers}</p>
            <p className="analytics-subtext">Last 30 days</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon active-users">
            <FaUsers />
          </div>
          <div className="analytics-details">
            <h3>Active Users</h3>
            <p className="analytics-value">{analyticsData.activeUsers}</p>
            <p className="analytics-subtext">
              {Math.round(
                (analyticsData.activeUsers / analyticsData.totalUsers) * 100
              )}
              % of total
            </p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-icon inactive-users">
            <FaUserMinus />
          </div>
          <div className="analytics-details">
            <h3>Inactive Users</h3>
            <p className="analytics-value">{analyticsData.inactiveUsers}</p>
            <p className="analytics-subtext">
              {Math.round(
                (analyticsData.inactiveUsers / analyticsData.totalUsers) * 100
              )}
              % of total
            </p>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-chart-card signup-trend">
          <div className="card-header">
            <h2>User Signup Trend</h2>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {analyticsData.signupTrend.map((month, index) => (
                  <div key={index} className="chart-month">
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar travelers"
                        style={{ height: `${(month.travelers / 200) * 100}%` }}
                        title={`${month.travelers} travelers`}
                      ></div>
                      <div
                        className="chart-bar accommodation"
                        style={{
                          height: `${
                            (month.accommodationProviders / 200) * 100
                          }%`,
                        }}
                        title={`${month.accommodationProviders} accommodation providers`}
                      ></div>
                      <div
                        className="chart-bar vehicle"
                        style={{
                          height: `${(month.vehicleProviders / 200) * 100}%`,
                        }}
                        title={`${month.vehicleProviders} vehicle providers`}
                      ></div>
                    </div>
                    <div className="chart-label">{month.month}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color travelers"></div>
                  <span>Travelers</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color accommodation"></div>
                  <span>Accommodation Providers</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color vehicle"></div>
                  <span>Vehicle Providers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-chart-card user-types">
          <div className="card-header">
            <h2>User Types Distribution</h2>
          </div>
          <div className="chart-container">
            <div className="donut-chart-placeholder">
              <div className="donut-chart">
                <div
                  className="donut-segment travelers"
                  style={{
                    transform: `rotate(0deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      50 +
                      50 *
                        Math.cos(
                          (2 * Math.PI * analyticsData.userTypes.travelers) /
                            analyticsData.totalUsers
                        )
                    }% ${
                      50 -
                      50 *
                        Math.sin(
                          (2 * Math.PI * analyticsData.userTypes.travelers) /
                            analyticsData.totalUsers
                        )
                    }%, 50% 50%)`,
                  }}
                ></div>
                <div
                  className="donut-segment accommodation"
                  style={{
                    transform: `rotate(${
                      (360 * analyticsData.userTypes.travelers) /
                      analyticsData.totalUsers
                    }deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      50 +
                      50 *
                        Math.cos(
                          (2 *
                            Math.PI *
                            analyticsData.userTypes.accommodationProviders) /
                            analyticsData.totalUsers
                        )
                    }% ${
                      50 -
                      50 *
                        Math.sin(
                          (2 *
                            Math.PI *
                            analyticsData.userTypes.accommodationProviders) /
                            analyticsData.totalUsers
                        )
                    }%, 50% 50%)`,
                  }}
                ></div>
                <div
                  className="donut-segment vehicle"
                  style={{
                    transform: `rotate(${
                      (360 *
                        (analyticsData.userTypes.travelers +
                          analyticsData.userTypes.accommodationProviders)) /
                      analyticsData.totalUsers
                    }deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      50 +
                      50 *
                        Math.cos(
                          (2 *
                            Math.PI *
                            analyticsData.userTypes.vehicleProviders) /
                            analyticsData.totalUsers
                        )
                    }% ${
                      50 -
                      50 *
                        Math.sin(
                          (2 *
                            Math.PI *
                            analyticsData.userTypes.vehicleProviders) /
                            analyticsData.totalUsers
                        )
                    }%, 50% 50%)`,
                  }}
                ></div>
                <div className="donut-hole"></div>
                <div className="donut-center">
                  <div className="donut-total">{analyticsData.totalUsers}</div>
                  <div className="donut-label">Total Users</div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color travelers"></div>
                  <span>
                    Travelers (
                    {Math.round(
                      (analyticsData.userTypes.travelers /
                        analyticsData.totalUsers) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="legend-item">
                  <div className="legend-color accommodation"></div>
                  <span>
                    Accommodation Providers (
                    {Math.round(
                      (analyticsData.userTypes.accommodationProviders /
                        analyticsData.totalUsers) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="legend-item">
                  <div className="legend-color vehicle"></div>
                  <span>
                    Vehicle Providers (
                    {Math.round(
                      (analyticsData.userTypes.vehicleProviders /
                        analyticsData.totalUsers) *
                        100
                    )}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-table-card">
          <div className="card-header">
            <h2>Users by Country</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Users</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.usersByCountry.map((country, index) => (
                <tr key={index}>
                  <td>{country.country}</td>
                  <td>{country.count}</td>
                  <td>{country.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analytics-table-card">
          <div className="card-header">
            <h2>Users by Device</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Users</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.usersByDevice.map((device, index) => (
                <tr key={index}>
                  <td>{device.device}</td>
                  <td>{device.count}</td>
                  <td>{device.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analytics-metrics">
        <div className="metrics-card">
          <h3>Retention Rate</h3>
          <div className="metric-value">{analyticsData.retentionRate}%</div>
          <p className="metric-description">
            Percentage of users who return to the platform
          </p>
        </div>
        <div className="metrics-card">
          <h3>Conversion Rate</h3>
          <div className="metric-value">{analyticsData.conversionRate}%</div>
          <p className="metric-description">
            Percentage of visitors who sign up
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
