import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../BlogCard/BlogCard";
import "../ImageGrid/ImageGrid.css";

const OtherBlogs = ({ excludeId }) => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

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
        let blogsArray = [];

        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data && typeof data === "object") {
          if (data.$values && Array.isArray(data.$values)) {
            blogsArray = data.$values;
          } else if (data.value && Array.isArray(data.value)) {
            blogsArray = data.value;
          } else if (data.blogs && Array.isArray(data.blogs)) {
            blogsArray = data.blogs;
          } else if (data.items && Array.isArray(data.items)) {
            blogsArray = data.items;
          } else if (data.data && Array.isArray(data.data)) {
            blogsArray = data.data;
          } else {
            for (const key in data) {
              if (Array.isArray(data[key]) && data[key].length > 0) {
                if (
                  data[key][0].title ||
                  data[key][0].description ||
                  data[key][0].content
                ) {
                  blogsArray = data[key];
                  break;
                }
              }
            }
          }
        }

        const stripHtmlTags = (html) => {
          if (!html) return "";
          return html.replace(/<[^>]*>/g, "");
        };

        const tryDecodeBase64 = (str) => {
          try {
            if (typeof str === "string" && /^[A-Za-z0-9+/=]+$/.test(str)) {
              return atob(str);
            }
          } catch {
            // Intentionally left empty to handle invalid base64 strings gracefully
          }
          return str;
        };

        const limitWords = (text, wordLimit) => {
          if (!text) return "";
          const words = text.split(/\s+/);
          return (
            words.slice(0, wordLimit).join(" ") +
            (words.length > wordLimit ? "..." : "")
          );
        };

        const formattedBlogs = blogsArray.map((blog) => {
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;

          let description = (() => {
            let desc = blog.description;
            if (!desc && blog.blog) {
              desc = blog.blog.description || blog.blog.Description;
            }
            if (desc && typeof desc === "string") {
              desc = stripHtmlTags(tryDecodeBase64(desc));
            }
            desc = desc || "No description available";
            return limitWords(desc, 50);
          })();

          return {
            id: blogId,
            img:
              blog.coverImageUrl ??
              blog.CoverImageUrl ??
              blog.imageUrl ??
              "/default-blog-image.jpg",
            topic: blog.title ?? blog.Title ?? "Untitled",
            briefDescription: description,
            writerName: blog.author ?? "Anonymous",
            reactionCount: blog.NumberOfReacts ?? blog.numberOfReacts ?? 0,
            commentCount: blog.numberOfComments ?? blog.CommentCount ?? 0,
            location: blog.location ?? blog.Location ?? "",
          };
        });

        const filteredBlogs = excludeId
          ? formattedBlogs.filter(
              (blog) => blog.id !== excludeId && blog.id !== undefined
            )
          : formattedBlogs;

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

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
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
          <BlogCard
            key={blog.id || `blog-${Math.random()}`}
            blog={blog}
            onClick={handleBlogClick}
            showAuthor={true}
            showMeta={true}
            showLocation={false}
            cardType="default"
            customClass="other-blog-card"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination button">
          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded-lg mr-2 disabled:opacity-50"
            >
              Previous
            </button>

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
  excludeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OtherBlogs;
