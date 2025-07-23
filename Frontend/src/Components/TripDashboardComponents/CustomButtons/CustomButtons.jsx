import React, { useState } from "react";
import "./CustomButtons.css";
import TodoList from "../ToDoList/ToDoList";
import TravelBudget from "../TravelBudget/TravelBudget";
import VehicleRent from "../VehicleRent/VehicleRent";
import PlacesToStay from "../PlacesToStay/PlacesToStay";

const CustomButtons = ({ tripId, sharedMode }) => {
  console.log("CustomButtons received tripId:", tripId); // Debug log
  const [activeButton, setActiveButton] = useState("todo-list");

  const handleButtonClick = (button) => {
    console.log("Button clicked:", button); // Debug log
    setActiveButton(button);
  };

  return (
    <div className="customs-buttons-container">
      <div className="buttonss-row">
        <button
          className={`customs-button ${
            activeButton === "places" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("places")}
        >
          Places to stay
        </button>
        <button
          className={`customs-button ${
            activeButton === "vehicle-rent" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("vehicle-rent")}
        >
          Vehicle Rent
        </button>
        <button
          className={`customs-button ${
            activeButton === "todo-list" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("todo-list")}
        >
          To - Do List
        </button>
        <button
          className={`customs-button ${
            activeButton === "budget" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("budget")}
        >
          Travel Budget
        </button>
      </div>

      {/* Make sure TodoList component exists and is properly exported */}
      {activeButton === "todo-list" && (
        <TodoList tripId={tripId} sharedMode={sharedMode} />
      )}
      {activeButton === "budget" && (
        <TravelBudget tripId={tripId} sharedMode={sharedMode} />
      )}
      {activeButton === "vehicle-rent" && (
        <VehicleRent sharedMode={sharedMode} />
      )}
      {activeButton === "places" && <PlacesToStay sharedMode={sharedMode} />}
    </div>
  );
};

export default CustomButtons;
