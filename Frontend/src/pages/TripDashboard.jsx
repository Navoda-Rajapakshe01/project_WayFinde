import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React from 'react';
import DashboardText from '../Components/TripDashboardComponents/DashboardText/DashboardText';
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";
import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";

const TripDashboard = () => {
  return (
    <div>
      <MainNavbar />
      <div className="navbar-spacing" />

      <DashboardText /> {/* Include the DashboardText component */}
      <DashboardImage /> 
      <DashboardMap />
      <TabNavigation/>
      <WeatherWidget/>
     
      
      
     
    </div>
  );
};

export default TripDashboard;
