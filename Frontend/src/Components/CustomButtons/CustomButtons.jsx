import React, { useState } from 'react';
import './CustomButtons.css';
import TodoList from '../ToDoList/ToDoList';
import TravelBudget from '../TravelBudget/TravelBudget';
import VehicleRent from '../VehicleRent/VehicleRent';


const CustomButtons = () => {
  const [activeButton, setActiveButton] = useState('todo-list');

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
    <div className="custom-buttons-container">
      <div className="buttons-row">
        <button 
          className={`custom-button ${activeButton === 'places' ? 'active' : ''}`}
          onClick={() => handleButtonClick('places')}
        >
          Places to stay
        </button>
        <button 
          className={`custom-button ${activeButton === 'vehicle-rent' ? 'active' : ''}`}
          onClick={() => handleButtonClick('vehicle-rent')}
        >
          Vehicle Rent
        </button>
        <button 
          className={`custom-button ${activeButton === 'todo-list' ? 'active' : ''}`}
          onClick={() => handleButtonClick('todo-list')}
        >
          To - Do List
        </button>
        <button 
          className={`custom-button ${activeButton === 'budget' ? 'active' : ''}`}
          onClick={() => handleButtonClick('budget')}
        >
          Travel Budget
        </button>
      </div>
      
      {/* Make sure TodoList component exists and is properly exported */}
      {activeButton === 'todo-list' && <TodoList />}
      {activeButton === 'budget' && <TravelBudget />}
      {activeButton === 'vehicle-rent' && <VehicleRent />}
      
    </div>
  );
};

export default CustomButtons;