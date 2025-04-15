import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ThingsToDo from "./Pages/ThingsToDo";
import Vehicle from "./Pages/Vehicle";
import Accommodation from "./pages/Accommodation";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
// import Profilepage from "./pages/Profilepage";

import Chat from "./pages/Chat";
import PaymentGateway from "./pages/PaymentGateway";

import ReserveVehicle from "./pages/ReserveVehicle";

import "./App.css";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import ThingstodoCategories from "./Components/ThingsToDo/ThingstodoCategories/Categories";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import TripDashboard from "./pages/TripDashboard";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";

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
          <Route path="/VehicleDetail" element={<VehicleDetail />} />
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/logout" element={<Logout />} /> */}
          {/* <Route path="/setting" element={<Setting />} />
          <Route path="/blog/:id" element={<Setting />} />{" "} */}
          {/* <Route path="/profile/:writerId" element={<Setting />} /> */}
          {/* Dynamic route */}
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
