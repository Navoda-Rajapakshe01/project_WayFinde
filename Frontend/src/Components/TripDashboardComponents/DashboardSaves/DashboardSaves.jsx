import React, { useState, useEffect } from 'react';
import './DashboardSaves.css';
import SavesComment from '../SavesComment/SavesComment';
import ToDoShow from '../To-DoShow/To-DoShow';
import BudgetShow from '../BudgetShow/BudgetShow';

function DashboardSaves({ tripId }) {
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [savedAccommodations, setSavedAccommodations] = useState([]);
  const [allAccommodations, setAllAccommodations] = useState([]);
  const [allAccommodationImages, setAllAccommodationImages] = useState([]);
  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);

  useEffect(() => {
    fetchSavedVehicles();
    fetchSavedAccommodations();
  }, [tripId]);

  const fetchSavedVehicles = async () => {
    try {
      // Get saved vehicles for this trip
      const response = await fetch(`http://localhost:5030/api/SavedVehicle/trip/${tripId}`);
      if (!response.ok) throw new Error();
      const tripSaved = await response.json();
      setSavedVehicles(tripSaved);

      // Get all vehicles
      const vRes = await fetch('http://localhost:5030/api/Vehicle');
      const vehiclesData = vRes.ok ? await vRes.json() : [];
      setAllVehicles(vehiclesData);

      // Get all vehicle images
      const imgRes = await fetch('http://localhost:5030/api/VehicleImage');
      const imagesData = imgRes.ok ? await imgRes.json() : [];
      setAllImages(imagesData);

      // Log info for each saved vehicle
      tripSaved.forEach(sv => {
        const vehicle = vehiclesData.find(v => v.id === sv.vehicleId);
        const imageObj = imagesData.find(img => img.vehicleId === sv.vehicleId);
        const imageUrl = imageObj ? imageObj.imageUrl : '/placeholder-vehicle.jpg';
        console.log('TripId:', sv.tripId, 'VehicleId:', sv.vehicleId, 'Vehicle:', vehicle, 'ImageUrl:', imageUrl);
      });
    } catch {
      setSavedVehicles([]);
    }
  };

  const fetchSavedAccommodations = async () => {
    try {
      // Get saved accommodations for this trip
      const response = await fetch(`http://localhost:5030/api/SavedAccommodation/trip/${tripId}`);
      if (!response.ok) throw new Error();
      const tripSaved = await response.json();
      setSavedAccommodations(tripSaved);

      // Get all accommodations
      const aRes = await fetch('http://localhost:5030/api/Accommodation');
      const accommodationsData = aRes.ok ? await aRes.json() : [];
      setAllAccommodations(accommodationsData);

      // Get all accommodation images
      const imgRes = await fetch('http://localhost:5030/api/AccommodationImage');
      const imagesData = imgRes.ok ? await imgRes.json() : [];
      setAllAccommodationImages(imagesData);

      // Log info for each saved accommodation
      tripSaved.forEach(sa => {
        const accommodation = accommodationsData.find(a => a.id === sa.accommodationId);
        const imageObj = imagesData.find(img => img.accommodationId === sa.accommodationId);
        const imageUrl = imageObj ? imageObj.imageUrl : '/placeholder-accommodation.jpg';
        console.log('TripId:', sa.tripId, 'AccommodationId:', sa.accommodationId, 'Accommodation:', accommodation, 'ImageUrl:', imageUrl);
      });
    } catch {
      setSavedAccommodations([]);
    }
  };

  return (
    <div className="dashboard-saves-container">
      {/* Saved Accommodation Section */}
      <div className="saves-section">
        <h2>Saved Accommodations</h2>
        <div className="saves-card-list">
          {savedAccommodations.length === 0 ? (
            <div>No accommodations saved for this trip.</div>
          ) : (
            savedAccommodations.map((sa) => {
              const accommodation = allAccommodations.find(a => a.id === sa.accommodationId);
              const imageObj = allAccommodationImages.find(img => img.accommodationId === sa.accommodationId);
              const imageUrl = imageObj ? imageObj.imageUrl : '/placeholder-accommodation.jpg';
              return (
                <div key={sa.accommodationId} className="saves-card">
                  <img src={imageUrl} alt={accommodation?.name || 'Accommodation'} className="saves-card-img" />
                  <div className="hotel-details">
                    <h3><b>{accommodation?.name}</b></h3>
                    <p>{accommodation?.type}</p>
                    <div className="vehicle-specs">
                      <span>{accommodation?.maxGuests} Guests</span>
                      <span>Rs:{accommodation?.pricePerNight}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Saved Vehicles Section */}
      <div className="saves-section">
        <h2>Saved Vehicles</h2>
        <div className="saves-card-list">
          {savedVehicles.length === 0 ? (
            <div>No vehicles saved for this trip.</div>
          ) : (
            savedVehicles.map((sv) => {
              const vehicle = allVehicles.find(v => v.id === sv.vehicleId);
              const imageObj = allImages.find(img => img.vehicleId === sv.vehicleId);
              const imageUrl = imageObj ? imageObj.imageUrl : '/placeholder-vehicle.jpg';
              return (
                <div key={sv.vehicleId} className="saves-card">
                  <img src={imageUrl} alt={vehicle?.brand || 'Vehicle'} className="saves-card-img" />
                  <div className="hotel-details">
                    <h3><b>{vehicle?.brand} {vehicle?.model}</b></h3>
                    <p>{vehicle?.type}</p>
                    <div className="vehicle-specs">
                      <span>{vehicle?.numberOfPassengers} Passengers</span>
                      <span>{vehicle?.fuelType}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* To-Do List Section */}
      <div className="saves-section">
        <h2>To-Do List</h2>
        <div className="to-do-card enhanced-dashboard-card">
          <div className="dashboard-card-content">
            <div className="dashboard-card-title">Trip To-Do List</div>
            <div className="dashboard-card-desc">
              All tasks to complete before and during your journey are shown here. Stay organized and on track!
            </div>
          </div>
          <button
            className="arrow-button enhanced-arrow-button"
            onClick={() => setShowTodoPopup(true)}
            aria-label="Open To-Do List"
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Budget Section */}
      <div className="saves-section">
        <h2>Travel Budget</h2>
        <div className="budget-card enhanced-dashboard-card">
          <div className="dashboard-card-content">
            <div className="dashboard-card-title">Trip Budget Overview</div>
            <div className="dashboard-card-desc">
              See all expected expenses and keep your travel finances under control. Plan ahead for a stress-free trip!
            </div>
          </div>
          <button
            className="arrow-button enhanced-arrow-button"
            onClick={() => setShowBudgetPopup(true)}
            aria-label="Open Travel Budget"
          >
            &gt;
          </button>
        </div>
      </div>
      {/* Conditionally render popups */}
      {showTodoPopup && <ToDoShow onClose={() => setShowTodoPopup(false)} tripId={tripId} />}
      {showBudgetPopup && <BudgetShow onClose={() => setShowBudgetPopup(false)} tripId={tripId} />}
    </div>
  );
}

export default DashboardSaves;