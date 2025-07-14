import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaCommentAlt, FaThumbsUp, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ProfileHeadSection from "../../Components/UserProfileComponents/ProfileHeadsection/ProfileHeadsection";
import "../CSS/ProfileBlogs.css";

const ProfileBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

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
        setUser(userData);

        const currentUserId = userData.id || userData.Id;
        if (!currentUserId) throw new Error("Unable to determine user ID");

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
          }
        }

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
          } catch (e) {}
          return str;
        };

        const processedBlogs = userBlogs.map((blog) => {
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;

          let desc = blog.description;
          if (!desc && blog.blog) {
            desc = blog.blog.description || blog.blog.Description;
          }
          if (desc && typeof desc === "string") {
            desc = stripHtmlTags(tryDecodeBase64(desc));
          }
          const briefDescription = (desc || "No description available") + "...";

          return {
            id: blogId,
            title: blog.title ?? blog.Title ?? "Untitled",
            author:
              blog.author ?? blog.Author ?? userData.username ?? "Anonymous",
            briefDescription,
            location: blog.location ?? blog.Location ?? "",
            coverImageUrl:
              blog.coverImageUrl ?? blog.CoverImageUrl ?? blog.imageUrl ?? "",
            commentCount:
              blog.numberOfComments ??
              blog.NumberOfComments ??
              blog.commentCount ??
              blog.CommentCount ??
              blog.commentsCount ??
              0,
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
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!blogId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5030/api/blog/delete/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        const updatedBlogCount = response.data.blogCount;
        setProfile((prevProfile) => ({
          ...prevProfile,
          blogCount: updatedBlogCount,
        }));
        setError(null);
        setSuccessMessage("Blog deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (error.response.status === 403) {
          setError("You don't have permission to delete this blog.");
        } else if (error.response.status === 404) {
          setError("Blog not found.");
        } else {
          setError("Server error occurred.");
        }
      } else if (error.request) {
        setError("No response from server.");
      } else {
        setError("Failed to delete blog. Please try again.");
      }
    }
  };

  const writeBlog = () => {
    navigate("/profile/profileBlogs/blogEditor");
  };

  if (loading) {
    return (
      <div className="profile-blogs-container">
        {successMessage && (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "green" }}>
            {successMessage}
          </p>
        )}
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
                <p className="blog-description">{blog.briefDescription}</p>

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
                      e.stopPropagation();
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
