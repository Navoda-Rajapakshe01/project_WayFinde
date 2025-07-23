import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import "./ProfileBookingContent.css";

const API_BASE_URL = "http://localhost:5030/api";

const ProfileBookingContent = () => {
  const [vehicleReservations, setVehicleReservations] = useState([]);
  const [accommodationReservations, setAccommodationReservations] = useState(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setLoading(false); // Add this line to stop loading if no token
        return;
      }

      // Fetch vehicle reservations
      const vehicleRes = await axios.get(
        `${API_BASE_URL}/vehiclereservations/uservehicles`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // Add timeout to prevent hanging requests
        }
      );

      // Fetch accommodation reservations
      const accommodationRes = await axios.get(
        `${API_BASE_URL}/accommodationreservation/useraccommodations`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000, // Add timeout to prevent hanging requests
        }
      );

      console.log("Vehicle reservations:", vehicleRes.data);
      console.log("Accommodation reservations:", accommodationRes.data);

      // Ensure we're setting arrays to state
      setVehicleReservations(
        Array.isArray(vehicleRes.data) ? vehicleRes.data : []
      );
      setAccommodationReservations(
        Array.isArray(accommodationRes.data) ? accommodationRes.data : []
      );
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError(
        `Failed to load your bookings: ${err.message || "Unknown error"}`
      );
    } finally {
      // This is the critical line you're missing!
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "yyyy/MM/dd");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return <div className="loading-container">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div>
      <div className="booked-vehicle-container">
        <div className="booked-vehicles-header">
          <button className="booked-vehicles-btn">Booked vehicles</button>
        </div>

        {vehicleReservations.length === 0 ? (
          <div className="no-bookings">
            `You don&apos;t have any vehicle bookings yet.`
          </div>
        ) : (
          vehicleReservations.map((reservation) => (
            <div className="vehicle-card" key={reservation.id}>
              <div className="vehicle-content">
                <div className="vehicle-image-section">
                  <img
                    src={
                      reservation.vehicleImage ||
                      "https://via.placeholder.com/300/200?text=No+Image"
                    }
                    alt={reservation.vehicleName}
                    className="vehicle-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300/200?text=Image+Error";
                    }}
                  />
                </div>

                <div className="vehicle-details">
                  <h2 className="vehicle-title">{reservation.vehicleName}</h2>
                  <div className="booked-date">
                    <span className="booked-date-label">Booked Date: </span>
                    <span className="booked-date-value">
                      {formatDate(reservation.bookingDate)}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Vehicle Number: </span>
                    <span className="booked-date-value">
                      {reservation.vehicleNumber}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">
                      Service Provider:{" "}
                    </span>
                    <span className="booked-date-value">
                      {reservation.serviceProvider}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Start Date: </span>
                    <span className="booked-date-value">
                      {formatDate(reservation.startDate)}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">End Date: </span>
                    <span className="booked-date-value">
                      {formatDate(reservation.endDate)}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Pickup Location: </span>
                    <span className="booked-date-value">
                      {reservation.pickupLocation}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Return Location: </span>
                    <span className="booked-date-value">
                      {reservation.returnLocation}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Total Amount: </span>
                    <span className="booked-date-value">
                      Rs {reservation.totalAmount}
                    </span>
                  </div>
                  {reservation.tripId && (
                    <div className="booked-date">
                      <span className="booked-date-label">Trip: </span>
                      <span className="booked-date-value">
                        Trip #{reservation.tripId}
                      </span>
                    </div>
                  )}
                  <div className="booking-status">
                    <span
                      className={`status-badge ${(
                        reservation.status || "pending"
                      ).toLowerCase()}`}
                    >
                      {reservation.status || "Pending"}
                    </span>
                    <span
                      className={`status-badge ${(
                        reservation.status || "pending"
                      ).toLowerCase()}`}
                    >
                      {reservation.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="booked-vehicle-container">
        <div className="booked-vehicles-header">
          <button className="booked-vehicles-btn">Booked Accommodation</button>
        </div>

        {accommodationReservations.length === 0 ? (
          <div className="no-bookings">
            You don't have any accommodation bookings yet.
          </div>
        ) : (
          accommodationReservations.map((reservation) => (
            <div className="vehicle-card" key={reservation.id}>
              <div className="vehicle-content">
                <div className="vehicle-image-section">
                  <img
                    src={
                      reservation.accommodationImage ||
                      "https://via.placeholder.com/300/200?text=No+Image"
                    }
                    alt={reservation.accommodationName}
                    className="vehicle-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300/200?text=Image+Error";
                    }}
                  />
                </div>

                <div className="vehicle-details">
                  <h2 className="vehicle-title">
                    {reservation.accommodationName}
                  </h2>
                  <div className="booked-date">
                    <span className="booked-date-label">Booked Date: </span>
                    <span className="booked-date-value">
                      {formatDate(reservation.bookingDate)}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">
                      Service Provider:{" "}
                    </span>
                    <span className="booked-date-value">
                      {reservation.serviceProvider}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Start Date: </span>
                    <span className="booked-date-value">
                      {formatDate(reservation.startDate)}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">End Date: </span>
                    <span className="booked-date-value">
                      {formatDate(reservation.endDate)}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Guests: </span>
                    <span className="booked-date-value">
                      {reservation.guests}
                    </span>
                  </div>
                  <div className="booked-date">
                    <span className="booked-date-label">Total Amount: </span>
                    <span className="booked-date-value">
                      Rs {reservation.totalAmount}
                    </span>
                  </div>
                  {reservation.tripId && (
                    <div className="booked-date">
                      <span className="booked-date-label">Trip: </span>
                      <span className="booked-date-value">
                        Trip #{reservation.tripId}
                      </span>
                    </div>
                  )}
                  <div className="booking-status">
                    <span
                      className={`status-badge ${reservation.status.toLowerCase()}`}
                    >
                      {reservation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfileBookingContent;
