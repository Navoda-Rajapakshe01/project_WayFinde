import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../CSS/BlogPreview.css";

function BlogPreview() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No blog ID provided");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:5030/api/blog/display/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError(err.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="loading">Loading blog...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!blog) return <div className="error">Blog not found</div>;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="blog-container">
      {blog.coverImageUrl && (
        <img 
          src={blog.coverImageUrl} 
          alt="Cover" 
          className="blog-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className="blog-header">
        <h1 className="blog-title">{blog.title}</h1>
        <div className="blog-meta">
          <span>✍️ {blog.author || blog.user?.name || 'Unknown Author'}</span>
          <span>📅 {formattedDate}</span>
          {blog.location && <span>📍 {blog.location}</span>}
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.blogUrl }}
      />
      
      <div className="blog-stats">
        <span>👁️ {blog.numberOfReads} reads</span>
        <span>💬 {blog.numberOfComments} comments</span>
        <span>❤️ {blog.numberOfReacts} reacts</span>
      </div>
    </div>
  );
}

export default BlogPreview;