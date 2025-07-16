import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useContext } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";

import AccommodationManagement from "./Components/AdminProfile/accommodation-management";
import DashboardOverview from "./Components/AdminProfile/dashboard-overview";
import EditPlace from "./Components/AdminProfile/edit-place";
import PlacesManagement from "./Components/AdminProfile/places-management";
import ReviewsManagement from "./Components/AdminProfile/reviews-management";
import SettingsPanel from "./Components/AdminProfile/settings-panel";
import UserAnalytics from "./Components/AdminProfile/user-analytics";
import UsersManagement from "./Components/AdminProfile/users-management";
import VehiclesManagement from "./Components/AdminProfile/vehicle-management";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider";


import { AuthContext } from "./Components/Authentication/AuthContext/AuthContext";
import ForgotPassword from "./Components/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/Authentication/ResetPassword/ResetPassword";


import SignIn from "./Components/Authentication/SignIn/SignIn";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import UploadNewBlog from "./Components/UserProfileComponents/ProfileBlogContext/UploadNewBlog";
import { ProfileImageProvider } from "./Components/UserProfileComponents/ProfileImageContext/ProfileImageContext";
import Accommodation from "./pages/Accommodation/Accommodation";
import AccommodationSupplier from "./pages/AccommodationSupplier/AccommodationSupplier";
import AccommodationDetail from "./pages/Accommodation/AccommodationDetailPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Blog from "./pages/Blogs/Blog";
import BlogEditor from "./pages/Blogs/BlogEditor";
import PersonalBlog from "./pages/Blogs/PersonalBlog";
import ProfileBlogDisplay from "./pages/Blogs/ProfileBlogDisplay";
import ProfileBlogs from "./pages/Blogs/ProfileBlogs";
import Home from "./pages/Home";
import Chat from "./pages/Profile/Chat";
import Following from "./pages/Profile/Following";
import Followers from "./pages/Profile/Follwers";
import Profile from "./pages/Profile/Profile";
import UserProfileSettings from "./pages/Profile/Setting";
import DistrictDetails from "./pages/Thingstodo/DistrictDetails";
import PlaceDetails from "./pages/Thingstodo/PlaceDetails";
import ThingsToDo from "./pages/Thingstodo/ThingsToDo";
import AllTrips from "./pages/AllTrips/AllTrips";
import TripDashboard from "./pages/TripDashboard";

import ProfileBookingContent from "./Components/UserProfileComponents/ProfileBookingContent/ProfileBookingContent";


import Vehicle from "./pages/Vehicle/Vehicle";
import VehicleSupplier from "./pages/VehicleSupplier/VehicleSupplier";
import VehicleDetail from "./pages/Vehicle/VehicleDetailPage";

import CreateTrip from "./pages/CreateTrip/CreateTrip/CreateTrip";
import OptimizedTripRoute from "./pages/OptimizedRoute/OptimizedRoute";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";

import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user, loading } = useContext(AuthContext);
  console.log("AppRoutes user:", user);

  return (
    <>
      {!isAdminRoute && <MainNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plantrip" element={<CreateTrip />} />
        <Route path="/trip-planner" element={<PlanTrip />} />
        <Route path="/upcomingtrips" element={<AllTrips />} />
        <Route path="/alltrips" element={<AllTrips />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/vehicle" element={<Vehicle />} />
        <Route
          path="/vehicle/supplier"
          element={
            user?.role === "TransportProvider" ? (
              <VehicleSupplier />
            ) : (
              <Navigate to="/vehicle" replace />
            )
          }
        />
        <Route
          path="/accommodation/supplier"
          element={
            user?.role === "AccommodationProvider" ? (
              <AccommodationSupplier />
            ) : (
              <Navigate to="/accommodation" replace />
            )
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/thingstodo" element={<ThingsToDo />} />
        <Route path="/things-to-do/:slug" element={<DistrictDetails />} />
        <Route path="/things-to-do/:slug/:placeId" element={<PlaceDetails />} />
        <Route path="/tripdashboard" element={<TripDashboard />} />
        <Route path="/tripdashboard/:tripId" element={<TripDashboard />} />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/accommodation/:id" element={<AccommodationDetail />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/blog/:id" element={<PersonalBlog />} />
        <Route path="/settings" element={<UserProfileSettings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/blog" element={<Blog />} />
        <Route path="/profile/followers" element={<Followers />} />
        <Route path="/profile/following" element={<Following />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile/profileBlogs" element={<ProfileBlogs />} />
        <Route path="/profile/bookings" element={<ProfileBookingContent />} />
        <Route path="/uploadNewBlog" element={<UploadNewBlog />} />
        <Route
          path="/profile/profileBlogs/blogEditor"
          element={<BlogEditor />}
        />
        <Route path="/blog/:id" element={<ProfileBlogDisplay />} />
        <Route path="/plantrip" element={<CreateTrip />} />
        <Route path="/optimizedroute/:id" element={<OptimizedTripRoute />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="places-management" element={<PlacesManagement />} />
          <Route path="users-management" element={<UsersManagement />} />
          <Route path="vehicles-management" element={<VehiclesManagement />} />
          <Route path="reviews-management" element={<ReviewsManagement />} />
          <Route path="user-analytics" element={<UserAnalytics />} />
          <Route path="settings-panel" element={<SettingsPanel />} />
          <Route path="edit-place/:id" element={<EditPlace />} />
          <Route
            path="accommodation-management"
            element={<AccommodationManagement />}
          />
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
