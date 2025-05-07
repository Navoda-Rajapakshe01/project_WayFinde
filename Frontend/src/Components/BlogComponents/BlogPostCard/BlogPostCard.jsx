import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaCalendarAlt, FaTag } from "react-icons/fa"; 
import "./BlogPostCard.css";

const BlogPostCard = ({
  title,
  excerpt, 
  image,
  author,
  date,
  category,
  slug, 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${slug}`); 
  };

  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'N/A';

  return (
    <article className="blog-post-card" onClick={handleCardClick} role="link" tabIndex="0"
             onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}>
      <div className="blog-card-image-wrapper">
        <img
          src={image || "https://via.placeholder.com/400x250/cccccc/808080?text=Blog+Image"} 
          alt={title || "Blog post image"}
          className="blog-card-image"
        />
        {category && <span className="blog-card-category-badge">{category}</span>}
      </div>

      <div className="blog-card-content">
        <h3 className="blog-card-title">
          {title || "Untitled Post"}
        </h3>
        <div className="blog-card-metadata">
          {author && (
            <span className="meta-item author">
              <FaUserEdit /> {author}
            </span>
          )}
          {date && (
            <span className="meta-item date">
              <FaCalendarAlt /> {formattedDate}
            </span>
          )}
        </div>
        <p className="blog-card-excerpt">{excerpt || "No excerpt available."}</p>
        <div className="blog-card-read-more">
          Read More →
        </div>
      </div>
    </article>
  );
};

export default BlogPostCard;