// Import necessary modules
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./Components/Authentication/AuthProvider/AuthProvider"; // Import AuthProvider
import SignUp from "./Components/Authentication/SignUp/SignUp";
import UserLogin from "./Components/Authentication/UserLogin/UserLogin";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import ThingsToDo from "./Pages/Thingstodo/ThingsToDo";
import Accommodation from "./pages/Accommodation";
import { default as Blog, default as Blogs } from "./pages/Blogs/Blog";
import Following from "./pages/Profile/Following";
import Followers from "./pages/Profile/Follwers";
import Home from "./pages/Home";
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

import SignIn from "./Components/Authentication/SignIn/SignIn";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";

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
          <Route path="/things-to-do/:slug" element={<DistrictDetails />} />
          <Route
            path="/things-to-do/:slug/:placeId"
            element={<PlaceDetails />}
          />

         
          <Route path="/tripdashboard" element={<TripDashboard />} />
          <Route path="/VehicleDetail" element={<VehicleDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/personalBlog" element={<PersonalBlog />} />
        
          <Route path="/settings" element={<UserLogin />} />
          <Route path="/ReserveVehicle" element={<ReserveVehicle />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/VehicleBookingForm" element={<VehicleBookingForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/blog" element={<Blogs />} />
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
