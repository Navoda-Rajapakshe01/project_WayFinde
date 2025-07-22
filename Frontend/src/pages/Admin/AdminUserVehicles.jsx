import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/UserTrips.css";

const AdminUserVehicles = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5030/api/vehicle");
        let data = res.data?.$values || res.data;
        const userVehicles = Array.isArray(data)
          ? data.filter(v => v.supplierId === userId || v.SupplierId === userId)
          : [];
        setVehicles(userVehicles);
      } catch (err) {
        setError("Failed to fetch vehicles.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchVehicles();
  }, [userId]);

  return (
    <div className="admin-user-trips-container">
      <h2 className="page-title">Vehicles</h2>
      {loading ? (
        <div className="admin-user-trips-loading">Loading vehicles...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : vehicles.length === 0 ? (
        <div className="admin-user-trips-empty">No vehicles found for this user.</div>
      ) : (
        <div className="admin-user-trips-grid">
          {vehicles.map(vehicle => (
            <div className="admin-trip-card" key={vehicle.id}>
              <div className="admin-trip-card-header">
                <span>{vehicle.brand} {vehicle.model}</span>
                <span className="admin-trip-card-badge">{vehicle.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
              <div className="admin-trip-card-content">
                <div className="admin-trip-card-dates">
                  <span>Type: {vehicle.type}</span>
                  <span>Price Per Day: {vehicle.pricePerDay}</span>
                </div>
                <div className="admin-trip-card-places">
                  <strong>Vehicle ID:</strong> {vehicle.id}
                </div>
                <div className="admin-trip-card-destinations">
                  <ul>
                    <li><strong>Number of Passengers:</strong> {vehicle.numberOfPassengers}</li>
                    <li><strong>Fuel Type:</strong> {vehicle.fuelType}</li>
                    <li><strong>Transmission:</strong> {vehicle.transmissionType}</li>
                    <li><strong>Location:</strong> {vehicle.location}</li>
                    <li><strong>District ID:</strong> {vehicle.districtId}</li>
                    <li><strong>Supplier ID:</strong> {vehicle.supplierId}</li>
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

export default AdminUserVehicles; 