import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlanTrip from "../src/pages/Trip/NewTrip/PlanTrip";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Accommodation from "./Pages/Accommodation";
import Blog from "./Pages/Blog";
import Home from "./Pages/Home";
import ThingsToDo from "./Pages/ThingsToDo";
import Vehicle from "./Pages/Vehicle";
import Profile from "./pages/Profile";

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
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
