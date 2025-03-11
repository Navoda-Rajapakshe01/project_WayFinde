import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Accommodation from "./Pages/Accommodation";
import Home from "./Pages/Home";
import Vehicle from "./Pages/Vehicle";
import Blog from "./pages/Blog";
import Chat from "./pages/Chat";
import PaymentGateway from "./pages/PaymentGateway";
import PersonalBlog from "./pages/PersonalBlog";
import Profile from "./pages/Profile";
import ReserveVehicle from "./pages/ReserveVehicle"; // Import the Reserve Now Page
import ThingsToDo from "./pages/ThingsToDo";
import ThingstodoCategories from "./pages/ThingstodoCategories";
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
          <Route path="/VehicleDetail" element={<VehicleDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/ReserveVehicle" element={<ReserveVehicle />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/VehicleBookingForm" element={<VehicleBookingForm />} />
          <Route
            path="/thingstodocategories"
            element={<ThingstodoCategories />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
