import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ImageGrid = ({ latestBlogs, trendingBlogs, otherBlogs }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5; // Number of blogs per page

  // Pagination logic for Other Blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = otherBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(otherBlogs.length / blogsPerPage);

  const handleNavigate = (index) => {
    navigate(`/blog/blog${index + 1}`); // Navigate dynamically
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Latest Blogs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
        <div className="relative flex items-center">
          {/* Scroll Left Button */}
          <button className="absolute left-0 z-10 bg-gray-200 p-2 rounded-full">
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
            {latestBlogs.map((blog, index) => (
              <div
                key={index}
                className="min-w-[300px] p-4 border rounded-lg cursor-pointer"
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
                <p className="inline-flex items-center">
                  Date
                  <FaComment className="text-xl" /> Comments
                  <FaComment className="text-xl" /> Likes
                </p>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button className="absolute right-0 z-10 bg-gray-200 p-2 rounded-full">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Trending Blogs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Trending Blogs</h2>
        <div className="relative flex items-center">
          {/* Scroll Left Button */}
          <button className="absolute left-0 z-10 bg-gray-200 p-2 rounded-full">
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
            {trendingBlogs.map((blog, index) => (
              <div
                key={index}
                className="min-w-[300px] p-4 border rounded-lg cursor-pointer"
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
                <p className="inline-flex items-center">
                  Date
                  <FaComment className="text-xl" /> Comments
                  <FaComment className="text-xl" /> Likes
                </p>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button className="absolute right-0 z-10 bg-gray-200 p-2 rounded-full">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Other Blogs Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Other Blogs</h2>
        <div className="grid grid-cols-1 gap-y-6">
          {currentBlogs.map((blog, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg cursor-pointer"
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
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded-lg mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
