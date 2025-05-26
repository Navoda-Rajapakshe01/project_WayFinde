import React, { useEffect, useState } from "react";
import { FaCommentAlt, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileSettings = () => {
  const [blogs, setBlogs] = useState([]); // Always initialize as empty array
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile and blogs from backend
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
        console.log("Blogs length:", blogsData ? blogsData.length : 'N/A');
        
        if (Array.isArray(blogsData)) {
          setBlogs(blogsData);
          console.log("Successfully set blogs array with length:", blogsData.length);
        } else {
          console.warn("Blogs data is not an array or is null/undefined:", blogsData);
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

  const handleFileClick = () => {
    navigate("/uploadNewBlog"); // Navigate to your blog upload page
  };

  const handleBlogDisplay = () => {
    navigate("/pages/Blogs/BlogPriview"); // Navigate to your blog upload page
  };

  const writeBlog = () => {
    navigate("/profile/profileBlogs/blogEditor"); // Navigate to your blog upload page
  };

  if (loading) {
    return (
      <div>
        <ProfileHeadSection user={user} />
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading...
        </div>
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
    <div>
      <ProfileHeadSection user={user} />

      <div className="carousel-container">
        {/* Debug information */}
        {/* <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br />
          Blogs array length: {blogs.length}<br />
          User data: {user ? 'Loaded' : 'Not loaded'}<br />
          <strong>Raw API Response:</strong><br />
          {user && (
            <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
          <strong>Blogs Data:</strong><br />
          <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
            {JSON.stringify(blogs, null, 2)}
          </pre>
        </div> */}
        
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No blogs uploaded yet.
          </p>
        ) : (
          blogs.map((blog, index) => (
            <div onClick={handleBlogDisplay} className="blog-card" key={index}>
              <img 
                src={blog.coverImageUrl} 
                alt="Blog" 
                className="blog-image"
                onError={(e) => {
                  e.target.src = '/placeholder-image.jpg'; // Fallback image
                }}
              />
              <div className="blog-content">
                <p className="blog-name">{blog.title}</p>
                <p className="blog-topic">
                  <strong>{blog.location !== "undefined" ? blog.location : "No location specified"}</strong>
                </p>
                <p className="blog-description">Author: {blog.author}</p>
                <div className="blog-actions">
                  <span>
                    <FaCommentAlt className="icon" /> Comments
                  </span>
                  <span>
                    <FaThumbsUp className="icon" /> Likes
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
          <button onClick={writeBlog} className="UploadBlogButton">
            Write blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;