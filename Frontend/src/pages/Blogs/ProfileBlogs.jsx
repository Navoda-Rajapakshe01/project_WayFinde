import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCommentAlt, FaThumbsUp, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

        console.log(`Found ${userBlogs.length} blogs for current user`);

        // Step 4: Process blog data with comment and reaction counts (using same logic as OtherBlogs)
        const processedBlogs = userBlogs.map((blog) => {
          // Ensure we have a valid ID by checking all possible property names
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;

          // Log if ID might be missing
          if (blogId === undefined) {
            console.warn("Blog missing ID:", blog);
          }

          return {
            id: blogId,
            title: blog.title ?? blog.Title ?? "Untitled",
            author:
              blog.author ?? blog.Author ?? userData.username ?? "Anonymous",
            location: blog.location ?? blog.Location ?? "",
            coverImageUrl:
              blog.coverImageUrl ?? blog.CoverImageUrl ?? blog.imageUrl ?? "",

            // Extract comment count with more robust property checking (same as OtherBlogs)
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

  const handleBlogDisplay = (blogId) => {
    if (blogId) {
      navigate(`/blog/${blogId}`);
    } else {
      console.error("Blog ID is undefined");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!blogId) {
      console.error("Blog ID is undefined");
      return;
    }

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

      <div className="blog-container">
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No blogs uploaded yet.
          </p>
        ) : (
          blogs.map((blog, index) => (
            <div
              onClick={() => handleBlogDisplay(blog.id)}
              className="blog-card"
              key={blog.id || index}
            >
              <img
                src={blog.coverImageUrl}
                alt="Blog"
                className="blog-image"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />

              <div className="blog-content">
                <p className="blog-name">{blog.title}</p>
                <p className="blog-topic">
                  <strong>
                    {blog.location !== "undefined" && blog.location
                      ? blog.location
                      : "No location specified"}
                  </strong>
                </p>
                
                <div className="blog-actions">
                  <span>
                    <FaCommentAlt className="icon" />
                    Comments{" "}
                    {blog.commentCount > 0 ? `(${blog.commentCount})` : "(0)"}
                  </span>
                  <span>
                    <FaThumbsUp className="icon" />
                    Likes{" "}
                    {blog.reactionCount > 0 ? `(${blog.reactionCount})` : "(0)"}
                  </span>

                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering blog display
                      handleDeleteBlog(blog.id);
                    }}
                  >
                    <FaTrash className="icon" /> Delete
                  </span>
                </div>
              </div>
            </div>
          ))
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
