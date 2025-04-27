import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import MainNavbar from "../Components/MainNavbar/MainNavbar";
import BestLocations from "../Components/ThingsToDo/BestLocations/BestLocations";
import Blogs from "../Components/ThingsToDo/Blogs/Blogs";

const ThingsToDo = () => {
  return (
    <div className="page-container">
      <MainNavbar />
      <HeroSection
        title={<>Discover & Explore: Unmissable Experiences Await!</>}
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Your Destination Here..."
        color="black"
      />
      <BestLocations />
      <Blogs />
    </div>
  );
};

export default ThingsToDo;
