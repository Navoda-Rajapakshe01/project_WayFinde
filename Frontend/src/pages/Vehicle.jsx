import React from "react";
import MainNavbar from "../Components/MainNavbar/MainNavbar";
import HeroSection from "../Components/HeroSection/HeroSection";
import SearchVehicle from "../Components/SearchVehicle/SearchVehicle";
import VehicleDealSection from "../Components/VehicleDealSection/VehicleDealSection";
const Vehicle = () => {
  return (
    <>
      <div className="page-container">
        <MainNavbar />
        <HeroSection
          title={
            <>
              Your Perfect Journey Starts <br /> with the Right Ride!
            </>
          }
          subtitle="Ride. Roam. Relax."
          backgroundImage="https://images.pexels.com/photos/1534604/pexels-photo-1534604.jpeg?auto=compress&cs=tinysrgb&w=600"
          placeHolder="Search Here..."
          color="black"
        />
        <SearchVehicle />
        <VehicleDealSection />
      </div>
    </>
  );
};

export default Vehicle;
