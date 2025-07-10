import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddTrip.css';

const TRIPS_API_URL = 'http://localhost:5030/api/Trips';
const TRIP_PLACES_API_URL = 'http://localhost:5030/api/TripPlaces';

const AddTrip = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Trip form state
  const [tripData, setTripData] = useState({
    Name: '',
    Description: '',
    StartDate: '',
    EndDate: '',
    TotalSpend: '',
    TripDistance: '',
    TripTime: '',
    UserId: ''
  });

  // Trip Places form state
  const [tripPlaceData, setTripPlaceData] = useState({
    tripId: '',
    placeId: ''
  });

  const handleTripChange = (e) => {
    const { name, value } = e.target;
    setTripData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleTripPlaceChange = (e) => {
    const { name, value } = e.target;
    setTripPlaceData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const tripFormData = {
        name: tripData.Name,
        description: tripData.Description,
        startDate: new Date(tripData.StartDate).toISOString(),
        endDate: new Date(tripData.EndDate).toISOString(),
        totalSpend: parseFloat(tripData.TotalSpend),
        tripDistance: parseFloat(tripData.TripDistance),
        tripTime: parseFloat(tripData.TripTime),
        userId: parseInt(tripData.UserId)
      };

      const response = await axios.post(TRIPS_API_URL, tripFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setSuccessMessage(`Trip created successfully! Trip ID: ${response.data.id}. You can now add places to this trip.`);
        // Clear the form
        setTripData({
          Name: '',
          Description: '',
          StartDate: '',
          EndDate: '',
          TotalSpend: '',
          TripDistance: '',
          TripTime: '',
          UserId: ''
        });
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error || 'Failed to add trip';
        setError(errorMessage);
      } else if (error.request) {
        setError('No response from server. Please check your connection and make sure the backend is running.');
      } else {
        setError('Error preparing request: ' + error.message);
      }
    }
  };

  const handleTripPlaceSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await axios.post(TRIP_PLACES_API_URL, {
        tripId: parseInt(tripPlaceData.tripId),
        placeId: parseInt(tripPlaceData.placeId)
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setSuccessMessage('Place added to trip successfully!');
        
        // Navigate to trip dashboard with the trip ID
        navigate(`/tripdashboard/${tripPlaceData.tripId}`);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error || 'Failed to add place to trip';
        setError(errorMessage);
      } else if (error.request) {
        setError('No response from server. Please check your connection and make sure the backend is running.');
      } else {
        setError('Error preparing request: ' + error.message);
      }
    }
  };

  return (
    <div className="add-trip-container">
      <h1 className="add-trip-title">Add New Trip</h1>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Trip Form */}
      <form onSubmit={handleTripSubmit} className="trip-form">
        <h2>Create New Trip</h2>
        <div className="form-group">
          <label>User ID</label>
          <input
            type="number"
            name="UserId"
            value={tripData.UserId}
            onChange={handleTripChange}
            required
            placeholder="Enter User ID"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="Name"
            value={tripData.Name}
            onChange={handleTripChange}
            required
            placeholder="Enter trip name"
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="Description"
            value={tripData.Description}
            onChange={handleTripChange}
            required
            placeholder="Enter trip description"
            maxLength="500"
          />
        </div>
         
          
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="datetime-local"
            name="StartDate"
            value={tripData.StartDate}
            onChange={handleTripChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            name="EndDate"
            value={tripData.EndDate}
            onChange={handleTripChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Spend (Rs :)</label>
          <input
            type="number"
            name="TotalSpend"
            value={tripData.TotalSpend}
            onChange={handleTripChange}
            step="0.01"
            required
            placeholder="Enter total spend"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Trip Distance (km)</label>
          <input
            type="number"
            name="TripDistance"
            value={tripData.TripDistance}
            onChange={handleTripChange}
            step="0.1"
            required
            placeholder="Enter trip distance"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Trip Time (hours)</label>
          <input
            type="number"
            name="TripTime"
            value={tripData.TripTime}
            onChange={handleTripChange}
            step="0.5"
            required
            placeholder="Enter trip time"
            min="0"
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
          >
            Create Trip
          </button>
        </div>
      </form>

      {/* Trip Places Form */}
      <form onSubmit={handleTripPlaceSubmit} className="trip-form">
        <h2>Add Place to Trip</h2>
        <div className="form-group">
          <label>Trip ID</label>
          <input
            type="number"
            name="tripId"
            value={tripPlaceData.tripId}
            onChange={handleTripPlaceChange}
            required
            placeholder="Enter Trip ID"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Place ID</label>
          <input
            type="number"
            name="placeId"
            value={tripPlaceData.placeId}
            onChange={handleTripPlaceChange}
            required
            placeholder="Enter Place ID"
            min="1"
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="submit-button"
          >
            Add Place to Trip
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrip; 