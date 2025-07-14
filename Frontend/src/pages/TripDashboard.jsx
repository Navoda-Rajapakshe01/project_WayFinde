import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardText from '../Components/TripDashboardComponents/DashboardText/DashboardText';
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";
import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";
import './TripDashboard.css';

const TripDashboard = () => {
  const { tripId } = useParams();
  console.log('TripDashboard tripId:', tripId);  // Debug log

  return (
    <div className="dashboard-container">
      <MainNavbar />
      <div className="navbar-spacing" />
      <div className="full-width-section">
        <DashboardText />
      </div>
      <div className="split-content">
        <div className="main-content">
          <DashboardImage tripId={tripId} />
          <TabNavigation tripId={tripId} />
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
