import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogPostCard from "../BlogPostCard/BlogPostCard";
import "./BlogPostSection.css";
import "../../../App.css";

const BlogPostSection = ({
  title = "Latest Stories from Our Travelers",
  subtitle = "Insights, tips, and adventures shared by our vibrant community.",
  showViewAllButton = true,
}) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5030/api/blog/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        // Handle .NET $values or direct array
        let blogsArray = [];
        if (data.$values) {
          blogsArray = data.$values;
        } else if (Array.isArray(data)) {
          blogsArray = data;
        }
        // Map and sort by engagement (comments + reactions)
        const processedBlogs = blogsArray.map((blog) => {
          const blogId = blog.id ?? blog.Id ?? blog.blogId ?? blog.BlogId;
          let desc = blog.description;
          if (!desc && blog.blog) {
            desc = blog.blog.description || blog.blog.Description;
          }
          if (desc && typeof desc === "string") {
            desc = desc.replace(/<[^>]*>/g, "");
          }
          const briefDescription = (desc || "No description available").split(/\s+/).slice(0, 50).join(" ") + (desc && desc.split(/\s+/).length > 50 ? "..." : "");
          return {
            id: blogId,
            title: blog.title ?? blog.Title ?? "Untitled",
            excerpt: briefDescription,
            image: blog.coverImageUrl ?? blog.CoverImageUrl ?? "/default-blog-image.jpg",
            author: blog.author ?? blog.Author ?? "Anonymous",
            date: blog.createdAt ?? blog.CreatedAt ?? blog.date ?? blog.Date,
            category: blog.category ?? blog.Category ?? undefined,
            slug: blogId,
            commentCount: blog.numberOfComments ?? blog.CommentCount ?? 0,
            reactionCount: blog.numberOfReacts ?? blog.ReactionCount ?? 0,
          };
        });
        // Sort by engagement (comments + reactions)
        const sortedByEngagement = processedBlogs.sort(
          (a, b) => (b.commentCount + b.reactionCount) - (a.commentCount + a.reactionCount)
        );
        setBlogPosts(sortedByEngagement);
      } catch (err) {
        setError(err.message);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularBlogs();
  }, []);

  const postsToShow = 3;
  const displayedPosts = blogPosts.slice(0, postsToShow);

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  if (displayedPosts.length === 0) {
    return null;
  }

  return (
    <section className="blog-section section-padding">
      <div className="container">
        <div className="homesection-header text-center">
          <h2 className="homesection-title">{title}</h2>
          {subtitle && <p className="homesection-subtitle">{subtitle}</p>}
        </div>

        <div className="blog-posts-grid">
          {displayedPosts.map((post) => (
            <BlogPostCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              author={post.author}
              date={post.date}
              category={post.category}
              slug={post.slug}
            />
          ))}
        </div>

        {showViewAllButton && blogPosts.length > postsToShow && (
          <div className="view-all-container text-center">
            <a href="/blog" className="homebtn homebtn-outline">Read More Blogs</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPostSection;
