import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import BlogManagement from "./Components/AdminProfile/blog-management";
import DashboardOverview from "./Components/AdminProfile/dashboard-overview";
import EditPlace from "./Components/AdminProfile/edit-place";
import PlacesManagement from "./Components/AdminProfile/places-management";
import ReviewsManagement from "./Components/AdminProfile/reviews-management";
import SettingsPanel from "./Components/AdminProfile/settings-panel";
import UserAnalytics from "./Components/AdminProfile/user-analytics";
import UsersManagement from "./Components/AdminProfile/users-management";
import VehiclesManagement from "./Components/AdminProfile/vehicle-management";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider";
import SignIn from "./Components/Authentication/SignIn/SignIn";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import UploadNewBlog from "./Components/UserProfileComponents/ProfileBlogContext/UploadNewBlog";
import { ProfileImageProvider } from "./Components/UserProfileComponents/ProfileImageContext/ProfileImageContext";
import Accommodation from "./pages/Accommodation";
import AccommodationDetail from "./pages/AccommodationDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Blog from "./pages/Blogs/Blog";
import BlogEditor from "./pages/Blogs/BlogEditor";
import BlogPreview from "./pages/Blogs/BlogPreview";
import PersonalBlog from "./pages/Blogs/PersonalBlog";
import ProfileBlogs from "./pages/Blogs/ProfileBlogs";
import Home from "./pages/Home";
import PaymentGateway from "./pages/PaymentGateway";
import Following from "./pages/Profile/Following";
import Followers from "./pages/Profile/Follwers";
import Profile from "./pages/Profile/Profile";
import UserProfileSettings from "./pages/Profile/Setting";
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
        <Route path="/chat" element={<PersonalBlog />} />
        <Route path="/blog/:id" element={<PersonalBlog />} />
        <Route path="/settings" element={<UserProfileSettings />} />
        <Route path="/reservevehicle" element={<ReserveVehicle />} />
        <Route path="/paymentgateway" element={<PaymentGateway />} />
        <Route path="/vehiclebookingform" element={<VehicleBookingForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/blog" element={<Blog />} />
        <Route path="/profile/followers" element={<Followers />} />
        <Route path="/profile/following" element={<Following />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/profileBlogs" element={<ProfileBlogs />} />
        <Route path="/uploadNewBlog" element={<UploadNewBlog />} />
        <Route
          path="/profile/profileBlogs/blogEditor"
          element={<BlogEditor />}
        />
        <Route path="/pages/blogs/blogpriview" element={<BlogPreview />} />

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
    <GoogleOAuthProvider clientId="114068341710-2i1qkqgprej37t78umijsckchgktcljm.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthProvider>
          <ProfileImageProvider>
            <AppRoutes />
          </ProfileImageProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
