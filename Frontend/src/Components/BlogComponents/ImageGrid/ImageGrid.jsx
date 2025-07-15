import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaFeatherAlt,
  FaThumbsUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ImageGrid.css";

const ImageGrid = () => {
  const navigate = useNavigate();
  const scrollContainerRefLatest = useRef(null);
  const scrollContainerRefTrending = useRef(null);

  const [latestBlogs, setLatestBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:5030/api/blog/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        let blogsArray = [];

        if (data.$values) {
          blogsArray = data.$values;
        } else if (Array.isArray(data)) {
          blogsArray = data;
        }

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

        const limitWords = (text, wordLimit) => {
          if (!text) return "";
          const words = text.split(/\s+/);
          if (words.length <= wordLimit) {
            return text;
          }
          return words.slice(0, wordLimit).join(" ") + "...";
        };

        const processedBlogs = blogsArray.map((blog) => {
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;

          let desc = blog.description;
          if (!desc && blog.blog) {
            desc = blog.blog.description || blog.blog.Description;
          }
          if (desc && typeof desc === "string") {
            desc = stripHtmlTags(tryDecodeBase64(desc));
          }

          const briefDescription = limitWords(
            desc || "No description available",
            50
          );

          return {
            id: blogId,
            topic: blog.title ?? blog.Title ?? "Untitled",
            writerName: blog.author ?? blog.Author ?? "Anonymous",
            img:
              blog.coverImageUrl ??
              blog.CoverImageUrl ??
              "/default-blog-image.jpg",
            briefDescription,
            location: blog.location ?? blog.Location ?? "",
            commentCount: blog.numberOfComments ?? blog.CommentCount ?? 0,
            reactionCount: blog.numberOfReacts ?? blog.ReactionCount ?? 0,
            createdAt: new Date(blog.createdAt ?? blog.CreatedAt ?? Date.now()),
          };
        });

        const sortedByDate = [...processedBlogs].sort(
          (a, b) => b.createdAt - a.createdAt
        );

        const sortedByEngagement = [...processedBlogs].sort(
          (a, b) =>
            b.commentCount +
            b.reactionCount -
            (a.commentCount + a.reactionCount)
        );

        setLatestBlogs(sortedByDate.slice(0, 10));
        setTrendingBlogs(sortedByEngagement.slice(0, 10));
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleNavigate = (blogId) => {
    if (blogId) {
      navigate(`/blog/${blogId}`);
    }
  };

  const handleScrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const renderBlogCards = (blogs) =>
    blogs.length > 0 ? (
      blogs.map((blog) => (
        <div
          key={blog.id}
          className="blog-card"
          onClick={() => handleNavigate(blog.id)}
        >
          <img
            src={blog.img}
            alt={blog.topic}
            className="blog-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-blog-image.jpg";
            }}
          />
          <h3 className="blog-title">{blog.topic}</h3>
          <p className="blog-description">{blog.briefDescription}</p>
          <p className="blog-meta">
            <span className="meta-item">
              <FaComment className="icon" />
              <span>
                Comments {blog.commentCount > 0 ? `(${blog.commentCount})` : ""}
              </span>
            </span>
            <span className="meta-item">
              <FaThumbsUp className="icon" />
              <span>
                Likes {blog.reactionCount > 0 ? `(${blog.reactionCount})` : ""}
              </span>
            </span>
          </p>
          <p className="paragraph-muted author-line">
            <FaFeatherAlt className="icon" />
            written by {blog.writerName}
          </p>
        </div>
      ))
    ) : (
      <p className="no-blogs">No blogs available</p>
    );

  return (
    <div className="custom-container">
      {/* Latest Blogs */}
      <div>
        <h2 className="LatestBlogsHeading">Latest Blogs</h2>
        <div className="ScrollButtonsSection">
          <button
            className="ScrollButtonLeft"
            onClick={() => handleScrollLeft(scrollContainerRefLatest)}
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollContainerRefLatest}
            className="scroll-container"
            style={{ scrollBehavior: "smooth" }}
          >
            {renderBlogCards(latestBlogs)}
          </div>
          <button
            className="scroll-button-right"
            onClick={() => handleScrollRight(scrollContainerRefLatest)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Trending Blogs */}
      <div className="TrendingBlogsSection">
        <h2 className="TrendingBlogsHeading">Trending Blogs</h2>
        <div className="ScrollButtonsSection">
          <button
            className="ScrollButtonLeft"
            onClick={() => handleScrollLeft(scrollContainerRefTrending)}
          >
            <FaChevronLeft />
          </button>
          <div
            ref={scrollContainerRefTrending}
            className="scroll-container"
            style={{ scrollBehavior: "smooth" }}
          >
            {renderBlogCards(trendingBlogs)}
          </div>
          <button
            className="scroll-button-right"
            onClick={() => handleScrollRight(scrollContainerRefTrending)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
