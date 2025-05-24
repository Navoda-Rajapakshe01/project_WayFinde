import React from "react";
<<<<<<< Updated upstream
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
=======
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import SignIn from "./Components/Authentication/SignIn/SignIn";
import UserLogin from "./Components/Authentication/UserLogin/UserLogin"; // unused currently
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Accommodation from "./pages/Accommodation/Accommodation";
import Blog from "./pages/Blogs/Blog";
import Following from "./pages/Profile/Following";
import Followers from "./pages/Profile/Follwers"; // ✅ fixed typo
import ThingsToDo from "./pages/Thingstodo/ThingsToDo";
import DistrictDetails from "./pages/Thingstodo/DistrictDetails";
import PlaceDetails from "./pages/Thingstodo/PlaceDetails";
import Vehicle from "./pages/Vehicle/Vehicle";
import Chat from "./pages/Profile/Chat";
import PersonalBlog from "./pages/Blogs/PersonalBlog";
import Profile from "./pages/Profile/Profile";
>>>>>>> Stashed changes
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import TripDashboard from "./pages/TripDashboard";
<<<<<<< Updated upstream
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";
import AccommodationDetail from "./pages/AccommodationDetail";
=======
import Setting from "./pages/Profile/Setting";
import VehicleSupplier from "./pages/VehicleSupplier/VehicleSupplier";
import AccommodationSupplier from "./pages/AccommodationSupplier/AccommodationSupplier";
import { ProfileImageProvider } from "./Components/UserProfileComponents/ProfileImageContext/ProfileImageContext";
>>>>>>> Stashed changes

// Admin Components
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

// Styles
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

<<<<<<< Updated upstream
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
=======
// Role constants
const ROLES = {
  NORMAL_USER: "NormalUser",
  VEHICLE_SUPPLIER: "VehicleSupplier",
  ACCOMMODATION_SUPPLIER: "AccommodationSupplier",
  ADMIN: "Admin",
};

// Layout wrapper
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <MainNavbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

// Redirect based on role
const RoleBasedRedirect = () => {
  const role = localStorage.getItem("role");

  switch (role) {
    case ROLES.VEHICLE_SUPPLIER:
      return <Navigate to="/vehicle" replace />;
    case ROLES.ACCOMMODATION_SUPPLIER:
      return <Navigate to="/accommodation" replace />;
    case ROLES.ADMIN:
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <ProfileImageProvider>
        <BrowserRouter>
          <LayoutWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/things-to-do" element={<ThingsToDo />} />
              <Route path="/things-to-do/:slug" element={<DistrictDetails />} />
              <Route
                path="/things-to-do/:slug/:placeId"
                element={<PlaceDetails />}
              />

              {/* Formerly Protected Routes - Now Public */}
              <Route path="/plantrip" element={<PlanTrip />} />
              <Route path="/trip-planner" element={<OptimizedTripRoute />} />
              <Route path="/upcomingtrips" element={<UpcomingAllTrips />} />
              <Route path="/tripdashboard" element={<TripDashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/personalBlog" element={<PersonalBlog />} />
              <Route path="/settings" element={<Setting />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/blog" element={<Blog />} />
              <Route path="/profile/followers" element={<Followers />} />
              <Route path="/profile/following" element={<Following />} />

              {/* Role-Based Redirect */}
              <Route path="/dashboard" element={<RoleBasedRedirect />} />

              {/* Shared Routes */}
              <Route
                path="/accommodation"
                element={
                  localStorage.getItem("role") ===
                  ROLES.ACCOMMODATION_SUPPLIER ? (
                    <AccommodationSupplier />
                  ) : (
                    <Accommodation />
                  )
                }
              />
              <Route
                path="/vehicle"
                element={
                  localStorage.getItem("role") === ROLES.VEHICLE_SUPPLIER ? (
                    <VehicleSupplier />
                  ) : (
                    <Vehicle />
                  )
                }
              />

              {/* Admin Routes - Now Public */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<DashboardOverview />} />
              <Route path="/admin/users" element={<UsersManagement />} />
              <Route path="/admin/vehicles" element={<VehiclesManagement />} />
              <Route path="/admin/places" element={<PlacesManagement />} />
              <Route path="/admin/blogs" element={<BlogManagement />} />
              <Route path="/admin/reviews" element={<ReviewsManagement />} />
              <Route path="/admin/analytics" element={<UserAnalytics />} />
              <Route path="/admin/settings" element={<SettingsPanel />} />
              <Route
                path="/admin/edit-place/:placeId"
                element={<EditPlace />}
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LayoutWrapper>
        </BrowserRouter>
      </ProfileImageProvider>
>>>>>>> Stashed changes
    </AuthProvider>
  );
}

export default App;
