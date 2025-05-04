"use client"
import React from "react"
import { useState, useEffect } from "react"
import { FaMapMarkerAlt, FaUsers, FaStar, FaEye, FaArrowUp, FaArrowDown, FaHotel, FaCar } from "react-icons/fa"

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalPlaces: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalVisits: 0,
    totalAccommodations: 0,
    totalVehicles: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setStats({
          totalPlaces: 156,
          totalUsers: 2845,
          totalReviews: 1253,
          totalVisits: 45678,
          totalAccommodations: 324,
          totalVehicles: 187,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Mock chart data
  const recentActivity = [
    { date: "Jan", visits: 2500, reviews: 120, signups: 85 },
    { date: "Feb", visits: 3200, reviews: 150, signups: 110 },
    { date: "Mar", visits: 3800, reviews: 170, signups: 145 },
    { date: "Apr", visits: 3500, reviews: 160, signups: 130 },
    { date: "May", visits: 4200, reviews: 190, signups: 160 },
    { date: "Jun", visits: 4800, reviews: 210, signups: 195 },
  ]

  // Mock recent places
  const recentPlaces = [
    { id: 1, name: "Sigiriya", district: "Matale", visits: 1245, rating: 4.8 },
    { id: 2, name: "Ella Rock", district: "Badulla", visits: 980, rating: 4.6 },
    { id: 3, name: "Galle Fort", district: "Galle", visits: 1120, rating: 4.7 },
    { id: 4, name: "Nine Arch Bridge", district: "Badulla", visits: 850, rating: 4.5 },
    { id: 5, name: "Yala National Park", district: "Hambantota", visits: 760, rating: 4.4 },
  ]

  // Mock recent user signups
  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", date: "2023-06-15", type: "Traveler" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", date: "2023-06-14", type: "Accommodation Provider" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", date: "2023-06-13", type: "Vehicle Provider" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", date: "2023-06-12", type: "Traveler" },
  ]

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    )
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
            <p className="stat-change increase">
              <FaArrowUp /> 12% <span>since last month</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <p className="stat-change increase">
              <FaArrowUp /> 8% <span>since last month</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon accommodations">
            <FaHotel />
          </div>
          <div className="stat-details">
            <h3>Accommodations</h3>
            <p className="stat-value">{stats.totalAccommodations}</p>
            <p className="stat-change increase">
              <FaArrowUp /> 15% <span>since last month</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon vehicles">
            <FaCar />
          </div>
          <div className="stat-details">
            <h3>Vehicles</h3>
            <p className="stat-value">{stats.totalVehicles}</p>
            <p className="stat-change increase">
              <FaArrowUp /> 10% <span>since last month</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reviews">
            <FaStar />
          </div>
          <div className="stat-details">
            <h3>Total Reviews</h3>
            <p className="stat-value">{stats.totalReviews}</p>
            <p className="stat-change increase">
              <FaArrowUp /> 5% <span>since last month</span>
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon visits">
            <FaEye />
          </div>
          <div className="stat-details">
            <h3>Total Visits</h3>
            <p className="stat-value">{stats.totalVisits}</p>
            <p className="stat-change decrease">
              <FaArrowDown /> 3% <span>since last month</span>
            </p>
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
            {/* In a real app, you would use a charting library like Chart.js or Recharts */}
            <div className="chart-placeholder">
              <div className="chart-bars">
                {recentActivity.map((month, index) => (
                  <div key={index} className="chart-month">
                    <div className="chart-bar-container">
                      <div
                        className="chart-bar visits"
                        style={{ height: `${(month.visits / 5000) * 100}%` }}
                        title={`${month.visits} visits`}
                      ></div>
                      <div
                        className="chart-bar reviews"
                        style={{ height: `${(month.reviews / 250) * 100}%` }}
                        title={`${month.reviews} reviews`}
                      ></div>
                      <div
                        className="chart-bar signups"
                        style={{ height: `${(month.signups / 200) * 100}%` }}
                        title={`${month.signups} signups`}
                      ></div>
                    </div>
                    <div className="chart-label">{month.date}</div>
                  </div>
                ))}
              </div>
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
            <button className="view-all-btn">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Place</th>
                <th>District</th>
                <th>Visits</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {recentPlaces.map((place) => (
                <tr key={place.id}>
                  <td>{place.name}</td>
                  <td>{place.district}</td>
                  <td>{place.visits}</td>
                  <td>
                    <div className="rating">
                      <span className="rating-stars">
                        {"★".repeat(Math.floor(place.rating))}
                        {"☆".repeat(5 - Math.floor(place.rating))}
                      </span>
                      <span className="rating-value">{place.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
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
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.date}</td>
                <td>
                  <span className={`user-type-badge ${user.type.toLowerCase().replace(" ", "-")}`}>{user.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardOverview
