import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React from 'react';
import DashboardText from '../Components/TripDashboardComponents/DashboardText/DashboardText';
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";
import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";
import './TripDashboard.css';

const TripDashboard = () => {
  return (
    <div className="dashboard-container">
      <MainNavbar />
      <div className="navbar-spacing" />
      <div className="full-width-section">
        <DashboardText />
      </div>
      <div className="split-content">
        <div className="main-content">
          <DashboardImage />
          <TabNavigation/>
        </div>
        <div className="side-content">
          <DashboardMap />
          <WeatherWidget location="Galle, Sri Lanka" />
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;
