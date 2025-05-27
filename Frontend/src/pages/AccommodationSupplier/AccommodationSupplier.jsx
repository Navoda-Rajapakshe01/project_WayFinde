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

      // Calculate dashboard stats
      const totalAccommodations = res.data.length;
      const activeAccommodations = res.data.filter(
        (a) => a.status === "Available"
      ).length;

      // Set dashboard stats
      setDashboardStats((prev) => ({
        ...prev,
        totalAccommodations,
        activeAccommodations,
        totalBookings: bookings.length, // This will be updated after fetching bookings
        monthlyBookings: dashboardStats.monthlyBookings, // Will be updated after fetchBookings
        monthlyRevenue: dashboardStats.monthlyRevenue, // Will be updated after fetchBookings
      }));

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch accommodations", error);

      // Sample accommodations data for development
      const sampleAccommodations = [
        {
          id: 1,
          name: "Luxury Beachfront Villa",
          type: "Villa",
          location: "Bentota",
          pricePerNight: 250,
          imagePaths: ["https://via.placeholder.com/400x250?text=Luxury+Villa"],
          bedrooms: 4,
          bathrooms: 3,
          maxGuests: 8,
          amenities: [
            "Wi-Fi",
            "Pool",
            "Air Conditioning",
            "Kitchen",
            "Beach Access",
          ],
          description:
            "Beautiful beachfront villa with private pool and direct beach access.",
          status: "Available",
        },
        {
          id: 2,
          name: "Modern City Apartment",
          type: "Apartment",
          location: "Colombo",
          pricePerNight: 120,
          imagePaths: [
            "https://via.placeholder.com/400x250?text=Modern+Apartment",
          ],
          bedrooms: 2,
          bathrooms: 1,
          maxGuests: 4,
          amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "Gym Access"],
          description:
            "Stylish apartment in the heart of Colombo with city views.",
          status: "Booked",
        },
      ];

      setAccommodations(sampleAccommodations);
      setDashboardStats({
        totalAccommodations: sampleAccommodations.length,
        activeAccommodations: sampleAccommodations.filter(
          (a) => a.status === "Available"
        ).length,
        totalBookings: 7,
        monthlyBookings: 3,
        monthlyRevenue: 750,
      });

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

      // Update dashboard stats with booking info
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

      // Update dashboard stats
      setDashboardStats((prev) => ({
        ...prev,
        totalBookings,
        monthlyBookings: monthlyBookings.length,
        monthlyRevenue,
      }));
    } catch (error) {
      console.error("Failed to fetch bookings", error);

      // Sample bookings data for development
      const sampleBookings = [
        {
          id: 101,
          accommodationId: 1,
          accommodationName: "Luxury Beachfront Villa",
          customerName: "John Smith",
          checkInDate: "2025-05-20",
          checkOutDate: "2025-05-23",
          guests: 4,
          totalAmount: 750,
          status: "Confirmed",
          bookingDate: "2025-05-15",
          specialRequests: "Late check-in around 10pm",
        },
        {
          id: 102,
          accommodationId: 2,
          accommodationName: "Modern City Apartment",
          customerName: "Emma Johnson",
          checkInDate: "2025-05-25",
          checkOutDate: "2025-05-28",
          guests: 2,
          totalAmount: 360,
          status: "Pending",
          bookingDate: "2025-05-16",
          specialRequests: "High floor preferred",
        },
      ];

      setBookings(sampleBookings);

      // Update dashboard stats with sample booking data
      setDashboardStats((prev) => ({
        ...prev,
        totalBookings: sampleBookings.length,
        monthlyBookings: sampleBookings.length,
        monthlyRevenue: sampleBookings.reduce(
          (total, booking) => total + booking.totalAmount,
          0
        ),
      }));
    }
  };

  // Toggle accommodation status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedStatus =
        currentStatus === "Available" ? "Unavailable" : "Available";
      await axios.put(`http://localhost:5030/api/accommodation/${id}/status`, {
        status: updatedStatus,
      });
      fetchAccommodations();
      setAlert("Accommodation status updated.");

      // Auto-dismiss alert after 3 seconds
      setTimeout(() => setAlert(""), 3000);
    } catch (error) {
      setAlert("Failed to update status.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  // Delete accommodation
  const handleDeleteAccommodation = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      try {
        await axios.delete(`http://localhost:5030/api/accommodation/${id}`);
        fetchAccommodations();
        setAlert("Accommodation deleted successfully.");
        setTimeout(() => setAlert(""), 3000);
      } catch (error) {
        setAlert("Failed to delete accommodation.");
        setTimeout(() => setAlert(""), 3000);
      }
    }
  };

  // Edit accommodation
  const handleEditAccommodation = (accommodation) => {
    // You can implement the edit functionality here
    // For now, we'll just show an alert
    setAlert("Edit functionality will be implemented soon.");
    setTimeout(() => setAlert(""), 3000);
  };

  // View accommodation bookings
  const handleViewBookings = async (accommodationId) => {
    try {
      const res = await axios.get(
        `http://localhost:5030/api/AccommodationReservation/accommodation/${accommodationId}`
      );
      setBookings(res.data);
      setActiveTab("bookings");
    } catch (error) {
      console.error("Failed to fetch accommodation bookings", error);
      setAlert("Failed to fetch bookings for this accommodation.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAccommodations();
    fetchBookings();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your accommodations...</p>
        </div>
      </>
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
                  /
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
                </div>{" "}
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
                          {/* Find accommodation by matching ID */}
                          <td>
                            {accommodations.find(
                              (accommodation) =>
                                accommodation.id === booking.accommodationId
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
                accommodations.map((accommodation, index) => (
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
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        {/* Find accommodation by matching ID */}
                        <td>
                          {accommodations.find(
                            (accommodation) =>
                              accommodation.id === booking.accommodationId
                          )?.name || "Unknown Accommodation"}
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
