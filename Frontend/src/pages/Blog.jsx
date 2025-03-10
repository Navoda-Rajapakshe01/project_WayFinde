import React, { useState } from "react";
import HeroSection from "../Components/HeroSection/HeroSection";
import BeachImage from "../assets/Images/Blogimages/beach1.jpg";
import backgroundImage from "../assets/Images/Blogimages/blogbackground1.jpg";
import sinharajaForestImage from "../assets/Images/Blogimages/sinharajaforest.jpg";
import "../pages/CSS/Blog.css";
import ImageGrid from "../Components/BlogComponents/ImageGrid/ImageGrid";

const latestBlogData = [
  {
    img: BeachImage,
    writerName: "Name1",
    topic: "Topic 1",
    briefDescription: "Description",
  },
  {
    img: BeachImage,
    writerName: "Name2",
    topic: "Topic 2",
    briefDescription: "Another description",
  },
  {
    img: BeachImage,
    writerName: "Name3",
    topic: "Topic 3",
    briefDescription: "Yet another description",
  },
  {
    img: BeachImage,
    writerName: "Name4",
    topic: "Topic 4",
    briefDescription: "Final description",
  },
];
// const writersName = [Name1, Name2, Name3, Name4];
const trendingBlogData = [
  {
    img: sinharajaForestImage,
    writerName: "Name1",
    topic: "Topic 1",
    briefDescription: "Description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name2",
    topic: "Topic 2",
    briefDescription: "Another description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name3",
    topic: "Topic 3",
    briefDescription: "Yet another description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name4",
    topic: "Topic 4",
    briefDescription: "Final description",
  },
];
const otherBlogData = [
  {
    img: BeachImage,
    writerName: "Name1",
    topic: "Topic 1",
    briefDescription: "Description",
  },
  {
    img: BeachImage,
    writerName: "Name2",
    topic: "Topic 2",
    briefDescription: "Another description",
  },
  {
    img: BeachImage,
    writerName: "Name3",
    topic: "Topic 3",
    briefDescription: "Yet another description",
  },
  {
    img: BeachImage,
    writerName: "Name4",
    topic: "Topic 4",
    briefDescription: "Final description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name1",
    topic: "Topic 1",
    briefDescription: "Description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name2",
    topic: "Topic 2",
    briefDescription: "Another description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name3",
    topic: "Topic 3",
    briefDescription: "Yet another description",
  },
  {
    img: sinharajaForestImage,
    writerName: "Name4",
    topic: "Topic 4",
    briefDescription: "Final description",
  },
];
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
