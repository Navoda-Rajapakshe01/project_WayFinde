import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainNavbar from "../Components/MainNavbar/MainNavbar";
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardText from '../Components/TripDashboardComponents/DashboardText/DashboardText';
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";
import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";
import './TripDashboard.css';
import CalendarView from "../Components/TripDashboardComponents/CalendarView/CalendarView";

const TripDashboard = () => {
  const { tripId } = useParams();
  console.log('TripDashboard tripId:', tripId);  // Debug log

  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const res = await fetch(`http://localhost:5030/api/trips/${tripId}`);
        const data = await res.json();
        setTripData(data);
      } catch (error) {
        console.error("Failed to load trip data", error);
      }
    };

    if (tripId) {
      fetchTripData();
    }
  }, [tripId]);

  if (!tripData) return <p>Loading Trip...</p>;

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
