import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Footer from "./components/Footer/Footer";
import Home from "./Pages/Home";
import PlanTrip from "./pages/Trip/NewTrip/PlanTrip";
import OptimizedTripRoute from "./pages/Trip/OptimizedTrip/OptimizedTripRoute";
import UpcomingAllTrips from "./pages/Trip/AllTrips/UpcomingAllTrips";
import Accommodation from "./Pages/Accommodation";
import Vehicle from "./Pages/Vehicle";
import Blog from "./Pages/Blog";
=======
import "./App.css";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Accommodation from "./Pages/Accommodation";
import Home from "./Pages/Home";
import PlanTrip from "./Pages/PlanTrip";
>>>>>>> dcca35d5ccde73530e5f194329536dab78cd31b4
import ThingsToDo from "./Pages/ThingsToDo";
import Vehicle from "./Pages/Vehicle";
import Blog from "./pages/Blog";

import Chat from "./pages/Chat";

import Logout from "./pages/Logout";
import PersonalBlog from "./pages/PersonalBlog";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";

function App() {
  return (
    <>
      <BrowserRouter>
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plantrip" element={<PlanTrip />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/vehicle" element={<Vehicle />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/thingstodo" element={<ThingsToDo />} />
<<<<<<< HEAD
          <Route path="/trip-planner" element={<OptimizedTripRoute />} />
          <Route path="/all-trips/upcoming" element={<UpcomingAllTrips />} />
=======
          <Route path="/profile" element={<Profile />} />
          <Route path="/personalblog" element={<PersonalBlog />} />
          <Route path="/post" element={<Post />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/blog/:id" element={<BlogPage1 />} />{" "}
          {/* <Route path="/profile/:writerId" element={<Profilepage />} /> */}
          {/* Dynamic route */}
>>>>>>> dcca35d5ccde73530e5f194329536dab78cd31b4
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
