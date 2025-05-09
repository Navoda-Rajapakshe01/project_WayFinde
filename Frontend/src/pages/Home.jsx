import React from "react";
import BlogPostSection from "../Components/BlogComponents/BlogPostSection/BlogPostSection";
import HeroSection from "../Components/HeroSection/HeroSection";
import LocationSection from "../Components/LocationSection/LocationSection";
import VehicleSection from "../Components/VehicleSection/VehicleSection";

function Home() {
  return (
    <>
      <HeroSection
        title={
          <>
            Discover. Explore. Experience. <br />
            Your Perfect Journey Starts Here!
          </>
        }
        subtitle="Plan your trips easily"
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search Here..."
      />
      <LocationSection />
      <BlogPostSection />
      <VehicleSection />
    </>
  );
}

export default Home;
