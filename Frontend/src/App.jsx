import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useContext } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import AccommodationManagement from "./Components/AdminProfile/accommodation-management";
import DashboardOverview from "./Components/AdminProfile/dashboard-overview";
import EditPlace from "./Components/AdminProfile/edit-place";
import PlacesManagement from "./Components/AdminProfile/places-management";
import ReviewsManagement from "./Components/AdminProfile/reviews-management";
import SettingsPanel from "./Components/AdminProfile/settings-panel";
import UsersManagement from "./Components/AdminProfile/user-management";
import VehiclesManagement from "./Components/AdminProfile/vehicle-management";
import AdminProfile from "./Components/AdminProfile/admin-profile";
import UserProfileDetail from "./pages/Admin/UserProfileDetail";
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
import AccommodationDetail from "./pages/Accommodation/AccommodationDetailPage";
import AccommodationSupplier from "./pages/AccommodationSupplier/AccommodationSupplier";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AllTrips from "./pages/AllTrips/AllTrips";
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
import TripDashboard from "./pages/TripDashboard";

import ProfileBookingContent from "./Components/UserProfileComponents/ProfileBookingContent/ProfileBookingContent";

import Vehicle from "./pages/Vehicle/Vehicle";
import VehicleDetail from "./pages/Vehicle/VehicleDetailPage";
import VehicleSupplier from "./pages/VehicleSupplier/VehicleSupplier";

import "./App.css";
import BlogCard from "./Components/BlogComponents/BlogCard/BlogCard";
import CreateTrip from "./pages/CreateTrip/CreateTrip/CreateTrip";

import ProfilePosts from "./Components/UserProfileComponents/Post/Post";
import OptimizedTripRoute from "./pages/OptimizedRoute/OptimizedRoute";

import "./App.css";
import UserTrips from "./pages/Admin/UserTrips";
import UserBlogs from "./pages/Admin/UserBlogs";
import AdminUserVehicles from "./pages/Admin/AdminUserVehicles";
import AdminUserAccommodations from "./pages/Admin/AdminUserAccommodations";

import { CometChat } from "@cometchat-pro/chat";

const appID = "279195a6164aa3fa"; 
const region = "in"; 
const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;

CometChat.init(appID, new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(region).build())
  .then(() => {
    console.log("CometChat initialized successfully");
  })
  .catch(error => {
    console.error("CometChat initialization failed", error);
  });

const loginCometChat = async (userId, userName) => {
  try {
    await CometChat.login(userId, authKey);
    console.log("CometChat Login Successful");
  } catch (error) {
    if (error.code === "ERR_UID_NOT_FOUND") {
      // Call backend to create user
      await fetch("/api/cometchat/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId, name: userName }),
      });
      // Retry login
      await CometChat.login(userId, authKey);
    } else {
      console.error("CometChat Login failed", error);
    }
  }
};

export { loginCometChat };

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
        <Route path="/upcomingtrips" element={<AllTrips />} />
        <Route path="/alltrips" element={<AllTrips />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route
          path="/shared-trip/:tripId"
          element={<TripDashboard sharedMode={true} />}
        />

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
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route index element={<DashboardOverview />} />
          <Route path="places-management" element={<PlacesManagement />} />
          <Route path="users-management" element={<UsersManagement />} />
          <Route path="vehicles-management" element={<VehiclesManagement />} />
          <Route path="reviews-management" element={<ReviewsManagement />} />
          <Route path="settings-panel" element={<SettingsPanel />} />
          <Route path="edit-place/:id" element={<EditPlace />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="user-profile/:userId" element={<UserProfileDetail />} />
          <Route path="user-trips/:userId" element={<UserTrips />} />
          <Route path="user-blogs/:userId" element={<UserBlogs />} />
          <Route path="accommodation-management" element={<AccommodationManagement />} />
          <Route path="user-vehicles/:userId" element={<AdminUserVehicles />} />
          <Route path="user-accommodations/:userId" element={<AdminUserAccommodations />} />
        </Route>
        <Route path="/blogcard" element={<BlogCard />} />
        <Route path="/profile/posts" element={<ProfilePosts/>} />
        <Route path="/post/:id" element={<Postview />} />
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
