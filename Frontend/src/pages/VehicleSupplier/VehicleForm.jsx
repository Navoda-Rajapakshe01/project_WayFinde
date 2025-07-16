import React, { useEffect, useState } from "react";
import axios from "axios";
import VehicleForm from "./VehicleForm";
import VehicleCard from "./VehicleCard";
import Alert from "../Alert";
import HeroSection from "../../Components/HeroSection/HeroSection";
import "../CSS/VehicleSupplier.css";
import { Tabs, Tab } from "react-bootstrap";

const fallbackVehicles = [];
const fallbackBookings = [];

const VehicleSupplier = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    totalBookings: 0,
    monthlyBookings: 0,
    monthlyRevenue: 0,
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5030/api/vehicle");
      setVehicles(res.data);

      const totalVehicles = res.data.length;
      const activeVehicles = res.data.filter(
        (v) => (v.status ?? "").toLowerCase() === "available"
      ).length;

      setDashboardStats((prev) => ({
        ...prev,
        totalVehicles,
        activeVehicles,
      }));
    } catch (error) {
      console.error("Vehicle fetch failed, using fallback data.");
      setVehicles(fallbackVehicles);
      setDashboardStats((prev) => ({
        ...prev,
        totalVehicles: fallbackVehicles.length,
        activeVehicles: fallbackVehicles.filter(
          (v) => (v.status ?? "").toLowerCase() === "available"
        ).length,
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5030/api/VehicleReservations"
      );

      const bookingsData = res.data.map((b) => ({
        id: b.id,
        vehicleBrand: b.vehicle?.brand || "Unknown",
        vehicleModel: b.vehicle?.model || "",
        customerName: b.customerName,
        startDate: b.startDate,
        endDate: b.endDate,
        status: b.status,
        totalAmount: b.totalAmount,
        bookingDate: b.bookingDate,
      }));

      setBookings(bookingsData);

      const current = new Date();
      const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);

      const monthlyBookings = bookingsData.filter(
        (b) => new Date(b.bookingDate) >= firstDay
      );
      const monthlyRevenue = monthlyBookings.reduce(
        (sum, b) =>
          sum + (typeof b.totalAmount === "number" ? b.totalAmount : 0),
        0
      );

      setDashboardStats((prev) => ({
        ...prev,
        totalBookings: bookingsData.length,
        monthlyBookings: monthlyBookings.length,
        monthlyRevenue,
      }));
    } catch (error) {
      console.error("Booking fetch failed, using fallback data.");
      setBookings(fallbackBookings);
      setDashboardStats((prev) => ({
        ...prev,
        totalBookings: fallbackBookings.length,
        monthlyBookings: fallbackBookings.length,
        monthlyRevenue: fallbackBookings.reduce(
          (sum, b) =>
            sum + (typeof b.totalAmount === "number" ? b.totalAmount : 0),
          0
        ),
      }));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        (currentStatus ?? "").toLowerCase() === "available"
          ? "Rented"
          : "Available";
      await axios.put(`http://localhost:5030/api/vehicle/${id}/status`, {
        status: newStatus,
      });
      await fetchVehicles();
      setAlert("Vehicle status updated.");
    } catch {
      setAlert("Status update failed.");
    } finally {
      setTimeout(() => setAlert(""), 3000);
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await axios.delete("http://localhost:5030/api/vehicle/${id}");
        await fetchVehicles();
        setAlert("Vehicle deleted.");
      } catch {
        setAlert("Failed to delete vehicle.");
      } finally {
        setTimeout(() => setAlert(""), 3000);
      }
    }
  };

  const handleEditVehicle = (vehicle) => {
    setAlert("Edit functionality coming soon.");
    setTimeout(() => setAlert(""), 3000);
  };

  const handleViewBookings = async (vehicleId) => {
    try {
      const res = await axios.get(
        `http://localhost:5030/api/VehicleReservations/vehicle/${vehicleId}`
      );

      const bookingsData = res.data.map((b) => ({
        id: b.id,
        vehicleBrand: b.vehicle?.brand || "Unknown",
        vehicleModel: b.vehicle?.model || "",
        customerName: b.customerName,
        startDate: b.startDate,
        endDate: b.endDate,
        status: b.status,
        totalAmount: b.totalAmount,
        bookingDate: b.bookingDate,
      }));

      setBookings(bookingsData);
      setActiveTab("bookings");
    } catch {
      setAlert("Failed to load bookings for this vehicle.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        "http://localhost:5030/api/VehicleReservations/${bookingId}/status",
        { status: newStatus }
      );
      setAlert(`Booking ${newStatus.toLowerCase()}.`);
      fetchBookings();
    } catch {
      setAlert("Failed to update booking status.");
    } finally {
      setTimeout(() => setAlert(""), 3000);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Delete this rejected booking?")) {
      try {
        await axios.delete(
          `http://localhost:5030/api/VehicleReservations/${bookingId}`
        );
        setAlert("Booking deleted.");
        fetchBookings();
      } catch {
        setAlert("Failed to delete booking.");
      } finally {
        setTimeout(() => setAlert(""), 3000);
      }
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading your vehicles...</p>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        title="Manage Your Vehicles"
        subtitle="Add, edit, and track your vehicle listings"
        backgroundImage="https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg"
        color="white"
      />

      <div className="supplier-container">
        {alert && <Alert message={alert} />}

        <div className="supplier-header">
          <h2 className="section-title">My Vehicle Listings</h2>
          <button className="post-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "+ Post New Vehicle"}
          </button>
        </div>

        {showForm && (
          <VehicleForm
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchVehicles();
              setAlert("Vehicle posted.");
              setTimeout(() => setAlert(""), 3000);
            }}
            onFail={() => {
              setAlert("Vehicle post failed.");
              setTimeout(() => setAlert(""), 3000);
            }}
          />
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="supplier-tabs mb-4">
          <Tab eventKey="dashboard" title="Dashboard">
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Vehicles</h3>
                <div className="stat-value">{dashboardStats.totalVehicles}</div>
                <div className="stat-detail">
                  <span className="active-stat">
                    {dashboardStats.activeVehicles} available
                  </span>{" "}
                  /{" "}
                  <span className="inactive-stat">
                    {dashboardStats.totalVehicles -
                      dashboardStats.activeVehicles}{" "}
                    rented
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
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vehicle</th>
                      <th>Customer</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => {
                      const status = b.status ?? "Unknown";
                      const amount =
                        typeof b.totalAmount === "number" ? b.totalAmount : 0;

                      return (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>
                            {b.vehicleBrand} {b.vehicleModel}
                          </td>
                          <td>{b.customerName}</td>
                          <td>
                            {new Date(b.startDate).toLocaleDateString()} –{" "}
                            {new Date(b.endDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge status-${status.toLowerCase()}`}>
                              {status}
                            </span>
                          </td>
                          <td>Rs {amount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Tab>

          <Tab eventKey="listings" title="Your Vehicles">
            <div className="vehicle-grid">
              {vehicles.length === 0 ? (
                <p>You haven’t posted any vehicles yet.</p>
              ) : (
                vehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onToggleStatus={handleToggleStatus}
                    onDelete={() => handleDeleteVehicle(v.id)}
                    onEdit={() => handleEditVehicle(v)}
                    onViewBookings={() => handleViewBookings(v.id)}
                  />
                ))
              )}
            </div>
          </Tab>

          <Tab eventKey="bookings" title="Bookings">
            {bookings.length === 0 ? (
              <div className="no-bookings">
                <p>No bookings found.</p>
              </div>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle</th>
                    <th>Customer</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const status = b.status ?? "Pending";
                    const amount =
                      typeof b.totalAmount === "number" ? b.totalAmount : 0;

                    return (
                      <tr key={b.id}>
                        <td>#{b.id}</td>
                        <td>
                          {b.vehicleBrand} {b.vehicleModel}
                        </td>
                        <td>{b.customerName}</td>
                        <td>
                          {new Date(b.startDate).toLocaleDateString()} –{" "}
                          {new Date(b.endDate).toLocaleDateString()}
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
                                  handleUpdateBookingStatus(b.id, "Confirmed")
                                }>
                                Confirm
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() =>
                                  handleUpdateBookingStatus(b.id, "Rejected")
                                }>
                                Reject
                              </button>
                            </>
                          )}
                          {status.toLowerCase() === "rejected" && (
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteBooking(b.id)}>
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
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default VehicleSupplier;
