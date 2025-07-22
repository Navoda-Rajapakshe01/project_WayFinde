import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/UserTrips.css";

const FILTER_OPTIONS = [
  { label: "All Trips", value: "all" },
  { label: "Ongoing Trips", value: "ongoing" },
  { label: "Completed Trips", value: "completed" },
  { label: "Future Trips", value: "future" },
];

const UserTrips = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ongoing");

  useEffect(() => {
    axios.get(`http://localhost:5030/api/trips/user/${userId}`)
      .then(res => {
        const tripsArray = Array.isArray(res.data?.$values) ? res.data.$values : Array.isArray(res.data) ? res.data : [];
        setTrips(tripsArray);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="admin-user-trips-loading">Loading trips...</div>;

  // Categorize trips
  const now = new Date();
  const ongoingTrips = trips.filter(trip => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return start <= now && end >= now;
  });
  const completedTrips = trips.filter(trip => {
    const end = new Date(trip.endDate);
    return end < now;
  });
  const futureTrips = trips.filter(trip => {
    const start = new Date(trip.startDate);
    return start > now;
  });

  let filteredTrips = [];
  if (filter === "all") filteredTrips = trips;
  if (filter === "ongoing") filteredTrips = ongoingTrips;
  if (filter === "completed") filteredTrips = completedTrips;
  if (filter === "future") filteredTrips = futureTrips;

  return (
    <div className="admin-user-trips-container">
      <h2 className="page-title">User's Trips</h2>
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label htmlFor="trip-filter" style={{ fontWeight: 600, color: '#129bb3' }}>Filter:</label>
        <select
          id="trip-filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e3eaf3', fontSize: '1rem', color: '#1a3456' }}
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      {trips.length === 0 ? (
        <p className="admin-user-trips-empty">No trips found.</p>
      ) : (
        <div className="admin-user-trips-grid">
          {filteredTrips.length === 0 ? <p className="admin-user-trips-empty">No {FILTER_OPTIONS.find(opt => opt.value === filter).label.toLowerCase()}.</p> : filteredTrips.map(trip => (
            <div className="admin-trip-card" key={trip.id || trip.Id}>
              <div className="admin-trip-card-header">
                {trip.tripName || trip.TripName}
                <span className="admin-trip-card-badge" style={{background:'#e6f7f7', color:'#0a7c8c', marginLeft:'8px'}}> {
                  (Array.isArray(trip.places?.$values) ? trip.places.$values.length : (trip.places ? trip.places.length : 0))
                } Destinations</span>
              </div>
              <div className="admin-trip-card-content">
                <div className="admin-trip-card-dates">
                  <span>Start: {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "-"}</span>
                  <span>End: {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "-"}</span>
                </div>
                {(Array.isArray(trip.places?.$values) ? trip.places.$values : trip.places)?.length > 0 && (
                  <div className="admin-trip-card-destinations">
                    <strong>Destinations:</strong>
                    <ul>
                      {(Array.isArray(trip.places?.$values) ? trip.places.$values : trip.places).map((place, idx) => (
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