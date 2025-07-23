import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AccommodationForm from "./AccommodationForm";
import AccommodationCard from "./AccommodationCard";
import Alert from "../Alert";
import HeroSection from "../../Components/HeroSection/HeroSection";
import { Tabs, Tab } from "react-bootstrap";
import "../CSS/AccommodationSupplier.css";
import { AuthContext } from "../../Components/Authentication/AuthContext/AuthContext";

const fallbackAccommodations = [];
const fallbackBookings = [];

const AccommodationSupplier = () => {
  const { user } = useContext(AuthContext);
  const supplierId = user?.id;

  const [accommodations, setAccommodations] = useState([]);
  const [accommodationId, setAccommodationId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5030/api/Accommodation/supplier/${supplierId}`
      );
      const rawData = res.data;
      const data = Array.isArray(rawData) ? rawData : rawData?.$values || [];

      const active = data.filter(
        (a) => a.status?.toLowerCase() === "available"
      ).length;

      setAccommodations(data);
      setDashboardStats((prev) => ({
        ...prev,
        totalAccommodations: data.length,
        activeAccommodations: active,
      }));
    } catch (error) {
      console.error("Fetch accommodations failed:", error);
      setAccommodations(fallbackAccommodations);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!accommodationId) return;

    try {
      const res = await axios.get(
        `http://localhost:5030/api/AccommodationReservation/accommodation/${accommodationId}`
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
      const revenue = thisMonth.reduce(
        (sum, b) =>
          sum + (typeof b.totalAmount === "number" ? b.totalAmount : 0),
        0
      );

      setBookings(data);
      setDashboardStats((prev) => ({
        ...prev,
        totalBookings: data.length,
        monthlyBookings: thisMonth.length,
        monthlyRevenue: revenue,
      }));
    } catch (error) {
      console.error("Fetch bookings failed:", error);
      setBookings(fallbackBookings);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updated =
        (currentStatus ?? "").toLowerCase() === "available"
          ? "Unavailable"
          : "Available";
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

  const handleViewBookings = (id) => {
    setAccommodationId(id);
    setActiveTab("bookings");
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5030/api/AccommodationReservation/${bookingId}/status`,
        { status: newStatus }
      );
      showTemporaryAlert(`Booking ${newStatus.toLowerCase()}.`);
      fetchBookings();
    } catch {
      showTemporaryAlert("Failed to update booking status.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Delete this rejected booking?")) {
      try {
        await axios.delete(
          `http://localhost:5030/api/AccommodationReservation/${bookingId}`
        );
        showTemporaryAlert("Booking deleted.");
        fetchBookings();
      } catch {
        showTemporaryAlert("Failed to delete booking.");
      }
    }
  };

  useEffect(() => {
    if (supplierId) fetchAccommodations();
    if (accommodationId) fetchBookings();
  }, [supplierId, accommodationId]);

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
                    onViewBookings={() => handleViewBookings(acc.id)}
                  />
                ))
              )}
            </div>
          </Tab>

          <Tab eventKey="bookings" title="Bookings">
            <div className="bookings-table">
              {bookings.length === 0 ? (
                <p>No bookings available.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Accommodation</th>
                      <th>Customer</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => {
                      const status = b.status ?? "Pending";
                      const amount =
                        typeof b.totalAmount === "number" ? b.totalAmount : 0;
                      const acc = accommodations.find(
                        (a) => a.id === b.accommodationId
                      );

                      return (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>{acc?.name || "Unknown"}</td>
                          <td>{b.customerName}</td>
                          <td>
                            {new Date(b.checkInDate).toLocaleDateString()} –{" "}
                            {new Date(b.checkOutDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                            {status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateBookingStatus(b.id, "Accepted")
                                  }>
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateBookingStatus(b.id, "Rejected")
                                  }>
                                  Reject
                                </button>
                              </>
                            )}
                            {status === "Rejected" && (
                              <button onClick={() => handleDeleteBooking(b.id)}>
                                🗑
                              </button>
                            )}
                          </td>
                          <td>Rs {amount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
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
