import React, { useEffect, useState } from "react";
import axios from "axios";
import AccommodationForm from "./AccommodationForm";
import AccommodationCard from "./AccommodationCard";
import Alert from "../Alert";
import HeroSection from "../../Components/HeroSection/HeroSection";
import { Tabs, Tab } from "react-bootstrap";

const AccommodationSupplier = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState("");
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalAccommodations: 0,
    activeAccommodations: 0,
    totalBookings: 0,
    monthlyBookings: 0,
    monthlyRevenue: 0,
  });

  const showTemporaryAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 3000);
  };

  // Fetch accommodations and compute stats
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5030/api/Accommodation");

      const rawData = res.data;
      const data = Array.isArray(rawData) ? rawData : rawData?.$values || [];

      const active = data.filter((a) => a.isAvailable).length;

      setAccommodations(data);
      setDashboardStats((prev) => ({
        ...prev,
        totalAccommodations: data.length,
        activeAccommodations: active,
      }));
    } catch (error) {
      console.error("Fetch accommodations failed:", error);
      // fallback data...
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5030/api/AccommodationReservation"
      );
      const rawData = res.data;
      const data = Array.isArray(rawData) ? rawData : rawData?.$values || [];

      const currentMonth = new Date();
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );

      const thisMonth = data.filter(
        (b) => new Date(b.bookingDate) >= startOfMonth
      );
      const revenue = thisMonth.reduce((sum, b) => sum + b.totalAmount, 0);

      setBookings(data);
      setDashboardStats((prev) => ({
        ...prev,
        totalBookings: data.length,
        monthlyBookings: thisMonth.length,
        monthlyRevenue: revenue,
      }));
    } catch (error) {
      console.error("Fetch bookings failed:", error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated =
        currentStatus === "Available" ? "Unavailable" : "Available";
      await axios.put(`http://localhost:5030/api/Accommodation/${id}/status`, {
        status: updated,
      });
      await fetchAccommodations();
      showTemporaryAlert("Accommodation status updated.");
    } catch {
      showTemporaryAlert("Failed to update status.");
    }
  };

  const handleDeleteAccommodation = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await axios.delete(`http://localhost:5030/api/Accommodation/${id}`);
        await fetchAccommodations();
        showTemporaryAlert("Accommodation deleted.");
      } catch {
        showTemporaryAlert("Failed to delete accommodation.");
      }
    }
  };

  const handleEditAccommodation = () => {
    showTemporaryAlert("Edit functionality coming soon.");
  };

  const handleViewBookings = async (accommodationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5030/api/AccommodationReservation/accommodation/${accommodationId}`
      );
      const rawData = res.data;
      const data = Array.isArray(rawData) ? rawData : rawData?.$values || [];
      setBookings(data);
      setActiveTab("bookings");
    } catch {
      showTemporaryAlert("Failed to fetch bookings.");
    }
  };

  useEffect(() => {
    fetchAccommodations();
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your accommodations...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        title="Manage Your Accommodations"
        subtitle="Add, edit, and track your accommodation listings"
        backgroundImage="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
        color="white"
      />

      <div className="supplier-container">
        {alert && <Alert message={alert} />}

        <div className="supplier-header">
          <h2>My Accommodation Listings</h2>
          <button className="post-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "+ Post New Accommodation"}
          </button>
        </div>

        {showForm && (
          <AccommodationForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchAccommodations();
              showTemporaryAlert("Accommodation posted successfully.");
            }}
            onFail={() => showTemporaryAlert("Failed to post accommodation.")}
          />
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4">
          <Tab eventKey="dashboard" title="Dashboard">
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Accommodations</h3>
                <div className="stat-value">
                  {dashboardStats.totalAccommodations}
                </div>
                <div className="stat-detail">
                  <span className="active-stat">
                    {dashboardStats.activeAccommodations} available
                  </span>{" "}
                  /{" "}
                  <span className="inactive-stat">
                    {dashboardStats.totalAccommodations -
                      dashboardStats.activeAccommodations}{" "}
                    unavailable
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <h3>Total Bookings</h3>
                <div className="stat-value">{dashboardStats.totalBookings}</div>
                <div className="stat-detail">
                  {dashboardStats.monthlyBookings} this month
                </div>
              </div>

              <div className="stat-card">
                <h3>Monthly Revenue</h3>
                <div className="stat-value">
                  Rs {dashboardStats.monthlyRevenue.toFixed(2)}
                </div>
                <div className="stat-detail">
                  {dashboardStats.monthlyBookings > 0
                    ? `Avg Rs ${(
                        dashboardStats.monthlyRevenue /
                        dashboardStats.monthlyBookings
                      ).toFixed(2)} per booking`
                    : "No bookings this month"}
                </div>
              </div>
            </div>

            {bookings.length > 0 && (
              <div className="recent-bookings">
                <h3>Recent Bookings</h3>
                <div className="bookings-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Accommodation</th>
                        <th>Customer</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 5).map((booking) => (
                        <tr key={booking.id}>
                          <td>#{booking.id}</td>
                          <td>
                            {accommodations.find(
                              (a) => a.id === booking.accommodationId
                            )?.name || "Unknown"}
                          </td>
                          <td>{booking.customerName}</td>
                          <td>
                            {new Date(booking.checkInDate).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              booking.checkOutDate
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>Rs {booking.totalAmount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Tab>

          <Tab eventKey="listings" title="Your Accommodations">
            <div className="accommodation-grid">
              {accommodations.length === 0 ? (
                <p>No accommodations posted yet.</p>
              ) : (
                accommodations.map((acc) => (
                  <AccommodationCard
                    key={acc.id}
                    accommodation={acc}
                    onDelete={handleDeleteAccommodation}
                    onEdit={handleEditAccommodation}
                    onToggleStatus={handleToggleStatus}
                    onViewBookings={handleViewBookings}
                  />
                ))
              )}
            </div>
          </Tab>

          <Tab eventKey="bookings" title="Bookings">
            <div className="bookings-table">
              {bookings.length === 0 ? (
                <p>No bookings available at the moment.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Accommodation</th>
                      <th>Customer</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>
                          {accommodations.find(
                            (a) => a.id === booking.accommodationId
                          )?.name || "Unknown"}
                        </td>
                        <td>{booking.customerName}</td>
                        <td>
                          {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>Rs {booking.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default AccommodationSupplier;
