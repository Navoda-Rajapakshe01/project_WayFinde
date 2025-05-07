import React from "react";
import "./BlogPostCard.css";

const BlogPostCard = ({ title, content, image }) => {
  return (
    <div className="blog-post-card">
      <img src={image} alt={title} />

      <div className="blog-post-info">
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default BlogPostCard;
