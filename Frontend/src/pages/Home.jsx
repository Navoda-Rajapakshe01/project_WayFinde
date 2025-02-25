import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import LocationSection from "../Components/LocationSection/LocationSection";
import BlogPostSection from "../Components/BlogPostSection/BlogPostSection";

function Home() {
  return (
    <>
      <HeroSection />
      <LocationSection />
      <BlogPostSection />
    </>
  );
}

export default Home;
