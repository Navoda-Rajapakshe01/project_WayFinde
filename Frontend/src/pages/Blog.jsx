import React from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import ImageGrid from "../Components/ImageGrid/ImageGrid";

import BeachImage from "../assets/Images/Blogimages/beach1.jpg";

const images = [
  BeachImage,
  BeachImage,
  BeachImage,
  BeachImage,
  
];
const Blog = () => {
  return (
    <div className="page-container">
      <HeroSection
        title={
          <>
            Insights, Stories, and Ideas Await! <br />
          </>
        }
        subtitle="Explore our latest blog posts and get inspired."
        backgroundImage="https://res.cloudinary.com/enchanting/q_70,f_auto,c_lfill,g_auto/exodus-web/2022/05/sri-lanka.jpg"
        placeHolder="Search blog posts..."
      />
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
        <ImageGrid images={images} />
        <h1 className="text-3xl font-bold mb-6">Trending Blog Posts</h1>
        <ImageGrid images={images} />
      </div>
    </div>
  );
};

export default Blog;
