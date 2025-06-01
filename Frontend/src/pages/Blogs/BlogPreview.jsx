import axios from "axios";
import React, { useEffect, useState } from "react";
import "./../CSS/BlogPreview.css"; // Adjust the path if needed

const BlogPreview = ({ Id }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5030/api/blog/${Id}`
        );
        setBlog(response.data);
      } catch (err) {
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [Id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!blog) return null;

  return (
    <div className="blog-preview">
      <img src={blog.coverImage} alt="Cover" className="cover-image" />
      <div className="content">
        <h2 className="topic">{blog.title}</h2>
        <p className="author">By {blog.author}</p>
        <div className="meta">
          <span className="reacts">👍 {blog.numberOfReacts}</span>
          <span className="comments">💬 {blog.numberOfComments}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
