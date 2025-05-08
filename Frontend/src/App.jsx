import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import SignIn from "./Components/Authentication/SignIn/SignIn";
import UserLogin from "./Components/Authentication/UserLogin/UserLogin";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Footer from "./Components/Footer/Footer";
import Accommodation from "./pages/Accommodation";
import Blog from "./pages/Blogs/Blog";
import Following from "./pages/Profile/Following";
import Followers from "./pages/Profile/Follwers";
import ThingsToDo from "./pages/Thingstodo/ThingsToDo";
import DistrictDetails from "./pages/Thingstodo/DistrictDetails";
import PlaceDetails from "./pages/Thingstodo/PlaceDetails";
import Vehicle from "./pages/Vehicle";
import Chat from "./pages/Profile/Chat";
import PaymentGateway from "./pages/PaymentGateway";
import PersonalBlog from "./pages/Blogs/PersonalBlog";
import Profile from "./pages/Profile/Profile";
import ReserveVehicle from "./pages/ReserveVehicle";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import TripDashboard from "./pages/TripDashboard";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";
import AccommodationDetail from "./pages/AccommodationDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PlacesManagement from "./Components/AdminProfile/places-management";
import UsersManagement from "./Components/AdminProfile/users-management";
import VehiclesManagement from "./Components/AdminProfile/vehicle-management";
import DashboardOverview from "./Components/AdminProfile/dashboard-overview";
import BlogManagement from "./Components/AdminProfile/blog-management";
import ReviewsManagement from "./Components/AdminProfile/reviews-management";
import UserAnalytics from "./Components/AdminProfile/user-analytics";
import SettingsPanel from "./Components/AdminProfile/settings-panel";
import EditPlace from "./Components/AdminProfile/edit-place";

import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <MainNavbar />}

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
        
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="places-management" element={<PlacesManagement />} />
          <Route path="users-management" element={<UsersManagement />} />
          <Route path="vehicles-management" element={<VehiclesManagement />} />
          <Route path="blog-management" element={<BlogManagement />} />
          <Route path="reviews-management" element={<ReviewsManagement />} />
          <Route path="user-analytics" element={<UserAnalytics />} />
          <Route path="settings-panel" element={<SettingsPanel />} />
          <Route path="edit-place/:id" element={<EditPlace />} />
        </Route>

      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
