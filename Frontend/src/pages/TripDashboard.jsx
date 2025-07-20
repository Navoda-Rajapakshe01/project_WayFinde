import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import DashboardText from "../Components/TripDashboardComponents/DashboardText/DashboardText";
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";

import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";
import "./TripDashboard.css";

const TripDashboard = ({ sharedMode = false }) => {
  const { tripId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    console.log("TripDashboard sharedMode:", sharedMode);
  }, [sharedMode, tripId]);

  return (
    <div className="dashboard-container">
      <div className="navbar-spacing" />
      <div className="full-width-section">
        <DashboardText sharedMode={sharedMode} tripId={tripId} />
      </div>
      <div className="split-content">
        <div className="main-content">
          <DashboardImage tripId={tripId} sharedMode={sharedMode} />
          {/* ✅ Pass selectedDate and setSelectedDate down */}
          <TabNavigation
            tripId={tripId}
            sharedMode={sharedMode}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
        <div className="side-content">
          <DashboardMap tripId={tripId} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;
