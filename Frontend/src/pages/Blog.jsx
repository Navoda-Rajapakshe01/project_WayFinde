import React, { useState } from "react";
import HeroSection from "../Components/HeroSection/HeroSection";

// import backgroundImage from "../assets/Images/Blogimages/blogbackground1.jpg";

import "../pages/CSS/Blog.css";
import ImageGrid from "../Components/BlogComponents/ImageGrid/ImageGrid";
import blogData from "../Components/BlogComponents/blogData.json";

const backgroundImage = "/Blogimages/blogbackground1.jpg"; // Correct path from public folder

const { latestBlogData, trendingBlogData, otherBlogData } = blogData;
const Blog = () => {
  const [visibleBlogs, setVisibleBlogs] = useState(otherBlogData.slice(0, 4)); // Show only 4 initially

  // const handleShowMore = () => {
  //   setVisibleBlogs(otherBlogData.slice(0, visibleBlogs.length + 2)); // Load 2 more blogs each time
  // };
  return (
    <div className="page-container">
      <HeroSection
        title={
          <>
            Insights, Stories, and Ideas Await! <br />
          </>
        }
        subtitle="Explore our latest blog posts and get inspired."
        backgroundImage={backgroundImage}
        placeHolder="Search blog posts..."
      />
      <ImageGrid
        latestBlogs={latestBlogData}
        trendingBlogs={trendingBlogData}
        otherBlogs={otherBlogData}
      />
    </div>
  );
};

export default Blog;
