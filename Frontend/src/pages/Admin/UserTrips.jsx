import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/UserTrips.css";

const UserTrips = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5030/api/trips/user/${userId}`)
      .then(res => {
        const tripsArray = Array.isArray(res.data?.$values) ? res.data.$values : Array.isArray(res.data) ? res.data : [];
        setTrips(tripsArray);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="admin-user-trips-loading">Loading trips...</div>;

  return (
    <div className="admin-user-trips-container">
      <h2 className="page-title">User's Trips</h2>
      {trips.length === 0 ? (
        <p className="admin-user-trips-empty">No trips found.</p>
      ) : (
        <div className="admin-user-trips-grid">
          {trips.map(trip => (
            <div className="admin-trip-card" key={trip.id || trip.Id}>
              <div className="admin-trip-card-header">
                {trip.tripName || trip.TripName}
                <span className="admin-trip-card-badge">{trip.places ? trip.places.length : 0} Places</span>
              </div>
              <div className="admin-trip-card-content">
                <div className="admin-trip-card-dates">
                  <span>Start: {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "-"}</span>
                  <span>End: {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "-"}</span>
                </div>
                <div className="admin-trip-card-places">
                  <strong>Places:</strong> {trip.places ? trip.places.length : 0}
                </div>
                {trip.places && trip.places.length > 0 && (
                  <div className="admin-trip-card-destinations">
                    <strong>Destinations:</strong>
                    <ul>
                      {trip.places.map((place, idx) => (
                        <li key={place.id || idx}>{place.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTrips; 