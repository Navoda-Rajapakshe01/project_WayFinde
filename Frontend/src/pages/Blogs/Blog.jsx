import React from "react";
import { useEffect } from "react";
import HeroSection from "../../Components/HeroSection/HeroSection";
import ImageGrid from "../../Components/BlogComponents/ImageGrid/ImageGrid";
import blogData from "../../Components/BlogComponents/blogData.json";
import "../CSS/Blog.css"; 

const backgroundImage = "/Blogimages/blogbackground1.jpg";

const { latestBlogData, trendingBlogData, otherBlogData } = blogData;
const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        showSearchBar={true}
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
