import React, { useEffect, useState } from "react";
import { FaCommentAlt, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileSettings = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const writeBlog = () => {
    navigate("/profile/profileBlogs/blogEditor"); // Navigate to your blog upload page
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
            <div className="blog-card" key={index}>
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
