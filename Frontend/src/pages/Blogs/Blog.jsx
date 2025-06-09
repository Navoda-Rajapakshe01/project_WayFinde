import React, { useEffect } from "react";
import OtherBlogs from "../../Components/BlogComponents/BlogSections/OtherBlogs";
import ImageGrid from "../../Components/BlogComponents/ImageGrid/ImageGrid";
import blogData from "../../Components/BlogComponents/blogData.json";
import HeroSection from "../../Components/HeroSection/HeroSection";
import "../CSS/Blog.css";

const backgroundImage = "/Blogimages/blogbackground1.jpg";

const { latestBlogData, trendingBlogData } = blogData;
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
      />
      <OtherBlogs />
    </div>
  );
};

export default Blog;
