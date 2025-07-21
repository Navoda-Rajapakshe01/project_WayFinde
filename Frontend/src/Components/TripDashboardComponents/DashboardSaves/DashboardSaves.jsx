import React, { useState } from 'react';
import './DashboardSaves.css';
import SavesComment from '../SavesComment/SavesComment';
import ToDoShow from '../To-DoShow/To-DoShow';
import BudgetShow from '../BudgetShow/BudgetShow';

function DashboardSaves({ tripId }) {
  const [hotelComments, setHotelComments] = useState([]);
  const [vehicleComments, setVehicleComments] = useState([]);
  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [showBudgetPopup, setShowBudgetPopup] = useState(false);

  return (
    <div className="dashboard-saves-container">
      {/* Hotel Section */}
      <div className="saves-section">
        <h2>Places to stay</h2>
        <div className="saves-card">
          <img src="https://www.andbeyond.com/wp-content/uploads/sites/5/Galle-Fort-Hotel-Galle-Guest-Pool.jpg" alt="Hotel" className="saves-card-img" />
          <div className="hotel-details">
            <h3><b>Galle Fort Hotel</b></h3>
            <p>4.5-star hotel</p>
            <div className="rating">
              <span>★★★★☆</span>
              <span>84</span>
            </div>
            
            {/* Use the SavesComment component for hotel comments */}
            <SavesComment
              section="hotel"
              comments={hotelComments}
              setComments={setHotelComments}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Section */}
      <div className="saves-section">
        <h2>Vehicle Rent</h2>
        <div className="saves-card">
          <img src="https://cdn.bajajauto.com/-/media/assets/bajajauto/360degreeimages/3-wheelers-and-qute/re/diesel/eco-green/webp-new/00.png" alt="Vehicle" className="saves-card-img" />
          <div className="hotel-details">
            <h3><b>Bajaj RE Three Wheeler</b></h3>
            <p className="availability">Available</p>
            <div className="vehicle-specs">
              <span>3 Seats</span>
              <span>2 Bags</span>
            </div>
            
            {/* Use the SavesComment component for vehicle comments */}
            <SavesComment
              section="vehicle"
              comments={vehicleComments}
              setComments={setVehicleComments}
            />
          </div>
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