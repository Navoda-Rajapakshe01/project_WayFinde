import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaThumbsUp,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./ImageGrid.css";

const ImageGrid = () => {
  const navigate = useNavigate();

  const scrollContainerRefLatest = useRef(null);
  const scrollContainerRefTrending = useRef(null);

  // State for blogs
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
        console.log("Blog API response:", data);

        // Handle different response formats
        let blogsArray = [];
        if (data.$values) {
          blogsArray = data.$values;
        } else if (Array.isArray(data)) {
          blogsArray = data;
        } else {
          console.warn("Unexpected blog data format", data);
          blogsArray = [];
        }

        // Process the blogs to standardize properties
        const processedBlogs = blogsArray.map((blog) => ({
          id: blog.id || blog.Id || blog.blogId || blog.BlogId,
          topic: blog.title || blog.Title || "Untitled",
          writerName: blog.author || blog.Author || "Anonymous",
          img:
            blog.coverImageUrl ||
            blog.CoverImageUrl ||
            "/default-blog-image.jpg",
          briefDescription:
            (blog.description || blog.Description || "").substring(0, 100) +
            "...",
          commentCount: blog.numberOfComments || blog.CommentCount || 0,
          reactionCount: blog.numberOfReacts || blog.ReactionCount || 0,
          createdAt: new Date(blog.createdAt || blog.CreatedAt || Date.now()),
        }));

        // Sort for latest blogs (by date)
        const sortedByDate = [...processedBlogs].sort(
          (a, b) => b.createdAt - a.createdAt
        );

        // Sort for trending blogs (by reactions + comments)
        const sortedByEngagement = [...processedBlogs].sort(
          (a, b) =>
            b.commentCount +
            b.reactionCount -
            (a.commentCount + a.reactionCount)
        );

        // Take the top blogs (limit to 10 or however many you want to display)
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
    } else {
      console.error("Blog ID is undefined");
    }

  };

  // Scroll Left
  const handleScrollLeft = (scrollContainerRef) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll Right
  const handleScrollRight = (scrollContainerRef) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="custom-container">
      {/* Latest Blogs Section */}
      <div>
        <h2 className="LatestBlogsHeading">Latest Blogs</h2>
        <div className="ScrollButtonsSection">
          {/* Scroll Left Button */}
          <button
            className="ScrollButtonLeft"
            onClick={() => handleScrollLeft(scrollContainerRefLatest)}>
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div
            ref={scrollContainerRefLatest}
            className="scroll-container"

            style={{ scrollBehavior: "smooth" }}
          >
            {latestBlogs.length > 0 ? (
              latestBlogs.map((blog) => (
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
                  <p className="paragraph-muted">
                    <Link
                      to={`/profile/${blog.writerName}`}
                      className="profile-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {blog.writerName}
                    </Link>
                  </p>
                  <h3 className="blog-title">{blog.topic}</h3>
                  <p className="blog-description">{blog.briefDescription}</p>
                  <p className="blog-meta">
                    <span className="meta-item">
                      <FaComment className="icon" />
                      <span>
                        Comments{" "}
                        {blog.commentCount > 0 ? `(${blog.commentCount})` : ""}
                      </span>
                    </span>
                    <span className="meta-item">
                      <FaThumbsUp className="icon" />
                      <span>
                        Likes{" "}
                        {blog.reactionCount > 0
                          ? `(${blog.reactionCount})`
                          : ""}
                      </span>
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="no-blogs">No latest blogs available</p>
            )}

          </div>

          {/* Scroll Right Button */}
          <button
            className="scroll-button-right"
            onClick={() => handleScrollRight(scrollContainerRefLatest)}>
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Trending Blogs Section */}
      <div className="TrendingBlogsSection">
        <h2 className="TrendingBlogsHeading">Trending Blogs</h2>
        <div className="ScrollButtonsSection">
          {/* Scroll Left Button */}
          <button
            className="ScrollButtonLeft"
            onClick={() => handleScrollLeft(scrollContainerRefTrending)}>
            <FaChevronLeft />
          </button>

          {/* Blog Cards in Horizontal Scroll */}
          <div
            ref={scrollContainerRefTrending}
            className="scroll-container"

            style={{ scrollBehavior: "smooth" }}
          >
            {trendingBlogs.length > 0 ? (
              trendingBlogs.map((blog) => (
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
                  <p className="paragraph-muted">
                    <Link
                      to={`/profile/${blog.writerName}`}
                      className="profile-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {blog.writerName}
                    </Link>
                  </p>
                  <h3 className="blog-title">{blog.topic}</h3>
                  <p className="blog-description">{blog.briefDescription}</p>
                  <p className="blog-meta">
                    <span>{blog.createdAt.toLocaleDateString()}</span>
                    <span className="meta-item">
                      <FaComment className="icon" />
                      <span>
                        Comments{" "}
                        {blog.commentCount > 0 ? `(${blog.commentCount})` : ""}
                      </span>
                    </span>
                    <span className="meta-item">
                      <FaThumbsUp className="icon" />
                      <span>
                        Likes{" "}
                        {blog.reactionCount > 0
                          ? `(${blog.reactionCount})`
                          : ""}
                      </span>
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="no-blogs">No trending blogs available</p>
            )}

          </div>

          <button
            className="scroll-button-right"
            onClick={() => handleScrollRight(scrollContainerRefTrending)}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
