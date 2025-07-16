import React from "react";
import PropTypes from "prop-types";
import { FaComment, FaFeatherAlt, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({
  blog,
  onClick,
  showAuthor = true,
  showMeta = true,
  showLocation = false,
  customClass = "",
  cardType = "default", // 'default', 'compact', etc.
}) => {
  const navigate = useNavigate();

  if (!blog) {
    // Prevent rendering if blog data is missing
    return null;
  }

  const {
    id,
    img = "/default-blog-image.jpg",
    topic = "Untitled",
    briefDescription = "No description available",
    location,
    commentCount = 0,
    reactionCount = 0,
    writerName = "Anonymous",
  } = blog;

  const handleCardClick = () => {
    if (onClick) {
      onClick(id);
    } else if (id) {
      navigate(`/blog/${id}`);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/default-blog-image.jpg";
  };

  return (
    <div
      className={`blog-card ${cardType} ${customClass}`}
      onClick={handleCardClick}
    >
      <img
        src={img}
        alt={topic}
        className="blog-image"
        onError={handleImageError}
      />

      <div className="blog-content">
        <h3 className="blog-title">{topic}</h3>

        <p className="blog-description">{briefDescription}</p>

        {showLocation && location && (
          <p className="blog-location">📍 {location}</p>
        )}

        {showMeta && (
          <div className="blog-meta">
            <span className="meta-item">
              <FaComment className="icon" />
              <span>
                Comments {commentCount > 0 ? `(${commentCount})` : ""}
              </span>
            </span>
            <span className="meta-item">
              <FaThumbsUp className="icon" />
              <span>
                Likes {reactionCount > 0 ? `(${reactionCount})` : ""}
              </span>
            </span>
          </div>
        )}

        {showAuthor && (
          <p className="paragraph-muted author-line">
            <FaFeatherAlt className="icon" />
            written by {writerName}
          </p>
        )}
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    img: PropTypes.string,
    topic: PropTypes.string,
    briefDescription: PropTypes.string,
    location: PropTypes.string,
    commentCount: PropTypes.number,
    reactionCount: PropTypes.number,
    writerName: PropTypes.string,
  }),
  onClick: PropTypes.func,
  showAuthor: PropTypes.bool,
  showMeta: PropTypes.bool,
  showLocation: PropTypes.bool,
  customClass: PropTypes.string,
  cardType: PropTypes.string,
};

export default BlogCard;
