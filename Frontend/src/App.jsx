import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Accommodation from "./Pages/Accommodation";
import Blog from "./pages/Blog";
import Home from "./Pages/Home";
import PlanTrip from "./Pages/PlanTrip";
import ThingsToDo from "./Pages/ThingsToDo";
import Vehicle from "./Pages/Vehicle";
import BlogPage1 from "./Components/BlogPages/BlogPage1";

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
          <Route path="/blog/:id" element={<BlogPage1 />} /> {/* Dynamic route */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
