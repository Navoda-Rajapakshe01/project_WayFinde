"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import Chart from 'chart.js/auto';

function ChartComponent({ labels, data, loading }) {
  const chartRef = useRef(null);

  if (!Array.isArray(labels) || !Array.isArray(data) || labels.length === 0) {
    return <div style={{ color: 'red', textAlign: 'center', padding: 24 }}>No chart data available.</div>;
  }

  useEffect(() => {
    if (!chartRef.current || loading) return;
    if (chartRef.current._chartInstance) {
      chartRef.current._chartInstance.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'User Signups',
            data: data,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0, // straight lines
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    chartRef.current._chartInstance = chartInstance;
    return () => {
      chartInstance.destroy();
    };
  }, [labels, data, loading]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 24 }}>Loading chart...</div>;
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 24px rgba(20,40,80,0.08)',
      padding: '2.5rem 2rem',
      maxWidth: 620,
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '32px 0',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,40,80,0.13)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(20,40,80,0.08)'}
    >
      <h2 style={{ fontWeight: 700, fontSize: '1.45rem', color: '#1a237e', marginBottom: 8 }}>User Signups</h2>
      <span style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 20 }}>Monthly new user registrations</span>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <canvas ref={chartRef} height={220} />
      </div>
    </div>
  );
}

function PieChartComponent({ labels, data, loading }) {
  const chartRef = useRef(null);

  // Pie chart colors (should match dataset)
  const pieColors = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(153, 102, 255, 0.7)'
  ];

  // Calculate percentages for each role
  const total = Array.isArray(data) ? data.reduce((sum, val) => sum + val, 0) : 0;
  const percentages = Array.isArray(data) && total > 0 ? data.map(val => ((val / total) * 100).toFixed(0)) : [];

  useEffect(() => {
    if (!chartRef.current || loading) return;
    if (!Array.isArray(labels) || !Array.isArray(data) || labels.length === 0) return;
    if (chartRef.current._chartInstance) {
      chartRef.current._chartInstance.destroy();
    }
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'User Roles',
            data: data,
            backgroundColor: pieColors,
            borderColor: pieColors.map(c => c.replace('0.7', '1')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, 
          title: { display: false }, 
        },
      },
    });
    chartRef.current._chartInstance = chartInstance;
    return () => {
      chartInstance.destroy();
    };
  }, [labels, data, loading]);

  if (!Array.isArray(labels) || !Array.isArray(data) || labels.length === 0) {
    return <div style={{ color: 'red', textAlign: 'center', padding: 24 }}>No pie chart data available.</div>;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 24 }}>Loading pie chart...</div>;
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 4px 24px rgba(20,40,80,0.08)',
      padding: '2.5rem 2rem',
      maxWidth: 620,
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '32px 0',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(20,40,80,0.13)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(20,40,80,0.08)'}
    >
      <h2 style={{ fontWeight: 700, fontSize: '1.45rem', color: '#1a237e', marginBottom: 8 }}>User Signups by Role</h2>
      <span style={{ color: '#6b7280', fontSize: '1rem', marginBottom: 20 }}>Distribution of user roles</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {/* Pie Chart */}
        <div style={{ position: 'relative', width: 220, height: 220, marginRight: 32 }}>
          <canvas ref={chartRef} width={220} height={220} />
        </div>
        {/* Custom Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 180, marginLeft: 24 }}>
          {labels.map((label, idx) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, fontSize: 15, fontWeight: 500 }}>
              <span style={{
                display: 'inline-block',
                width: 16,
                height: 16,
                backgroundColor: pieColors[idx % pieColors.length],
                borderRadius: 4,
                marginRight: 10,
                border: '1px solid #e0e0e0',
              }} />
              <span style={{ minWidth: 80, textAlign: 'left', marginRight: 10 }}>{label}</span>
              <span style={{ color: '#888', fontWeight: 400 }}>{percentages[idx]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  const [selectedRange, setSelectedRange] = useState('Last 6 Months');
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieLabels, setPieLabels] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [pieLoading, setPieLoading] = useState(true);
  const [pieError, setPieError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchPopularPlaces();
    // Fetch real signup trend data when selectedRange changes
    setActivityLoading(true);
    setActivityError(null);
    let rangeParam = '6months';
    if (selectedRange === 'Last 3 Months') rangeParam = '3months';
    else if (selectedRange === 'Last Month') rangeParam = '1month';
    axios.get(`http://localhost:5030/api/profile/signup-trend?range=${rangeParam}`)
      .then(res => {
        setChartLabels(res.data.labels);
        setChartData(res.data.data);
        setActivityLoading(false);
      })
      .catch(err => {
        setActivityError('Failed to load chart data');
        setActivityLoading(false);
      });
  }, [selectedRange]);

  useEffect(() => {
    setPieLoading(true);
    setPieError(null);
    axios.get('http://localhost:5030/api/profile/signup-roles-pie')
      .then(res => {
        setPieLabels(res.data.labels);
        setPieData(res.data.data);
        setPieLoading(false);
      })
      .catch(err => {
        setPieError('Failed to load pie chart data');
        setPieLoading(false);
      });
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
        <div className="dashboard-card activity-chart activity-overview-card" style={{ background: '#f4f6fa', borderRadius: 24, boxShadow: '0 2px 12px rgba(20,185,213,0.07)', padding: 40, marginBottom: 40, maxWidth: 1400, margin: '0 auto' }}>
          <div className="card-header activity-overview-header activity-overview-flex" style={{ background: 'transparent', boxShadow: 'none', padding: 0, marginBottom: 32 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.7rem', color: '#1a237e', margin: 0 }}>Activity Overview</h2>
            <select
              className="time-selector activity-overview-filter"
              value={selectedRange}
              onChange={e => setSelectedRange(e.target.value)}
              style={{ fontSize: '1rem', padding: '0.7em', borderRadius: 8, border: '1px solid #c7d2fe', background: '#fff', color: '#1a237e', boxShadow: '0 1px 4px rgba(20,185,213,0.04)' }}
            >
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>Last Month</option>
            </select>
          </div>
          {activityLoading ? (
            <div className="chart-container" style={{ textAlign: 'center', width: '100%' }}>Loading chart...</div>
          ) : activityError ? (
            <div className="chart-container" style={{ color: 'red', textAlign: 'center', width: '100%' }}>{activityError}</div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 56,
              width: '100%',
              position: 'relative',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 320 }}>
                <ChartComponent
                  labels={Array.isArray(chartLabels) ? chartLabels : []}
                  data={Array.isArray(chartData) ? chartData : []}
                  loading={activityLoading}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 320 }}>
                <PieChartComponent labels={Array.isArray(pieLabels) ? pieLabels : []} data={Array.isArray(pieData) ? pieData : []} loading={pieLoading} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;