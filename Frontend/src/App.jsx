import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Vehicle from "./Pages/Vehicle";
import Accommodation from "./pages/Accommodation";
import Blog from "./pages/Blog";
import Chat from "./pages/Chat";
import PaymentGateway from "./pages/PaymentGateway";
import PersonalBlog from "./pages/PersonalBlog";
import Profile from "./pages/Profile";
import ReserveVehicle from "./pages/ReserveVehicle";
import ThingsToDo from "./pages/ThingsToDo";
import ThingstodoCategories from "./Components/ThingsToDo/ThingstodoCategories/Categories";
import TripDashboard from "./pages/TripDashboard";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Footer from "./Components/Footer/Footer";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";
import AccommodationDetail from "./pages/AccommodationDetail";
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
          <Route
            path="/thingstodocategories"
            element={<ThingstodoCategories />}
          />
          <Route path="/tripdashboard" element={<TripDashboard />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/accommodation/:id" element={<AccommodationDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/ReserveVehicle" element={<ReserveVehicle />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/VehicleBookingForm" element={<VehicleBookingForm />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
