<<<<<<< Updated upstream
import React from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> Stashed changes
import SearchBar from "../Searchbar/Searchbar";
import "./HeroSection.css";

const HeroSection = ({ title, subtitle, backgroundImage, placeHolder }) => {
  return (
    <>
      <div
        className="hero"
<<<<<<< Updated upstream
        style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
          {/* Discover. Explore. Experience. <br />
          Your Perfect Journey Starts Here! */}
        </h1>
        <p className="text-lg mb-6">{subtitle}</p> <br />
        <SearchBar placeHolder={placeHolder} />
=======
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-lg mb-6">{subtitle}</p>
        <br />
        {showSearchBar && <SearchBar placeHolder={placeHolder} />}
        {showScrollText && <div className="scroll-overlay">↓ Scroll down</div>}
>>>>>>> Stashed changes
      </div>
    </>
  );
};

export default HeroSection;
