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

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div style={{maxWidth: 800, margin: '0 auto', padding: 32}}>
      <h2>User's Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <ul>
          {blogs.map(blog => (
            <li key={blog.Id || blog.id}>{blog.Title || blog.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBlogs; 