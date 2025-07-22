import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/UserTrips.css";

const AdminUserAccommodations = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5030/api/accommodation");
        let data = res.data?.$values || res.data;
        const userAccs = Array.isArray(data)
          ? data.filter(a => a.ownerId === userId || a.OwnerId === userId)
          : [];
        setAccommodations(userAccs);
      } catch (err) {
        setError("Failed to fetch accommodations.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchAccommodations();
  }, [userId]);

  return (
    <div className="admin-user-trips-container">
      <h2 className="page-title">Accommodations</h2>
      {loading ? (
        <div className="admin-user-trips-loading">Loading accommodations...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : accommodations.length === 0 ? (
        <div className="admin-user-trips-empty">No accommodations found for this user.</div>
      ) : (
        <div className="admin-user-trips-grid">
          {accommodations.map(acc => (
            <div className="admin-trip-card" key={acc.id}>
              <div className="admin-trip-card-header">
                <span>{acc.name}</span>
                <span className="admin-trip-card-badge">{acc.status}</span>
              </div>
              <div className="admin-trip-card-content">
                <div className="admin-trip-card-dates">
                  <span>Type: {acc.type}</span>
                  <span>Price Per Night: {acc.pricePerNight}</span>
                </div>
                <div className="admin-trip-card-places">
                  <strong>Accommodation ID:</strong> {acc.id}
                </div>
                <div className="admin-trip-card-destinations">
                  <ul>
                    <li><strong>Location:</strong> {acc.location || acc.address || 'N/A'}</li>
                    <li><strong>Rooms:</strong> {acc.rooms || 'N/A'}</li>
                    <li><strong>Max Guests:</strong> {acc.maxGuests || 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserAccommodations; 