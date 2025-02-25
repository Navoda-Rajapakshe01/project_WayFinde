import React, { useState, useEffect } from "react";
import BlogPostCard from "../BlogPostCard/BlogPostCard"; // Import the BlogPostCard component
import "./BlogPostSection.css";

const BlogPostSection = () => {
  // Assuming you fetch blog posts from an API or database
  const [blogPosts, setBlogPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(4); // Number of posts to show initially

  useEffect(() => {
    // Fetch blog posts (simulated here with static data)
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

  const loadMorePosts = () => {
    setVisiblePosts(visiblePosts + 4); // Load 4 more posts
  };

  return (
    <div className="blog-post-section">
      <h2>Blog Posts</h2>
      <div className="blog-posts">
        {blogPosts.slice(0, visiblePosts).map((post, index) => (
          <BlogPostCard key={index} {...post} />
        ))}
      </div>
      {visiblePosts < blogPosts.length && (
        <button onClick={loadMorePosts}>See More</button>
      )}
    </div>
  );
};

export default BlogPostSection;
