import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./ImageGrid.css";
import PropTypes from "prop-types";

const ImageGrid = ({ latestBlogs, trendingBlogs, otherBlogs }) => {
  const navigate = useNavigate();
  const scrollContainerRefLatest = useRef(null); // Create ref for scrolling container
  const scrollContainerRefTrending = useRef(null); // Create ref for scrolling container
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6; // Number of blogs per page

  // Pagination logic for Other Blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = otherBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(otherBlogs.length / blogsPerPage);

  const handleNavigate = (index) => {
    navigate(`/blog/${index + 1}`); // Navigate dynamically
  };

  // 🔹 Scroll Left
  const handleScrollLeft = (scrollContainerRef) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // 🔹 Scroll Right
  const handleScrollRight = (scrollContainerRef) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="custom-container">
      {/* Latest Blogs Section */}
      <div>
        <h2 className="LatestBlogsHeading">Latest Blogs</h2>
        <div className="ScrollButtonsSection">
          {/* 🔹 Scroll Left Button */}
          <button
            className="ScrollButtonLeft"
            onClick={() => handleScrollLeft(scrollContainerRefLatest)}
          >
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div
            ref={scrollContainerRefLatest}
            className="scroll-container"
            style={{ scrollBehavior: "smooth" }}
          >
            {latestBlogs.map((blog, index) => (
              <div
                key={index}
                className="blog-card"
                onClick={() => handleNavigate(index)}
              >
                <img src={blog.img} alt={blog.topic} className="blog-image" />
                <p className="paragraph-muted">
                  <Link
                    to={`/profile/${blog.writerName}`}
                    className="profile-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {blog.writerName}
                  </Link>
                </p>
                <h3 className="blog-title">{blog.topic}</h3>
                <p className="blog-description">{blog.briefDescription}</p>
                <p className="blog-meta">
                  <span>Date</span>
                  <span className="meta-item">
                    <FaComment className="icon" />
                    <span>Comments</span>
                  </span>
                  <span className="meta-item">
                    <FaComment className="icon" />
                    <span>Likes</span>
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* 🔹 Scroll Right Button */}
          <button
            className="scroll-button-right"
            onClick={() => handleScrollRight(scrollContainerRefLatest)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Trending Blogs Section */}
      <div className="TrendingBlogsSection">
        <h2 className="TrendingBlogsHeading">Trending Blogs</h2>
        <div className="ScrollButtonsSection">
          {/* 🔹 Scroll Left Button */}
          <button
            className="ScrollButtonLeft"
            onClick={() => handleScrollLeft(scrollContainerRefTrending)}
          >
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div
            ref={scrollContainerRefTrending}
            className="scroll-container"
            style={{ scrollBehavior: "smooth" }}
          >
            {trendingBlogs.map((blog, index) => (
              <div
                key={index}
                className="blog-card"
                onClick={() => handleNavigate(index)}
              >
                <img src={blog.img} alt={blog.topic} className="blog-image" />
                <p className="paragraph-muted">
                  <Link
                    to={`/profile/${blog.writerName}`}
                    className="profile-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {blog.writerName}
                  </Link>
                </p>
                <h3 className="blog-title">{blog.topic}</h3>
                <p className="blog-description">{blog.briefDescription}</p>
                <p className="blog-meta">
                  <span className="meta-item">
                    <FaComment className="icon" />
                    <span>Comments</span>
                  </span>
                  <span className="meta-item">
                    <FaComment className="icon" />
                    <span>Likes</span>
                  </span>
                </p>
              </div>
            ))}
          </div>

          <button
            className="scroll-button-right"
            onClick={() => handleScrollRight(scrollContainerRefTrending)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Other Blogs Section */}
      <div className="OtherBlogsSection">
        <h2 className="TrendingBlogsHeading">Other Blogs</h2>
        <div className="other-blog-grid">
          {currentBlogs.map((blog, index) => (
            <div
              key={index}
              className="blog-card"
              onClick={() => handleNavigate(index)}
            >
              <img src={blog.img} alt={blog.topic} className="blog-image" />
              <p className="paragraph-muted">
                <Link
                  to={`/profile/${blog.writerName}`}
                  className="tprofile-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {blog.writerName}
                </Link>
              </p>
              <h3 className="blog-title">{blog.topic}</h3>
              <p className="blog-description">{blog.briefDescription}</p>
              <p className="blog-meta">
                <span className="meta-item">
                  <FaComment className="icon" />
                  <span>Comments</span>
                </span>
                <span className="meta-item">
                  <FaComment className="icon" />
                  <span>Likes</span>
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="pagination button">
          <div className="pagination-container">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded-lg mr-2 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Pagination Numbers */}
            <div className="pagination-number-container">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === index + 1
                      ? "pagination-page active"
                      : "pagination-page"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded-lg ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
ImageGrid.propTypes = {
  latestBlogs: PropTypes.array.isRequired,
  trendingBlogs: PropTypes.array.isRequired,
  otherBlogs: PropTypes.array.isRequired,
};


export default ImageGrid;
