import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import MainNavbar from "../Components/MainNavbar/MainNavbar";
import AccommodationDealSection from "../Components/AccommodationDealSection/AccommodationDealSection";
const Accommodation = () => {
  return (
    <div className="page-container">
      <MainNavbar />
      <HeroSection
        title={<>Rest. Recharge. Stay in Comfort!</>}
        subtitle="Stay. Unwind. Explore"
        backgroundImage="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600"
        placeHolder="Search Here..."
        color="black"
      />
      <AccommodationDealSection />
    </div>
  );
};

export default Accommodation;
