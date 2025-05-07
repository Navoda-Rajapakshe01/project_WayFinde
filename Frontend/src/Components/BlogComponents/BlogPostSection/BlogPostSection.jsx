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
  const navigate = useNavigate();

  useEffect(() => {
    const posts = [
      {
        id: 1,
        title: "A Hiker's Paradise: Conquering the Peaks of Ella",
        // content: "This is the content of the first post. It talks about the wonderful experience...",
        excerpt:
          "Discover the breathtaking trails and panoramic views that make Ella a must-visit for any hiking enthusiast.",
        image:
          "https://via.placeholder.com/400x250/87CEFA/FFFFFF?text=Hiking+in+Ella", // Use compelling, relevant images
        author: "Alex P.",
        date: "2023-10-15", // Format: YYYY-MM-DD for easier sorting
        updatedAt: "2023-10-15",
        category: "Adventure", // Optional
        slug: "hikers-paradise-ella", // For URL
      },
      {
        id: 2,
        title: "Culinary Journey Through Sri Lanka's Coastal Towns",
        excerpt:
          "From fresh seafood to spicy curries, explore the rich flavors that define Sri Lankan coastal cuisine.",
        image:
          "https://via.placeholder.com/400x250/90EE90/FFFFFF?text=Sri+Lankan+Food",
        author: "Maria S.",
        date: "2023-10-12",
        updatedAt: "2023-10-12",
        category: "Food & Culture",
        slug: "sri-lankan-coastal-cuisine",
      },
      {
        id: 3,
        title: "Unveiling the Secrets of Ancient Sigiriya",
        excerpt:
          "Step back in time and explore the history, art, and legends surrounding the magnificent Sigiriya rock fortress.",
        image:
          "https://via.placeholder.com/400x250/ADD8E6/FFFFFF?text=Sigiriya+Fortress",
        author: "John D.",
        date: "2023-10-10",
        updatedAt: "2023-10-10",
        category: "History",
        slug: "secrets-of-sigiriya",
      },
      {
        id: 4,
        title: "Top 5 Secluded Beaches for a Relaxing Getaway",
        excerpt:
          "Escape the crowds and find your own slice of paradise with our guide to Sri Lanka's most beautiful hidden beaches.",
        image:
          "https://via.placeholder.com/400x250/FFB6C1/FFFFFF?text=Secluded+Beaches",
        author: "Sarah L.",
        date: "2023-10-08",
        updatedAt: "2023-10-08",
        category: "Travel Tips",
        slug: "top-secluded-beaches",
      },
    ];

    const sortedPosts = posts.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    setBlogPosts(sortedPosts);
  }, []);
  const postsToShow = 3;
  const displayedPosts = blogPosts.slice(0, postsToShow);

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
