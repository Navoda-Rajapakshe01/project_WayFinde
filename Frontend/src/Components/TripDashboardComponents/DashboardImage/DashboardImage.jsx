import React, { useEffect, useState } from 'react';
import './DashboardImage.css';
import { FaCalendarAlt, FaMapMarkerAlt, FaCog, FaTimes, FaCalendar, FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030/api';

const DashboardImage = ({ tripId }) => {
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTripName, setEditTripName] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const handleSettingsClick = () => {
    setEditTripName(tripName);
    setEditStartDate(startDate);
    setEditEndDate(endDate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const incrementStartDate = () => {
    if (editStartDate) {
      const currentDate = new Date(editStartDate);
      currentDate.setDate(currentDate.getDate() + 1);
      setEditStartDate(currentDate.toLocaleDateString());
    } else {
      // If no start date, set to today
      const today = new Date();
      setEditStartDate(today.toLocaleDateString());
    }
  };

  const decrementStartDate = () => {
    if (editStartDate) {
      const currentDate = new Date(editStartDate);
      currentDate.setDate(currentDate.getDate() - 1);
      setEditStartDate(currentDate.toLocaleDateString());
    }
  };

  const incrementEndDate = () => {
    if (editEndDate) {
      const currentDate = new Date(editEndDate);
      currentDate.setDate(currentDate.getDate() + 1);
      setEditEndDate(currentDate.toLocaleDateString());
    } else if (editStartDate) {
      // If no end date but start date exists, set end date to start date + 1
      const startDateObj = new Date(editStartDate);
      startDateObj.setDate(startDateObj.getDate() + 1);
      setEditEndDate(startDateObj.toLocaleDateString());
    }
  };

  const decrementEndDate = () => {
    if (editEndDate && editStartDate) {
      const currentEndDate = new Date(editEndDate);
      const startDateObj = new Date(editStartDate);
      
      if (currentEndDate > startDateObj) {
        currentEndDate.setDate(currentEndDate.getDate() - 1);
        setEditEndDate(currentEndDate.toLocaleDateString());
      }
    }
  };

  const handleSave = async () => {
    try {
      // Update trip name and dates
      await axios.put(`${API_URL}/trips/${tripId}`, {
        name: editTripName,
        startDate: editStartDate,
        endDate: editEndDate
        // Add other fields as needed
      });
      
      // Update local state
      setTripName(editTripName);
      setStartDate(editStartDate);
      setEndDate(editEndDate);
      setIsModalOpen(false);
      
      // You can add success notification here
      console.log('Trip updated successfully');
    } catch (error) {
      console.error('Error updating trip:', error);
      // You can add error notification here
    }
  };

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
    <>
      <div className="dashboard-image-card">
        <img 
          src={mainImageUrl} 
          alt={tripName} 
          className="dashboard-image" 
        />
        
        {/* Settings Icon */}
        <div className="settings-icon" onClick={handleSettingsClick}>
          <FaCog className="settings-icon-svg" />
        </div>
        
        <div className="overlay-info">
          <h2 className="trip-title">{tripName}</h2>
          <div className="info-item">
            <FaCalendarAlt className="icon" />
            <span>Start Date: {startDate} - End Date: {endDate}</span>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit trip details</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Trip name</label>
                <input
                  type="text"
                  value={editTripName}
                  onChange={(e) => setEditTripName(e.target.value)}
                  className="form-input"
                  placeholder="Enter trip name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
                <div className="date-counter-wrapper">
                  <div className="date-display">
                    <span className="date-text">{editStartDate || 'Select start date'}</span>
                  </div>
                  <div className="date-controls">
                    <button 
                      type="button" 
                      className="date-btn decrease-btn"
                      onClick={decrementStartDate}
                    >
                      <FaMinus />
                    </button>
                    <button 
                      type="button" 
                      className="date-btn increase-btn"
                      onClick={incrementStartDate}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <div className="date-counter-wrapper">
                  <div className="date-display">
                    <span className="date-text">{editEndDate || 'Select end date'}</span>
                  </div>
                  <div className="date-controls">
                    <button 
                      type="button" 
                      className="date-btn decrease-btn"
                      onClick={decrementEndDate}
                    >
                      <FaMinus />
                    </button>
                    <button 
                      type="button" 
                      className="date-btn increase-btn"
                      onClick={incrementEndDate}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save button moved inside modal body */}
              <div className="saved-button-container">
                <button className="saved-button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardImage;