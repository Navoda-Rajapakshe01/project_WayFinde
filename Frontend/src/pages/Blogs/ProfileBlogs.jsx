import React, { useEffect, useState } from "react";
import { FaCommentAlt, FaThumbsUp, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileSettings = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //Delete blog from user profile
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this blog?"
  );
  if (!confirmDelete) return;
  
  console.log("Deleting blog with ID:", id, "Type:", typeof id);
  
  // Ensure ID is a valid integer
  const blogId = parseInt(id);
  if (isNaN(blogId) || blogId <= 0) {
    alert("Invalid blog ID");
    return;
  }
  
  try {
    // Fixed URL to match backend endpoint (blogs plural)
    const response = await fetch(`http://localhost:5030/api/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json", // Added content-type header
      },
    });
    
    console.log("Response status:", response.status);
    console.log("Response:", response); // Additional logging

    if (response.ok) {
      alert("Blog deleted successfully.");
      // Refresh list or remove blog from state
      // You might want to call a function to refresh your blog list here
      // e.g., fetchBlogs() or setBlogList(prevBlogs => prevBlogs.filter(blog => blog.id !== id))
    } else {
      // Get detailed error information
      const errorData = await response.json().catch(() => ({}));
      console.error("Delete failed - Full error:", errorData);
      
      // Log specific validation errors if they exist
      if (errorData.errors) {
        console.error("Validation errors:", errorData.errors);
      }
      
      alert(`Failed to delete blog: ${errorData.title || errorData.message || 'Validation error'}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("An error occurred while deleting. Please check your connection.");
  }
};
  // Fetch user profile and blogs from backend
  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5030/api/profile/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
        setBlogs(data.blogs || []);
      } catch (error) {
        console.error("Error fetching profile and blogs:", error.message);
      }
    };

    fetchProfileAndBlogs();
  }, []);

  const handleFileClick = () => {
    navigate("/uploadNewBlog"); // Navigate to your blog upload page
  };

  return (
    <div>
      <ProfileHeadSection user={user} />

      <div className="carousel-container">
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No blogs uploaded yet.
          </p>
        ) : (
          blogs.map((blog, index) => (
            <div className="blog-card"
            key={index}
            onClick={() => navigate(`/blog/${blog.id}`)}
            style={{ cursor: "pointer" }} // Optional: indicate clickable
            >
              <img src={blog.coverImageUrl} alt="Blog" className="blog-image" />
              <div className="blog-content">
                <p className="blog-name">{blog.title}</p>
                <p className="blog-topic">
                  <strong>{blog.location}</strong>
                </p>
                <p className="blog-description">Author: {blog.author}</p>
                <div className="blog-actions">
                  <span>
                    <FaCommentAlt className="icon" /> Comments
                  </span>
                  <span>
                    <FaThumbsUp className="icon" /> Likes
                  </span>
                  <span onClick={() => handleDelete(blog.id)}>
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
          <button onClick={handleFileClick} className="UploadBlogButton">
            Upload Blog Document (.doc/.docx)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
