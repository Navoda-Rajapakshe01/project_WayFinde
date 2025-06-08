import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FaComment, FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../CSS/PersonalBlog.css";

const beachImage2 = "/Blogimages/beach2.jpg";
const beachImage3 = "/Blogimages/beach3.jpg";

const PersonalBlog = () => {
  console.log("PersonalBlog component mounted");
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState(null);

  PersonalBlog.propTypes = {
    UserId: PropTypes.string.isRequired,
    BlogId: PropTypes.string.isRequired,
  };

  const fetchBlogContent = async (blogUrl) => {
    if (!blogUrl) {
      console.log("No blog URL provided");
      return;
    }

    try {
      setContentLoading(true);
      setContentError(null);
      console.log("Fetching blog content from:", blogUrl);

      const contentResponse = await fetch(
        `http://localhost:5030/api/blog/proxy-blog-content?url=${encodeURIComponent(
          blogUrl
        )}`,
        {
          method: "GET",
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Cache-Control": "no-cache",
          },
        }
      );

      console.log("Content response status:", contentResponse.status);

      if (!contentResponse.ok) {
        const errorText = await contentResponse.text();
        console.error(
          `Error fetching blog content: ${contentResponse.status} - ${errorText}`
        );
        throw new Error(
          `Failed to fetch blog content: ${contentResponse.status} - ${errorText}`
        );
      }

      const htmlContent = await contentResponse.text();
      console.log(
        "Successfully fetched HTML content, length:",
        htmlContent.length
      );

      if (htmlContent && htmlContent.trim().length > 0) {
        setBlogContent(htmlContent);
      } else {
        setContentError("Content is empty");
      }
    } catch (error) {
      console.error("Error loading blog content:", error);
      setContentError(error.message);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("No blog ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching blog with ID:", id);
        const response = await fetch(
          `http://localhost:5030/api/blog/display/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Blog response status:", response.status);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog not found");
          } else if (response.status === 400) {
            throw new Error("Invalid blog ID");
          } else {
            const errorText = await response.text();
            throw new Error(
              `HTTP error! status: ${response.status} - ${errorText}`
            );
          }
        }

        const blogData = await response.json();
        console.log("Fetched blog data:", blogData);
        setBlog(blogData);

        // Fetch HTML content separately
        if (blogData && blogData.blogUrl) {
          await fetchBlogContent(blogData.blogUrl);
        } else {
          console.log("No blogUrl found in blog data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const retryContentFetch = () => {
    if (blog && blog.blogUrl) {
      fetchBlogContent(blog.blogUrl);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading blog...</div>
        {contentLoading && <div>Loading content...</div>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div>Error: {error}</div>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!blog) {
    return <div className="not-found">Blog not found</div>;
  }

  return (
    <div className="page-container-personalBlog">
      <div className="blogTopic">
        <h1>{blog.title}</h1>
      </div>

      {/* Blog Content Section */}
      <div className="blog-content-section">
        {contentLoading && (
          <div className="content-loading">Loading blog content...</div>
        )}

        {contentError && (
          <div className="content-error">
            <p>Failed to load blog content: {contentError}</p>
            <button onClick={retryContentFetch}>Retry Loading Content</button>
          </div>
        )}

        {blogContent && !contentLoading && (
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blogContent }}
          />
        )}

        {!blogContent && !contentLoading && !contentError && blog.blogUrl && (
          <div className="no-content">
            <p>No content available</p>
            <button onClick={retryContentFetch}>Try Loading Content</button>
          </div>
        )}
      </div>

      {blog.coverImageUrl && (
        <div className="blogImages">
          <img src={blog.coverImageUrl} alt="Blog cover" />
        </div>
      )}

      <div className="blogImages columns-2 gap-x-20">
        <div>
          <img src={beachImage3} alt="beachImage3" />
        </div>
        <div></div>
      </div>

      <div className="blogImages columns-2 gap-x-20">
        <div>
          <img src={beachImage3} alt="beachImage3" />
        </div>
        <div></div>
      </div>

      <div className="writerDetails space-x-4">
        <div>
          <img
            src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
            alt="User Profile"
            className="profile-img"
          />
        </div>
        <div className="name-container">
          <div className="writerName">
            Written by {blog.User?.name || "Anonymous"}
          </div>
          <div className="numOfFollowersFollowing">
            <div className="numOfFollowers">449 Followers</div>
            <div className="numOfFollowers">469 Followings</div>
          </div>
        </div>
        <Link>
          <div className="follow_button">Follow</div>
        </Link>
      </div>

      <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />

      <div>
        <div className="commentsArea">
          <div className="numberOfComments">Comments(265)</div>
          <div className="commentsAreaProfileDetails">
            <img
              src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
              alt="User Profile"
              className="profile-img"
            />
            Aaron-Jay
          </div>
          <div className="commentAreaAddComments">
            <textarea
              className="commentInput"
              placeholder="Write your comment here..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </div>
          <div className="functionButtons">
            <button className="cancelButton" onClick={() => setCommentText("")}>
              Cancel
            </button>
            <button className="submitButton">Submit</button>
          </div>
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>

        {/* Sample Comments */}
        {[1, 2, 3, 4].map((index) => (
          <div key={index}>
            <div className="writerDetails space-x-4">
              <div>
                <img
                  src="https://static.flashintel.ai/image/9/4/5/945db06270b111fab0848c6d2a3f8f74.jpeg"
                  alt="User Profile"
                  className="profile-img"
                />
              </div>
              <div className="name-container">
                <div className="writerName">Anne Frank</div>
                <div className="numOfFollowersFollowing">
                  <div className="publishDay text-sm">Dec 27, 2024</div>
                </div>
              </div>
            </div>
            <div>
              This is a handy trick to keep up your sleeve for future use.
              However, for now, it's still experimental. The lack of support
              from Firefox and Safari (on both desktop and iOS) means it's not
              yet ready for broader adoption.
            </div>
            <p className="comLikeIcons">
              <span className="flex items-center gap-1">
                <FaComment className="text-lg" />
                <span className="numComLikes">2 Replies</span>
              </span>
              <span className="flex items-center gap-1">
                <FaThumbsUp className="text-lg" />
                <span className="numComLikes">26</span>
              </span>
            </p>
            <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
          </div>
        ))}
      </div>

      <div className="allResponses">
        <button>See all responses</button>
      </div>
    </div>
  );
};

export default PersonalBlog;
