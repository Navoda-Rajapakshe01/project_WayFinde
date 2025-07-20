import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import DashboardText from "../Components/TripDashboardComponents/DashboardText/DashboardText";
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";
import CalendarView from "../Components/TripDashboardComponents/CalendarView/CalendarView";
import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";
import "./TripDashboard.css";

const TripDashboard = () => {
  const { tripId } = useParams();
  console.log("TripDashboard tripId:", tripId); // Debug log
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="dashboard-container">
      <div className="navbar-spacing" />
      <div className="full-width-section">
        <DashboardText />
      </div>
      <div className="split-content">
        <div className="main-content">
          <DashboardImage tripId={tripId} />
          <TabNavigation tripId={tripId} />
          <CalendarView tripId={tripId} setSelectedDate={setSelectedDate} />
        </div>
        <div className="side-content">
          <DashboardMap tripId={tripId} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;
