import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogPostCard from "../../BlogComponents/BlogPostCard/BlogPostCard";
import "./Blogs.css";

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const posts = [
      {
        title: "Post 1",
        content: "This is the content of the first post.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "Post 2",
        content: "This is the content of the second post.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "Post 3",
        content: "This is the content of the third post.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "Post 4",
        content: "This is the content of the fourth post.",
        image: "https://via.placeholder.com/150",
      },
      {
        title: "Post 5",
        content: "This is the content of the fifth post.",
        image: "https://via.placeholder.com/150",
      },
    ];

    setBlogPosts(posts);
  }, []);

  const handleSeeMore = () => {
    navigate("/blog"); // Redirect to the blogs page
  };

  return (
    <div className="blogs">
      <h1>Blogs</h1>
      <div className="blog-post-section">
        <div className="blog-posts">
          {blogPosts.slice(0, visiblePosts).map((post, index) => (
            <BlogPostCard key={index} {...post} />
          ))}
        </div>
        <br />
        <br />
        {visiblePosts < blogPosts.length && (
          <button className="see-more" onClick={handleSeeMore}>
            See More
          </button>
        )}
      </div>
    </div>
  );
};

export default Blogs;
