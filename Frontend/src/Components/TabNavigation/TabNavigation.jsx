import React, { useState } from 'react';
import './TabNavigation.css';
import CustomButtons from '../CustomButtons/CustomButtons';
import DashboardSaves from '../DashboardSaves/DashboardSaves';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState('for-you');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tab-navigation-container">
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => handleTabClick('calendar')}
        >
          Calendar
        </button>
        <button 
          className={`tab-button ${activeTab === 'for-you' ? 'active' : ''}`}
          onClick={() => handleTabClick('for-you')}
        >
          For you
        </button>
        <button 
          className={`tab-button ${activeTab === 'saves' ? 'active' : ''}`}
          onClick={() => handleTabClick('saves')}
        >
          Saves
        </button>
      </div>
      
      {activeTab === 'for-you' && <CustomButtons />}
      {activeTab === 'saves' && <DashboardSaves />}
    </div>
  );
};

export default TabNavigation;