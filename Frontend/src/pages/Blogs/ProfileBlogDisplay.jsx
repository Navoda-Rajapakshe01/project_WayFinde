import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../CSS/ProfileBlogDisplay.css"; // Adjust the path as necessary

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch("http://localhost:5030/api/blog/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch blog");

        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error loading blog:", error);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="blog-details">
      <h2>{blog.title}</h2>
      <img src={blog.coverImageUrl} alt={blog.title} />
      <p>
        <strong>Location:</strong> {blog.location}
      </p>
      <p>
        <strong>Author:</strong> {blog.author}
      </p>
      <p>{blog.content}</p>
    </div>
  );
};

export default BlogDetails;
