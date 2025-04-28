import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import SignIn from "./Components/Authentication/SignIn/SignIn";
import UserLogin from "./Components/Authentication/UserLogin/UserLogin";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Footer from "./Components/Footer/Footer";
import ThingsToDo from "./pages/ThingsToDo";
import ThingstodoCategories from "./Components/ThingsToDo/ThingstodoCategories/Categories";
import Accommodation from "./pages/Accommodation";
import Blog from "./pages/Blog";
import Following from "./pages/Following";
import Followers from "./pages/Follwers";
import Home from "./pages/Home";
import DistrictDetails from "./pages/Thingstodo/DistrictDetails";
import PlaceDetails from "./pages/Thingstodo/PlaceDetails";
import Vehicle from "./pages/Vehicle";
import Chat from "./pages/Chat";
import Logout from "./pages/Logout";
import PaymentGateway from "./pages/PaymentGateway";
import PersonalBlog from "./pages/PersonalBlog";
import Profile from "./pages/Profile";
import ReserveVehicle from "./pages/ReserveVehicle";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import TripDashboard from "./pages/TripDashboard";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";
import AccommodationDetail from "./pages/AccommodationDetail";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap the entire app with AuthProvider */}
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
          <Route path="/things-to-do/:slug" element={<DistrictDetails />} />
          <Route
            path="/things-to-do/:slug/:placeId"
            element={<PlaceDetails />}
          />
          <Route path="/tripdashboard" element={<TripDashboard />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/accommodation/:id" element={<AccommodationDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/personalBlog" element={<PersonalBlog />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<UserLogin />} />
          <Route path="/reservevehicle" element={<ReserveVehicle />} />
          <Route path="/paymentgateway" element={<PaymentGateway />} />
          <Route path="/vehiclebookingform" element={<VehicleBookingForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/blog" element={<Blog />} />
          <Route path="/profile/followers" element={<Followers />} />
          <Route path="/profile/following" element={<Following />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
