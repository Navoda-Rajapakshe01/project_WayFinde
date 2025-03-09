import React, { useState } from "react";
import ImageGrid from "../Components/BlogComponents/ImageGrid/ImageGrid";
import HeroSection from "../Components/HeroSection/HeroSection";
import BeachImage from "../assets/Images/Blogimages/beach1.jpg";
import backgroundImage from "../assets/Images/Blogimages/blogbackground1.jpg";
import sinharajaForestImage from "../assets/Images/Blogimages/sinharajaforest.jpg";
import "../pages/CSS/Blog.css";

const latestBlogs = [
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
const trendingBlogs = [
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
const allBlogs = [
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
  const [visibleBlogs, setVisibleBlogs] = useState(allBlogs.slice(0, 4)); // Show only 4 initially

  const handleShowMore = () => {
    setVisibleBlogs(allBlogs.slice(0, visibleBlogs.length + 2)); // Load 2 more blogs each time
  };
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
        <ImageGrid images={latestBlogs} />
        <h1 className="text-3xl font-bold mb-6">Trending Blog Posts</h1>
        <ImageGrid images={trendingBlogs} />
      </div>
      <ImageGrid images={visibleBlogs} />

      {visibleBlogs.length < allBlogs.length && ( // Show button only if more blogs exist
        <div className="flex justify-center items-center m-5">
          <button onClick={handleShowMore} className="showMoreButton">
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
