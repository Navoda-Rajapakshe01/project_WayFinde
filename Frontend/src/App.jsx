import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider";
import SignIn from "./Components/Authentication/SignIn/SignIn";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import UserLogin from "./Components/Authentication/UserLogin/UserLogin";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Accommodation from "./pages/Accommodation";
import AccommodationDetail from "./pages/AccommodationDetail";
import Blog from "./pages/Blogs/Blog";
import PersonalBlog from "./pages/Blogs/PersonalBlog";
import Chat from "./pages/Profile/Chat";
import Home from "./pages/Home";
import PaymentGateway from "./pages/PaymentGateway";
import Followers from "./pages/Profile/Follwers";
import Following from "./pages/Profile/Following";
import Profile from "./pages/Profile/Profile";
import ReserveVehicle from "./pages/ReserveVehicle";
import DistrictDetails from "./pages/Thingstodo/DistrictDetails";
import PlaceDetails from "./pages/Thingstodo/PlaceDetails";
import ThingsToDo from "./pages/Thingstodo/ThingsToDo";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import TripDashboard from "./pages/TripDashboard";
import Vehicle from "./pages/Vehicle";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";
import Setting from "./pages/Profile/Setting";

// ✅ Import ProfileImageProvider
import { ProfileImageProvider } from './Components/UserProfileComponents/ProfileImageContext/ProfileImageContext';

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ProfileImageProvider> {/* ✅ Wrap everything here */}
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
            <Route path="/things-to-do/:slug" element={<DistrictDetails />} />
            <Route path="/things-to-do/:slug/:placeId" element={<PlaceDetails />} />
            <Route path="/tripdashboard" element={<TripDashboard />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/personalBlog" element={<PersonalBlog />} />
            <Route path="/settings" element={<Setting />} />
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
      </ProfileImageProvider>
    </AuthProvider>
  );
}

export default App;
