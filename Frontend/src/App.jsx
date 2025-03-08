import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThingsToDo from "./pages/ThingsToDo";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import Accommodation from "./Pages/Accommodation";
import Vehicle from "./Pages/Vehicle";
import Blog from "./Pages/Blog";
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plantrip" element={<PlanTrip />} />
          <Route path="/trip-planner" element={<OptimizedTripRoute />} />
          <Route path="/upcomingtrips" element={<UpcomingAllTrips />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/vehicle" element={<Vehicle />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/thingstodo" element={<ThingsToDo />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
