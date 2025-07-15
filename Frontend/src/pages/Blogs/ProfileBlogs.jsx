import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import BlogCard from "../../Components/BlogComponents/BlogCard/BlogCard";
import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(null); // Define successMessage

  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch user profile data
        const profileResponse = await fetch(
          "http://localhost:5030/api/profile/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await profileResponse.json();
        console.log("User profile data:", userData);
        setUser(userData);

        // Get current user ID to filter blogs
        const currentUserId = userData.id || userData.Id;

        if (!currentUserId) {
          console.error("User ID not found in profile data");
          throw new Error("Unable to determine user ID");
        }

        // Step 2: Fetch all blogs with comment and reaction counts from the same endpoint
        const blogsResponse = await fetch(
          "http://localhost:5030/api/blog/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!blogsResponse.ok) {
          throw new Error(`HTTP error! Status: ${blogsResponse.status}`);
        }

        const data = await blogsResponse.json();

        // Log the full response structure for debugging
        console.log("API Response Type:", typeof data);
        console.log(
          "API Response Structure:",
          JSON.stringify(data).substring(0, 200) + "..."
        );

        // Better extraction of blogs array with more robust checks (same as OtherBlogs)
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
          console.log(`Found ${blogsArray.length} total blogs`);
          // Log the structure of the first blog for debugging
          if (blogsArray[0]) {
            console.log(
              "First blog structure:",
              JSON.stringify(blogsArray[0], null, 2)
            );
          }
        }

        // Step 3: Filter blogs to get only those from current user
        const userBlogs = blogsArray.filter((blog) => {
          const blogUserId =
            blog.userId ||
            blog.UserId ||
            (blog.user && (blog.user.id || blog.user.Id));
          return blogUserId === currentUserId;
        });

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

        const processedBlogs = userBlogs.map((blog) => {
          // Ensure we have a valid ID by checking all possible property names
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
            topic: blog.title ?? blog.Title ?? "Untitled",
            writerName:
              blog.author ?? blog.Author ?? userData.username ?? "Anonymous",
            briefDescription: description,
            location: blog.location ?? blog.Location ?? "",
            img:
              blog.coverImageUrl ??
              blog.CoverImageUrl ??
              blog.imageUrl ??
              "/placeholder-image.jpg",
            commentCount:
              blog.numberOfComments ??
              blog.NumberOfComments ??
              blog.commentCount ??
              blog.CommentCount ??
              blog.commentsCount ??
              0,

            // Extract reaction count with more robust property checking (same as OtherBlogs)
            reactionCount:
              blog.NumberOfReacts ??
              blog.numberOfReacts ??
              blog.reactionCount ??
              blog.ReactionCount ??
              blog.reactionsCount ??
              blog.ReactionsCount ??
              blog.likesCount ??
              0,
          };
        });

        setBlogs(processedBlogs);
      } catch (error) {
        console.error("Error fetching profile and blogs:", error.message);
        setError(error.message);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBlogs();
  }, []);

  const handleBlogClick = (blogId) => {
    if (blogId) {
      navigate(`/blog/${blogId}`);
    } else {
      console.error("Blog ID is undefined");
    }
  };

  const handleDeleteBlog = async (blogId, event) => {
    // Prevent the blog card click event from firing
    if (event) {
      event.stopPropagation();
    }

    if (!blogId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5030/api/blog/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Remove the deleted blog from the state
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        console.log("Blog deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Failed to delete blog. Please try again.");
    }
  };

  const writeBlog = () => {
    navigate("/profile/profileBlogs/blogEditor");
  };

  // Custom BlogCard component for profile blogs with delete functionality
  const ProfileBlogCard = ({ blog }) => {
    return (
      <div className="profile-blog-card-wrapper">
        <BlogCard
          blog={blog}
          onClick={handleBlogClick}
          showAuthor={false} // Don't show author since it's the user's own blog
          showMeta={true}
          showLocation={true}
          cardType="default"
          customClass="profile-blog-card"
        />
        <div className="blog-actions-overlay">
          <button
            className="delete-blog-btn"
            onClick={(e) => handleDeleteBlog(blog.id, e)}
            title="Delete blog"
          >
            <FaTrash className="icon" />
            Delete
          </button>
        </div>
      </div>
    );
  };
  ProfileBlogCard.propTypes = {
    blog: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      topic: PropTypes.string,
      writerName: PropTypes.string,
      briefDescription: PropTypes.string,
      location: PropTypes.string,
      img: PropTypes.string,
      commentCount: PropTypes.number,
      reactionCount: PropTypes.number,
    }).isRequired,
  };

  if (loading) {
    return (
      <div className="profile-blogs-container">
        <ProfileHeadSection user={user} />
        <div className="blog-container">
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Loading blogs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-blogs-container">
        <ProfileHeadSection user={user} />
        <div className="blog-container">
          <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-blogs-container">
      <ProfileHeadSection user={user} />

      {successMessage && (
        <div className="success-message">
          <p style={{ textAlign: "center", color: "green" }}>
            {successMessage}
          </p>
        </div>
      )}

      <div className="blog-container">
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No blogs uploaded yet.
          </p>
        ) : (
          <div className="profile-blogs-grid">
            {blogs.map((blog, index) => (
              <ProfileBlogCard
                key={blog.id || `blog-${index}`}
                blog={blog}
              />
            ))}
          </div>
        )}
      </div>

      <div className="profile-settings">
        <div className="button-wrapper">
          <button onClick={writeBlog} className="UploadBlogButton">
            Write blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlogs;