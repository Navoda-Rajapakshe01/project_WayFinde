import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React from 'react';
import DashboardText from '../Components/DashboardText/DashboardText';
import DashboardImage from "../Components/DashboardImage/DashboardImage";
import DashboardMap from "../Components/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TabNavigation/TabNavigation";
import WeatherWidget from "../Components/WeatherWidget/WeatherWidget";

const TripDashboard = () => {
  return (
    <div>
      <MainNavbar />
      <div className="navbar-spacing" />

      <DashboardText /> {/* Include the DashboardText component */}
      <DashboardImage /> 
      <DashboardMap /><br/>
      <TabNavigation/>
      <WeatherWidget/>
      
      
     
    </div>
  );
};

export default TripDashboard;
