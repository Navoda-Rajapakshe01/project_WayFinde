import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCommentAlt, FaThumbsUp, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileSettings = () => {
  const [blogs, setBlogs] = useState([]); // Always initialize as empty array
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5030/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        console.log("=== FULL API RESPONSE ===");
        console.log(JSON.stringify(data, null, 2));

        setUser(data);

        // Handle Entity Framework JSON serialization format
        let blogsData = null;

        // Check for different possible blog locations
        if (data.Blogs && data.Blogs.$values) {
          // Entity Framework format with capital B
          blogsData = data.Blogs.$values;
          console.log("Found blogs in Blogs.$values:", blogsData);
        } else if (data.blogs && data.blogs.$values) {
          // Entity Framework format with lowercase b
          blogsData = data.blogs.$values;
          console.log("Found blogs in blogs.$values:", blogsData);
        } else if (data.Blogs && Array.isArray(data.Blogs)) {
          // Direct array with capital B
          blogsData = data.Blogs;
          console.log("Found blogs in Blogs (direct array):", blogsData);
        } else if (data.blogs && Array.isArray(data.blogs)) {
          // Direct array with lowercase b
          blogsData = data.blogs;
          console.log("Found blogs in blogs (direct array):", blogsData);
        } else {
          console.log("No blogs found in expected locations");
          console.log("Available keys:", Object.keys(data));
        }

        console.log("Final blogs data:", blogsData);
        console.log("Blogs length:", blogsData ? blogsData.length : "N/A");

        if (Array.isArray(blogsData)) {
          setBlogs(blogsData);
          console.log(
            "Successfully set blogs array with length:",
            blogsData.length
          );
        } else {
          console.warn(
            "Blogs data is not an array or is null/undefined:",
            blogsData
          );
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching profile and blogs:", error.message);
        setError(error.message);
        setBlogs([]); // Ensure blogs remains an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBlogs();
  }, []);

  // const handleFileClick = () => {
  //   window.scrollTo(0, 0);
  //   navigate("/uploadNewBlog"); // Navigate to your blog upload page
  // };

  const handleBlogDisplay = (blogId) => {
    console.log("Navigating to blog ID:", blogId);
    window.scrollTo(0, 0);
    navigate(`/blog/${blogId}`);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5030/api/blog/delete/${blogId}`);
      alert("Blog deleted successfully.");
      // optionally refresh blog list
      // Remove the deleted blog from the state
      setBlogs((prevBlogs) =>
        prevBlogs.filter(
          (blog) =>
            (blog.id || blog.Id || blog.blogId || blog.BlogId) !== blogId
        )
      );
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog.");
    }
  };

  const writeBlog = () => {
    window.scrollTo(0, 0);
    navigate("/profile/profileBlogs/blogEditor");
  };

  if (loading) {
    return (
      <div>
        <ProfileHeadSection user={user} />
        <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ProfileHeadSection user={user} />
        <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
          Error: {error}
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
              onClick={() => {
                console.log("FULL BLOG OBJECT:", blog); // Add this line
                console.log("Available properties:", Object.keys(blog));
                handleBlogDisplay(
                  blog.id || blog.Id || blog.blogId || blog.BlogId
                );
              }}
              className="blog-card"
              key={blog.id || blog.Id || blog.blogId || blog.BlogId || index}
            >
              <img
                src={blog.coverImageUrl}
                alt="Blog"
                className="blog-image"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg"; // Fallback image
                }}
              />

              <div className="blog-content">
                <p className="blog-name">{blog.title}</p>
                <p className="blog-topic">
                  <strong>
                    {blog.location !== "undefined"
                      ? blog.location
                      : "No location specified"}
                  </strong>
                </p>
                <p className="blog-description">Author: {blog.author}</p>
                <div className="blog-actions">
                  <span>
                    <FaCommentAlt className="icon" /> Comments
                  </span>
                  <span>
                    <FaThumbsUp className="icon" /> Likes
                  </span>

                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering blog display
                      handleDeleteBlog(
                        blog.id || blog.Id || blog.blogId || blog.BlogId
                      );
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
          {/* <button onClick={handleFileClick} className="UploadBlogButton">
            Add Blog
          </button> */}
          <button onClick={writeBlog} className="UploadBlogButton">
            Write blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
