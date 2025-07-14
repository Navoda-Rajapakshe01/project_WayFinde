import React, { useEffect, useState } from 'react';
import './DashboardImage.css'; 
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030/api';

const DashboardImage = ({ tripId }) => {
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!tripId) return;
    // 1. Get all places for this trip
    axios.get(`${API_URL}/TripPlaces?tripId=${tripId}`)
      .then(res => {
        const tripPlaces = res.data;
        if (tripPlaces && tripPlaces.length > 0) {
          // 2. Get the first place's details
          const firstPlaceId = tripPlaces[tripId-1].placeId || tripPlaces[tripId-1].PlaceId;
          if (firstPlaceId) {
            axios.get(`${API_URL}/Places/${firstPlaceId}`)
              .then(placeRes => {
                setMainImageUrl(placeRes.data.mainImageUrl);
              })
              .catch(() => setMainImageUrl(null));
          } else {
            setMainImageUrl(null);
          }
        } else {
          setMainImageUrl(null);
        }
      })
      .catch(() => setMainImageUrl(null));

    axios.get(`http://localhost:5030/api/trips/${tripId}`)
      .then(res => {
        setTripName(res.data.name); // Adjust if your property is different
        // Format dates for display
        if (res.data.startDate) {
          setStartDate(new Date(res.data.startDate).toLocaleDateString());
        } else {
          setStartDate('');
        }
        if (res.data.endDate) {
          setEndDate(new Date(res.data.endDate).toLocaleDateString());
        } else {
          setEndDate('');
        }
      })
      .catch(() => {
        setTripName('');
        setStartDate('');
        setEndDate('');
      });
  }, [tripId]);

  if (!mainImageUrl) {
    return null; // or a placeholder if you want
  }

  return (
    <div className="dashboard-image-card">
      <img
        src={mainImageUrl}
        alt="Trip Location"
        className="dashboard-image"
      />
      <div className="overlay-info">
        <h2 className="trip-title">{tripName}</h2>
        <div className="info-item">
          <FaCalendarAlt className="icon" />
          <span>Start Date: {startDate} - End Date: {endDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardImage;