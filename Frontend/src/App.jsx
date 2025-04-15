import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainNavbar from "./Components/MainNavbar/MainNavbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Pages/Home";
import PlanTrip from "./Pages/PlanTrip";
import Accommodation from "./Pages/Accommodation";
import Vehicle from "./Pages/Vehicle";
import Blog from "./pages/Blog";
import ThingsToDo from "./Pages/ThingsToDo";
import "./App.css";
// import Profilepage from "./pages/Profilepage";



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
          <Route path="/profile" element={<Profile />} />
          <Route path="/personalblog" element={<PersonalBlog />} />
          <Route path="/post" element={<Post />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/blog/:id" element={<Setting />} />{" "}
          <Route path="/profile/:writerId" element={<Setting />} />
          {/* Dynamic route */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
