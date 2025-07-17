import React, { useEffect, useState } from 'react';
import './DashboardImage.css';
import { FaCalendarAlt, FaCog, FaTimes, FaPlus, FaMinus, FaCheck } from 'react-icons/fa';
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const handleSettingsClick = () => {
    setEditTripName(tripName);
    setEditStartDate(startDate);
    setEditEndDate(endDate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowSuccessMessage(false);
    setIsLoading(false);
  };

  const incrementStartDate = () => {
    if (editStartDate) {
      const currentDate = new Date(editStartDate);
      currentDate.setDate(currentDate.getDate() + 1);
      setEditStartDate(currentDate.toLocaleDateString());
    } else {
      const today = new Date();
      setEditStartDate(today.toLocaleDateString());
    }
    setWarningMessage('');
  };

  const decrementStartDate = () => {
    if (editStartDate) {
      const currentDate = new Date(editStartDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      // Calculate what the new date would be after decreasing
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      
      // Check if the new date would be less than today
      if (newDate < today) {
        setWarningMessage("Can't decrease days below today's date");
        return;
      }
      
      setEditStartDate(newDate.toLocaleDateString());
    }
    setWarningMessage('');
  };

  const incrementEndDate = () => {
    if (editEndDate) {
      const currentDate = new Date(editEndDate);
      currentDate.setDate(currentDate.getDate() + 1);
      setEditEndDate(currentDate.toLocaleDateString());
    } else if (editStartDate) {
      const startDateObj = new Date(editStartDate);
      startDateObj.setDate(startDateObj.getDate() + 1);
      setEditEndDate(startDateObj.toLocaleDateString());
    }
    setWarningMessage('');
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
    setWarningMessage('');
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Convert dates to ISO format for API
      const formatDateForAPI = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString();
      };

      const updateData = {
        name: editTripName,
        startDate: formatDateForAPI(editStartDate),
        endDate: formatDateForAPI(editEndDate)
      };

      await axios.patch(`${API_URL}/Trips/${tripId}`, updateData);

      // Update local state with new values
      setTripName(editTripName);
      setStartDate(editStartDate);
      setEndDate(editEndDate);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
      console.log('Trip updated successfully');
    } catch (error) {
      console.error('Error updating trip:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!tripId) return;

    // Step 1: Get all trip places for this tripId
    axios.get(`${API_URL}/TripPlaces?tripId=${tripId}`)
      .then(res => {
        const tripPlaces = res.data;
        // Step 1: Filter by tripId
        const filteredTripPlaces = tripPlaces.filter(tp => tp.tripId === Number(tripId));
        // Step 2: Find the place with order === 0
        const firstPlace = filteredTripPlaces.find(tp => tp.order === 0);
        if (firstPlace && firstPlace.placeId) {
          // Step 3: Fetch the place details for that placeId
          axios.get(`${API_URL}/Places/${firstPlace.placeId}`)
            .then(placeRes => {
              setMainImageUrl(placeRes.data.mainImageUrl);
            })
            .catch(() => setMainImageUrl(null));
        } else {
          setMainImageUrl(null);
        }
      })
      .catch(() => setMainImageUrl(null));

    axios.get(`${API_URL}/Trips/${tripId}`)
      .then(res => {
        setTripName(res.data.tripName || res.data.name || '');
        setStartDate(res.data.startDate ? new Date(res.data.startDate).toLocaleDateString() : '');
        setEndDate(res.data.endDate ? new Date(res.data.endDate).toLocaleDateString() : '');
      })
      .catch(() => {
        setTripName('');
        setStartDate('');
        setEndDate('');
      });
  }, [tripId]);

  return (
    <>
      <div className="dashboard-image-card">
        {mainImageUrl ? (
          <img src={mainImageUrl} alt={tripName} className="dashboard-image" />
        ) : (
          <div className="dashboard-image-placeholder">No Image Available</div>
        )}

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

      {isModalOpen && (
        <div className="trip-modal-overlay" onClick={handleCloseModal}>
          <div className="trip-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="trip-modal-header">
              <h2 className="trip-modal-title">Edit trip details</h2>
              <button className="trip-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            {showSuccessMessage && (
              <div className="trip-success-message">
                
                <div className="success-content">
                  <span className="success-title">Success!</span>
                  <span className="success-subtitle">Trip details updated successfully</span>
                </div>
              </div>
            )}

            <div className="trip-modal-body">
              <div className="trip-form-group">
                <label className="trip-form-label">Trip name</label>
                <input
                  type="text"
                  value={editTripName}
                  onChange={(e) => setEditTripName(e.target.value)}
                  className="trip-form-input"
                  placeholder="Enter trip name"
                />
              </div>

              <div className="trip-form-group">
                <label className="trip-form-label">Start Date</label>
                <div className="trip-date-counter-wrapper">
                  <div className="trip-date-display">
                    <span className="trip-date-text">{editStartDate || 'Select start date'}</span>
                  </div>
                  <div className="trip-date-controls">
                    <button type="button" className="trip-date-btn trip-decrease-btn" onClick={decrementStartDate}>
                      <FaMinus />
                    </button>
                    <button type="button" className="trip-date-btn trip-increase-btn" onClick={incrementStartDate}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>

              <div className="trip-form-group">
                <label className="trip-form-label">End Date</label>
                <div className="trip-date-counter-wrapper">
                  <div className="trip-date-display">
                    <span className="trip-date-text">{editEndDate || 'Select end date'}</span>
                  </div>
                  <div className="trip-date-controls">
                    <button type="button" className="trip-date-btn trip-decrease-btn" onClick={decrementEndDate}>
                      <FaMinus />
                    </button>
                    <button type="button" className="trip-date-btn trip-increase-btn" onClick={incrementEndDate}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>

              <div className="trip-save-button-container">
                <button 
                  className={`trip-save-button ${isLoading ? 'loading' : ''}`} 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save'
                  )}
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