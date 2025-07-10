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
          <img
            src="https://www.andbeyond.com/wp-content/uploads/sites/5/Galle-Fort-Hotel-Galle-Guest-Pool.jpg"
            alt="Hotel"
            className="saves-card-img"
          />
          <div className="hotel-details">
            <h3><b>Galle Fort Hotel</b></h3>
            <p>4.5-star hotel</p>
            <div className="rating">
              <span>★★★★☆</span>
              <span>84</span>
            </div>
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
          <img
            src="https://cdn.bajajauto.com/-/media/assets/bajajauto/360degreeimages/3-wheelers-and-qute/re/diesel/eco-green/webp-new/00.png"
            alt="Vehicle"
            className="saves-card-img"
          />
          <div className="hotel-details">
            <h3><b>Bajaj RE Three Wheeler</b></h3>
            <p className="availability">Available</p>
            <div className="vehicle-specs">
              <span>3 Seats</span>
              <span>2 Bags</span>
            </div>
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
        <div className="to-do-card">
          <div className="card-content-row">
            <p>
              Display the to-do list for the trip, outlining all tasks that need
              to be completed before and during the journey.
            </p>
            <button
              className="show-button"
              onClick={() => setShowTodoPopup(true)}
            >
              Show
            </button>
          </div>
        </div>
      </div>

      {/* Budget Section */}
      <div className="saves-section">
        <h2>Travel Budget</h2>
        <div className="budget-card">
          <div className="card-content-row">
            <p>
              Show the travel budget list, detailing all the expected expenses to
              ensure proper financial planning for trip.
            </p>
            <button
              className="show-button"
              onClick={() => setShowBudgetPopup(true)}
            >
              Show
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally render popups */}
      {showTodoPopup && <ToDoShow onClose={() => setShowTodoPopup(false)} tripId={tripId} />}
      {showBudgetPopup && <BudgetShow onClose={() => setShowBudgetPopup(false)} tripId={tripId} />}
    </div>
  );
}

export default DashboardSaves;
