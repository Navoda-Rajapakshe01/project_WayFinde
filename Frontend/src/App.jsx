import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import BlogPage1 from "./Components/BlogPages/BlogPage1";
import Footer from "./Components/Footer/Footer";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Accommodation from "./Pages/Accommodation";
import Home from "./Pages/Home";
import PlanTrip from "./Pages/PlanTrip";
import ThingsToDo from "./Pages/ThingsToDo";
import Vehicle from "./Pages/Vehicle";
import Blog from "./pages/Blog";
import Chat from "./pages/Chat";
import Logout from "./pages/Logout";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import PersonalBlog from "./pages/PersonalBlog";

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
          <Route path="/personalblog" element={<PersonalBlog />} />
          <Route path="/post" element={<Post />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/blog/:id" element={<BlogPage1 />} />{" "}
          {/* Dynamic route */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
