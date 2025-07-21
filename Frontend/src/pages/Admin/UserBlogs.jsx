import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/UserBlogs.css";

const UserBlogs = () => {
  const { userId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5030/api/Blog/all")
      .then(res => {
        const userBlogs = res.data.filter(
          b => b.User && (b.User.Id === userId || b.User.id === userId)
        );
        setBlogs(userBlogs);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="admin-user-blogs-loading">Loading blogs...</div>;

  return (
    <div className="admin-user-blogs-container">
      <h2 className="admin-user-blogs-title">User's Blogs</h2>
      {blogs.length === 0 ? (
        <p className="admin-user-blogs-empty">No blogs found.</p>
      ) : (
        <div className="admin-user-blogs-grid">
          {blogs.map(blog => (
            <div className="admin-blog-card" key={blog.Id || blog.id}>
              <div className="admin-blog-card-header">
                {blog.Title || blog.title}
                {blog.status && (
                  <span className="admin-blog-card-badge">{blog.status}</span>
                )}
              </div>
              <div className="admin-blog-card-content">
                <div className="admin-blog-card-meta">
                  Author: {blog.User?.Username || blog.User?.username || "Unknown"}
                </div>
                <div className="admin-blog-card-description">
                  {blog.Description || blog.description || "No description."}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogs; 