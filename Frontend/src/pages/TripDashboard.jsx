import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainNavbar from "../Components/MainNavbar/MainNavbar";
import DashboardText from "../Components/TripDashboardComponents/DashboardText/DashboardText";
import DashboardImage from "../Components/TripDashboardComponents/DashboardImage/DashboardImage";
import DashboardMap from "../Components/TripDashboardComponents/DashboardMap/DashboardMap";
import TabNavigation from "../Components/TripDashboardComponents/TabNavigation/TabNavigation";
import WeatherWidget from "../Components/TripDashboardComponents/WeatherWidget/WeatherWidget";
import CalendarView from "../Components/TripDashboardComponents/CalendarView/CalendarView";

const TripDashboard = () => {
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
    <div>
      <MainNavbar />
      <div className="navbar-spacing" />
      <DashboardText trip={tripData} />
      <DashboardImage trip={tripData} />
      <DashboardMap trip={tripData} />
      <TabNavigation trip={tripData} />
      <WeatherWidget trip={tripData} />
      <CalendarView trip={tripData} />
    </div>
  );
};

export default TripDashboard;
