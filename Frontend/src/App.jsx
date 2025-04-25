// import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./Components/Authentication/SignUp/SignUp"
import UserLogin from "./Components/Authentication/UserLogin/UserLogin";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import ThingsToDo from "./Pages/Thingstodo/ThingsToDo";
import Accommodation from "./pages/Accommodation";
import { default as Blog, default as Blogs } from "./pages/Blog";
import Chat from "./pages/Chat";
import Following from "./pages/Following";
import Followers from "./pages/Follwers";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import PaymentGateway from "./pages/PaymentGateway";
import PersonalBlog from "./pages/PersonalBlog";
import Profile from "./pages/Profile";
import ReserveVehicle from "./pages/ReserveVehicle";
import DistrictDetails from "./pages/Thingstodo/DistrictDetails";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import TripDashboard from "./pages/TripDashboard";
import Vehicle from "./pages/Vehicle";
import VehicleBookingForm from "./pages/VehicleBookingForm";
import VehicleDetail from "./pages/VehicleDetail";
import SignIn from "./Components/Authentication/SignIn/SignIn";

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
          <Route path="/thingstodo/:districtId" element={<DistrictDetails />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/tripdashboard" element={<TripDashboard />} />
          <Route path="/VehicleDetail" element={<VehicleDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/personalBlog" element={<PersonalBlog />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/settings" element={<UserLogin />} />
          {/* <Route path="/blog/:id" element={<Setting />} /> */}
          {/* <Route path="/profile/:writerId" element={<Setting />} /> */}
          {/* Dynamic route */}
          <Route path="/ReserveVehicle" element={<ReserveVehicle />} />
          <Route path="/PaymentGateway" element={<PaymentGateway />} />
          <Route path="/VehicleBookingForm" element={<VehicleBookingForm />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/posts" element={<Posts />} /> */}
          <Route path="/profile/blog" element={<Blogs />} />
          <Route path="/profile/followers" element={<Followers />} />
          <Route path="/profile/following" element={<Following />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/posts/:id" element={<PostDetails />} /> */}
          {/* <Route path="/posts/:id/edit" element={<EditPost />} /> */}
          {/* <Route path="/posts/new" element={<NewPost />} /> */}
          {/* <Route path="/posts/:id/delete" element={<DeletePost />} /> */}
          {/* <Route path="/profile/:userId" element={<UserProfile />} /> */}
          {/* <Route path="/profile/edit" element={<EditProfile />} /> */}
          {/* <Route path="/profile/followers" element={<FollowersList />} /> */}
          {/* <Route path="/profile/following" element={<FollowingList />} /> */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
