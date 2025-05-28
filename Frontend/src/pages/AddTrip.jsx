import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddTrip.css';

const API_BASE_URL = 'http://localhost:5030/api/Trips';

const AddTrip = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [placeIds, setPlaceIds] = useState(['']); // Array to store place IDs for TripPlaces

  const [tripData, setTripData] = useState({
    Id: '',
    Name: '',
    Description: '',
    StartDate: '',
    EndDate: '',
    TotalSpend: '',
    TripDistance: '',
    TripTime: '',
    UserId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  // Handle change for place IDs input
  const handlePlaceIdChange = (index, value) => {
    const newPlaceIds = [...placeIds];
    // Ensure the input is a valid positive number
    const placeId = value.replace(/\D/g, '');
    newPlaceIds[index] = placeId;
    setPlaceIds(newPlaceIds);
  };

  // Add new place ID input field
  const addPlaceId = () => {
    setPlaceIds([...placeIds, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Filter out empty place IDs and convert to numbers
      const validPlaceIds = placeIds
        .filter(id => id.trim() !== '')
        .map(id => parseInt(id));

      // First, create the trip
      const tripFormData = {
        id: parseInt(tripData.Id),
        name: tripData.Name,
        description: tripData.Description,
        startDate: new Date(tripData.StartDate).toISOString(),
        endDate: new Date(tripData.EndDate).toISOString(),
        totalSpend: parseFloat(tripData.TotalSpend),
        tripDistance: parseFloat(tripData.TripDistance),
        tripTime: parseFloat(tripData.TripTime),
        userId: parseInt(tripData.UserId),
        tripPlaces: [] // Initialize empty array
      };

      // Create the trip first
      const tripResponse = await axios.post(API_BASE_URL, tripFormData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (tripResponse.data && tripResponse.data.id) {
        // Now create the TripPlaces entries
        const tripId = tripResponse.data.id;
        
        // Use the batch endpoint to add all places at once
        await axios.post(`${API_BASE_URL}/places/batch`, {
          tripId: tripId,
          placeIds: validPlaceIds
        });

        console.log('Trip and places added successfully!');
        alert('Trip and places added successfully!');
        navigate('/trips');
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

  return (
    <div className="add-trip-container">
      <h1 className="add-trip-title">Add New Trip</h1>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label>Trip ID</label>
          <input
            type="number"
            name="Id"
            value={tripData.Id}
            onChange={handleChange}
            required
            placeholder="Enter Trip ID"
            min="1"
          />
        </div>

        <div className="form-group">
          <label>User ID</label>
          <input
            type="number"
            name="UserId"
            value={tripData.UserId}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            name="EndDate"
            value={tripData.EndDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Total Spend (Rs :)</label>
          <input
            type="number"
            name="TotalSpend"
            value={tripData.TotalSpend}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            step="0.5"
            required
            placeholder="Enter trip time"
            min="0"
          />
        </div>

        {/* Visit Places Section */}
        <div className="visit-places-section">
          <h3>Trip Places</h3>
          {placeIds.map((placeId, index) => (
            <div key={index} className="form-group">
              <label>Place ID {index + 1}</label>
              <input
                type="number"
                value={placeId}
                onChange={(e) => handlePlaceIdChange(index, e.target.value)}
                placeholder="Enter Place ID from Places table"
                min="1"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addPlaceId}
            className="add-place-button"
          >
            Add Another Place ID
          </button>
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
            Add Trip
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTrip; 