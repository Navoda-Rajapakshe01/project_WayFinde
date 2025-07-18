import React, { useEffect, useState } from "react";
import axios from "axios";
import AccommodationForm from "./AccommodationForm";
import AccommodationCard from "./AccommodationCard";
import Alert from "../Alert";
import HeroSection from "../../Components/HeroSection/HeroSection";
import { Tabs, Tab } from "react-bootstrap";

const AccommodationSupplier = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState("");
  const [activeTab, setActiveTab] = useState("listings");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalAccommodations: 0,
    activeAccommodations: 0,
    totalBookings: 0,
    monthlyBookings: 0,
    monthlyRevenue: 0,
  });

  // Fetch accommodations from API
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5030/api/accommodation");
      setAccommodations(res.data);

      // Calculate dashboard stats for accommodations
      const totalAccommodations = res.data.length;
      const activeAccommodations = res.data.filter(
        (a) => a.status === "Available"
      ).length;

      setDashboardStats((prev) => ({
        ...prev,
        totalAccommodations,
        activeAccommodations,
        totalBookings: bookings.length, // Updated after bookings fetch
      }));

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch accommodations", error);
      setLoading(false);
    }
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5030/api/AccommodationReservation"
      );
      setBookings(res.data);

      const totalBookings = res.data.length;

      // Calculate monthly bookings and revenue
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );

      const monthlyBookings = res.data.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= firstDayOfMonth;
      });

      const monthlyRevenue = monthlyBookings.reduce(
        (total, booking) => total + booking.totalAmount,
        0
      );

      setDashboardStats((prev) => ({
        ...prev,
        totalBookings,
        monthlyBookings: monthlyBookings.length,
        monthlyRevenue,
      }));
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  // Toggle accommodation availability status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedStatus =
        currentStatus === "Available" ? "Unavailable" : "Available";
      await axios.put(`http://localhost:5030/api/Accommodation/${id}/status`, {
        status: updatedStatus,
      });
      await fetchAccommodations();
      setAlert("Accommodation status updated.");
    } catch (error) {
      setAlert("Failed to update status.");
    } finally {
      setTimeout(() => setAlert(""), 3000);
    }
  };

  // Delete accommodation by id
  const handleDeleteAccommodation = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await axios.delete(`http://localhost:5030/api/accommodation/${id}`);
        await fetchAccommodations();
        setAlert("Accommodation deleted successfully.");
      } catch (error) {
        setAlert("Failed to delete accommodation.");
      } finally {
        setTimeout(() => setAlert(""), 3000);
      }
    }
  };

  // Edit accommodation placeholder
  const handleEditAccommodation = (accommodation) => {
    setAlert("Edit functionality will be implemented soon.");
    setTimeout(() => setAlert(""), 3000);
  };

  // Fetch bookings for specific accommodation and switch tab
  const handleViewBookings = async (accommodationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5030/api/AccommodationReservation/accommodation/${accommodationId}`
      );
      setBookings(res.data);
      setActiveTab("bookings");
    } catch (error) {
      setAlert("Failed to fetch bookings for this accommodation.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  // Update booking status (Confirm, Reject, etc.)
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5030/api/AccommodationReservation/${bookingId}/status`,
        { status: newStatus }
      );
      console.log("Booking status updated:", newStatus);
      setAlert(`Booking ${newStatus.toLowerCase()}.`);
      await fetchBookings();
    } catch (error) {
      setAlert("Failed to update booking status.");
    } finally {
      setTimeout(() => setAlert(""), 3000);
    }
  };

  // Delete booking (only for rejected bookings)
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Delete this rejected booking?")) {
      try {
        await axios.delete(
          `http://localhost:5030/api/AccommodationReservation/${bookingId}`
        );
        setAlert("Booking deleted.");
        await fetchBookings();
      } catch (error) {
        setAlert("Failed to delete booking.");
      } finally {
        setTimeout(() => setAlert(""), 3000);
      }
    }
  };

  // Initial data fetch on mount
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
          <h2 className="section-title">My Accommodation Listings</h2>
          <button className="post-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "+ Post New Accommodation"}
          </button>
        </div>

        {showForm && (
          <div className="accommodation-form-container">
            <AccommodationForm
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                fetchAccommodations();
                setAlert("Accommodation posted successfully.");
                setTimeout(() => setAlert(""), 3000);
              }}
              onFail={() => {
                setAlert("Failed to post accommodation.");
                setTimeout(() => setAlert(""), 3000);
              }}
            />
          </div>
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="supplier-tabs mb-4">
          {/* Dashboard Tab */}
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
                            )?.name || "Unknown Accommodation"}
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

          {/* Listings Tab */}
          <Tab eventKey="listings" title="Your Accommodations">
            <div className="accommodation-grid">
              {accommodations.length === 0 ? (
                <div className="no-accommodations">
                  <p>
                    You haven't added any accommodations yet. Click "Post New
                    Accommodation" to get started.
                  </p>
                </div>
              ) : (
                accommodations.map((accommodation) => (
                  <AccommodationCard
                    key={accommodation.id}
                    accommodation={accommodation}
                    onDelete={handleDeleteAccommodation}
                    onEdit={handleEditAccommodation}
                    onToggleStatus={handleToggleStatus}
                    onViewBookings={handleViewBookings}
                  />
                ))
              )}
            </div>
          </Tab>

          {/* Bookings Tab */}
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => {
                      const status = booking.status ?? "Pending";
                      const amount =
                        typeof booking.totalAmount === "number"
                          ? booking.totalAmount
                          : 0;

                      return (
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
                            –{" "}
                            {new Date(
                              booking.checkOutDate
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                          </td>
                          <td>Rs {amount.toFixed(2)}</td>
                          <td>
                            {status.toLowerCase() === "pending" && (
                              <>
                                <button
                                  className="btn-confirm"
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "Confirmed"
                                    )
                                  }>
                                  Confirm
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() =>
                                    handleUpdateBookingStatus(
                                      booking.id,
                                      "Rejected"
                                    )
                                  }>
                                  Reject
                                </button>
                              </>
                            )}
                            {status.toLowerCase() === "rejected" && (
                              <button
                                className="btn-delete"
                                onClick={() => handleDeleteBooking(booking.id)}>
                                Delete
                              </button>
                            )}
                            {["confirmed", "completed"].includes(
                              status.toLowerCase()
                            ) && <span className="action-none">—</span>}
                          </td>
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
