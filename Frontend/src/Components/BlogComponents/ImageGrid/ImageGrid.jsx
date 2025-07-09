import React, { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./ImageGrid.css";
import PropTypes from "prop-types";

const ImageGrid = ({ latestBlogs, trendingBlogs }) => {
  const navigate = useNavigate();
  const scrollContainerRefLatest = useRef(null); // Create ref for scrolling container
  const scrollContainerRefTrending = useRef(null); // Create ref for scrolling container
  const [currentPage, setCurrentPage] = useState(1);
 //onst blogsPerPage = 6; // Number of blogs per page

  // Pagination logic for Other Blogs
  // const indexOfLastBlog = currentPage * blogsPerPage;
  // const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  // const currentBlogs = otherBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  // const totalPages = Math.ceil(otherBlogs.length / blogsPerPage);

  const handleNavigate = (index) => {
    navigate(`/blog/blog${index + 1}`); // Navigate dynamically
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
    <div className="container mx-auto px-4 py-8">
      {/* Latest Blogs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
        <div className="relative flex items-center">
          {/* 🔹 Scroll Left Button */}
          <button
            className="absolute left-0 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            onClick={()=>handleScrollLeft(scrollContainerRefLatest)}
          >
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div
            ref={scrollContainerRefLatest}
            className="flex overflow-x-auto space-x-4 scrollbar-hide p-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {latestBlogs.map((blog, index) => (
              <div
                key={index}
                className="min-w-[300px] p-4 shadow-2xl rounded-lg cursor-pointer"
                onClick={() => handleNavigate(index)}
              >
                <img
                  src={blog.img}
                  alt={blog.topic}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="text-gray-600">
                  <Link
                    to={`/profile/${blog.writerName}`}
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {blog.writerName}
                  </Link>
                </p>
                <h3 className="font-semibold">{blog.topic}</h3>
                <p className="text-gray-600">{blog.briefDescription}</p>
                <p className="inline-flex items-center space-x-2">
                  <span>Date</span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-xl" />
                    <span>Comments</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-xl" />
                    <span>Likes</span>
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* 🔹 Scroll Right Button */}
          <button
            className="absolute right-0 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            onClick={()=>handleScrollRight(scrollContainerRefLatest)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Trending Blogs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Trending Blogs</h2>
        <div className="relative flex items-center">
          {/* 🔹 Scroll Left Button */}
          <button
            className="absolute left-0 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            onClick={()=>handleScrollLeft(scrollContainerRefTrending)}
          >
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div
            ref={scrollContainerRefTrending}
            className="flex overflow-x-auto space-x-4 scrollbar-hide p-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {trendingBlogs.map((blog, index) => (
              <div
                key={index}
                className="min-w-[300px] p-4 shadow-2xl rounded-lg cursor-pointer"
                onClick={() => handleNavigate(index)}
              >
                <img
                  src={blog.img}
                  alt={blog.topic}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <p className="text-gray-600">
                  <Link
                    to={`/profile/${blog.writerName}`}
                    className="text-blue-500 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {blog.writerName}
                  </Link>
                </p>
                <h3 className="font-semibold">{blog.topic}</h3>
                <p className="text-gray-600">{blog.briefDescription}</p>
                <p className="inline-flex items-center space-x-2">
                  <span>Date</span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-xl" />
                    <span>Comments</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment className="text-xl" />
                    <span>Likes</span>
                  </span>
                </p>
              </div>
            ))}
          </div>

          <button
            className="absolute right-0 z-10 bg-gray-200 p-2 rounded-full shadow-md"
            onClick={()=>handleScrollRight(scrollContainerRefTrending)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Other Blogs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Other Blogs</h2>
        <div className="grid grid-cols-2 gap-y-6 gap-x-6 ml-25 mr-25">
          {currentBlogs.map((blog, index) => (
            <div
              key={index}
              className="p-4 shadow-2xl rounded-lg cursor-pointer"
              onClick={() => handleNavigate(index)}
            >
              <img
                src={blog.img}
                alt={blog.topic}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-gray-600">
                <Link
                  to={`/profile/${blog.writerName}`}
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {blog.writerName}
                </Link>
              </p>
              <h3 className="font-semibold">{blog.topic}</h3>
              <p className="text-gray-600">{blog.briefDescription}</p>
              <p className="inline-flex items-center space-x-2">
                <span>Date</span>
                <span className="flex items-center gap-1">
                  <FaComment className="text-xl" />
                  <span>Comments</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaComment className="text-xl" />
                  <span>Likes</span>
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="pagination">
          <div className="flex justify-center mt-4">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded-lg mr-2 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Pagination Numbers */}
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white active"
                      : "bg-gray-300 text-black"
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
=======
      
>>>>>>> ae193ec88690f31e2b95ff3acb633b5eb8b0e6cf
    </div>
  );
};
ImageGrid.propTypes = {
  latestBlogs: PropTypes.array.isRequired,
  trendingBlogs: PropTypes.array.isRequired,
  otherBlogs: PropTypes.array.isRequired,
};


export default ImageGrid;
