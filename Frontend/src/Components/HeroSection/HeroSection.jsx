import React, { useEffect, useState } from "react";
import "./HeroSection.css";

const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
  placeHolder,
  showSearchBar,
}) => {
  const [showScrollText, setShowScrollText] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(window.scrollY < 50); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className="hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{title}</h1>
        <p className="text-lg mb-6">{subtitle}</p>
        <br />
        {showScrollText && <div className="scroll-overlay">↓ Scroll down</div>}
      </div>
    </>
  );
};

export default HeroSection;
