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

        // COMPREHENSIVE LOGGING START
        console.group('API Response Details');
        console.log('Raw API Response:', data);

        // Check for response structure type
        if (Array.isArray(data)) {
          console.log('Response type: Direct array of blogs');
        } else if (data?.$values) {
          console.log('Response type: .NET serialized collection with $values');
        } else {
          console.log('Response type: Object containing blogs');
        }

        // Check a sample blog if available
        if (Array.isArray(data) && data.length > 0) {
          console.log('Sample blog:', data[0]);
        } else if (data?.$values && data.$values.length > 0) {
          console.log('Sample blog:', data.$values[0]);
        }

        // Examine properties of sample blog
        const sampleBlog = Array.isArray(data) ? data[0] : 
                          (data?.$values ? data.$values[0] : null);

        if (sampleBlog) {
          console.group('Blog Properties');
          console.log('ID:', sampleBlog.id || sampleBlog.Id || sampleBlog.blogId || sampleBlog.BlogId);
          console.log('Title:', sampleBlog.title || sampleBlog.Title);
          console.log('Description field:', sampleBlog.description || sampleBlog.Description);
          console.log('Content field:', sampleBlog.content || sampleBlog.Content);
          console.log('Author:', sampleBlog.author || sampleBlog.Author);
          console.log('Image URL:', sampleBlog.coverImageUrl || sampleBlog.CoverImageUrl);
          console.log('Reactions:', sampleBlog.reactionCount || sampleBlog.ReactionCount || 
                      sampleBlog.numberOfReacts || sampleBlog.NumberOfReacts);
          console.log('Comments:', sampleBlog.commentCount || sampleBlog.CommentCount || 
                      sampleBlog.numberOfComments || sampleBlog.NumberOfComments);
          console.groupEnd();
        }
        console.groupEnd();
        // COMPREHENSIVE LOGGING END

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
          } else if (data.results && Array.isArray(data.results)) {
            blogsArray = data.results;
          } else if (data.content && Array.isArray(data.content)) {
            blogsArray = data.content;
          } else {
            // Last resort: Try to find any array in the response
            for (const key in data) {
              if (Array.isArray(data[key]) && data[key].length > 0) {
                if (data[key][0].title || data[key][0].description || data[key][0].content) {
                  blogsArray = data[key];
                  console.log(`Found blogs array in field: ${key}`);
                  break;
                }
              }
            }
          }
        }

        // Log the extracted blogs array
        console.log(`Found ${blogsArray.length} blogs in the response`);
        if (blogsArray.length > 0) {
          console.log('First blog in extracted array:', blogsArray[0]);
        }

        // Helper function to strip HTML tags
        const stripHtmlTags = (html) => {
          if (!html) return "";
          return html.replace(/<[^>]*>/g, '');
        };

        // Helper function to try decoding base64
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

        // Format data with more robust property access
        const formattedBlogs = blogsArray.map((blog) => {
          // Ensure we have a valid ID by checking all possible property names
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;

          // Log if ID might be missing
          if (blogId === undefined) {
            console.warn("Blog missing ID:", blog);
          }
          
          // Debug description extraction for this specific blog
          const availableDescription = blog.description || blog.Description;
          const availableContent = blog.content || blog.Content;

          // Extract description with more robust approach
          let description = (() => {
            // Try to get description first
            let desc = blog.description || blog.Description;
            
            // If no description found, try to get content
            if (!desc) {
              const content = blog.content || blog.Content;
              if (typeof content === "string") {
                desc = content.substring(0, 100);
              }
            }
            
            // If still no description, check for nested objects
            if (!desc && blog.blog) {
              desc = blog.blog.description || blog.blog.Description;
            }
            
            // Process the description if available (strip HTML, decode if needed)
            if (desc && typeof desc === "string") {
              desc = stripHtmlTags(tryDecodeBase64(desc));
            }
            
            // If still no description, provide default
            return (desc || "No description available") + "...";
          })();

          // Log only for blogs that would end up with "No description available"
          if (!availableDescription && !availableContent) {
            console.group(`Debug blog ${blogId || 'unknown'}`);
            console.log('Blog object keys:', Object.keys(blog));
            console.log('Blog raw data:', blog);
            console.log('Description fields not found');
            console.groupEnd();
          }

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

        // LOG PROCESSED BLOGS
        console.group('Processed Blog Data');
        console.log('Total blogs found:', formattedBlogs.length);
        if (formattedBlogs.length > 0) {
          console.log('First processed blog:', formattedBlogs[0]);
          console.log('Description used:', formattedBlogs[0].briefDescription);
          
          // Check if any blogs are missing descriptions
          const missingDescriptions = formattedBlogs.filter(blog => 
            blog.briefDescription === "No description available...");
          
          if (missingDescriptions.length > 0) {
            console.warn(`${missingDescriptions.length} blogs are missing descriptions`);
            console.log('Sample blog missing description:', missingDescriptions[0]);
          }
        }
        console.groupEnd();

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

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  if (loading) {
    return (
      <div className="custom-container-blog">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="custom-container-blog">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="custom-container-blog">
        <p>No blogs available</p>
      </div>
    );
  }

  return (
    <div className="custom-container-blog">
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