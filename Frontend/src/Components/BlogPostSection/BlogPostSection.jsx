import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import BlogPostCard from "../BlogPostCard/BlogPostCard"; // Import the BlogPostCard component
import "./BlogPostSection.css";

const BlogPostSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(4); // Number of posts to show initially
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    // Fetch blog posts (simulated here with static data)
    const posts = [
      {
        id: 1,
        title: "Post 1",
        content: "This is the content of the first post.",
        image: "https://via.placeholder.com/150",
        updatedAt: "2023-10-01", // Add a timestamp or date field
      },
      {
        id: 2,
        title: "Post 2",
        content: "This is the content of the second post.",
        image: "https://via.placeholder.com/150",
        updatedAt: "2023-10-05",
      },
      {
        id: 3,
        title: "Post 3",
        content: "This is the content of the third post.",
        image: "https://via.placeholder.com/150",
        updatedAt: "2023-10-03",
      },
      {
        id: 4,
        title: "Post 4",
        content: "This is the content of the fourth post.",
        image: "https://via.placeholder.com/150",
        updatedAt: "2023-10-07",
      },
      {
        id: 5,
        title: "Post 5",
        content: "This is the content of the fifth post.",
        image: "https://via.placeholder.com/150",
        updatedAt: "2023-10-02",
      },
    ];

    // Sort posts by the `updatedAt` field in descending order (newest first)
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    setBlogPosts(sortedPosts);
  }, []);

  // Function to handle "See More" button click
  const handleSeeMoreClick = () => {
    navigate("/Blog"); // Redirect to the blog posts page
  };

  return (
    <div className="blog-post-section">
      <h2>Blog Posts</h2>
      <div className="blog-posts">
        {blogPosts.slice(0, visiblePosts).map((post) => (
          <BlogPostCard key={post.id} {...post} />
        ))}
      </div>
      {visiblePosts < blogPosts.length && (
        <button className="see-more" onClick={handleSeeMoreClick}>
          See More
        </button>
      )}
    </div>
  );
};

export default BlogPostSection;
