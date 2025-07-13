import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../ImageGrid/ImageGrid.css";

const OtherBlogs = ({ excludeId }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  // Pagination logic for Other Blogs - FIXED: using blogs not otherBlogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5030/api/blog/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Log the full response structure - not just the data
        console.log("API Response Type:", typeof data);
        console.log(
          "API Response Structure:",
          JSON.stringify(data).substring(0, 200) + "..."
        );

        // Better extraction of blogs array with more robust checks
        let blogsArray = [];

        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data && typeof data === "object") {
          // Check for various possible response formats
          if (data.$values && Array.isArray(data.$values)) {
            blogsArray = data.$values; // .NET reference tracking format
          } else if (data.value && Array.isArray(data.value)) {
            blogsArray = data.value; // Common REST API format
          } else if (data.blogs && Array.isArray(data.blogs)) {
            blogsArray = data.blogs; // Custom wrapper format
          } else if (data.items && Array.isArray(data.items)) {
            blogsArray = data.items; // Another common format
          } else if (data.data && Array.isArray(data.data)) {
            blogsArray = data.data; // Another common format
          }
        }

        // If still empty, log detailed error
        if (blogsArray.length === 0) {
          console.error("Could not find blogs array in API response:", data);
          console.error(
            "Response structure:",
            JSON.stringify(data, null, 2).substring(0, 500) + "..."
          );
        } else {
          console.log(`Found ${blogsArray.length} blogs`);
          // Log the structure of the first blog for debugging
          if (blogsArray[1]) {
            console.log(
              "First blog structure:",
              JSON.stringify(blogsArray[1], null, 2)
            );
          }
        }

        // Format data with more robust property access
        const formattedBlogs = blogsArray.map((blog) => {
          // Ensure we have a valid ID by checking all possible property names
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;

          // Log if ID might be missing
          if (blogId === undefined) {
            console.warn("Blog missing ID:", blog);
          }

          return {
            id: blogId,
            img:
              blog.coverImageUrl ??
              blog.CoverImageUrl ??
              blog.imageUrl ??
              "/default-blog-image.jpg",
            topic: blog.title ?? blog.Title ?? "Untitled",
            briefDescription:
              (blog.description ??
                blog.Description ??
                (typeof blog.content === "string"
                  ? blog.content.substring(0, 100)
                  : null) ??
                (typeof blog.Content === "string"
                  ? blog.Content.substring(0, 100)
                  : null) ??
                "No description available") + "...",
            writerName:
              blog.author ??
              blog.Author ??
              blog.user?.username ??
              blog.User?.username ??
              blog.user?.Username ??
              blog.User?.Username ??
              "Anonymous",

            reactionCount:
              blog.NumberOfReacts ??
              blog.numberOfReacts ??
              blog.reactionCount ??
              blog.ReactionCount ??
              blog.reactionsCount ??
              blog.ReactionsCount ??
              blog.likesCount ??
              0,

            commentCount: blog.numberOfComments ?? blog.numberOfComments ?? 0,
          };
        });

        // Filter out current blog if excludeId is provided
        const filteredBlogs = excludeId
          ? formattedBlogs.filter(
              (blog) => blog.id !== excludeId && blog.id !== undefined
            )
          : formattedBlogs;

        console.log(`After filtering: ${filteredBlogs.length} blogs remain`);
        setBlogs(filteredBlogs);
        setError(null);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error.message);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [excludeId]);

  const handleNavigate = (blogId) => {
    navigate(`/blog/${blogId}`); // Use actual blog ID
  };

  if (loading) {
    return (
      <div className="custom-container">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="custom-container">
        <p>No blogs available</p>
      </div>
    );
  }

  return (
    <div className="custom-container">
      <h2 className="TrendingBlogsHeading">Other Blogs</h2>
      <div className="other-blog-grid">
        {currentBlogs.map((blog) => (
          <div
            key={blog.id || `blog-${Math.random()}`}
            className="blog-card"
            onClick={() => handleNavigate(blog.id)}
          >
            <img
              src={blog.img}
              alt={blog.topic}
              className="blog-image"
              onError={(e) => {
                e.target.src = "/default-blog-image.jpg"; // Fallback image
              }}
            />
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
                <span>
                  Comments{" "}
                  {blog.commentCount > 0 ? `(${blog.commentCount})` : ""}
                </span>
              </span>
              <span className="meta-item">
                <FaThumbsUp className="icon" />
                <span>
                  Likes{" "}
                  {blog.reactionCount > 0 ? `(${blog.reactionCount})` : ""}
                </span>
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Enhanced pagination controls with page numbers */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

OtherBlogs.propTypes = {
  excludeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Accept both string and number IDs
};

export default OtherBlogs;
