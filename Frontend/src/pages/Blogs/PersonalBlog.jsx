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
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [isSameUser, setIsSameUser] = useState(false);

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
              "text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8",
            "Cache-Control": "no-cache",
          },
        }
      );

      console.log("Content response status:", contentResponse.status);

      if (!contentResponse.ok) {
        const errorText = await contentResponse.text();
        console.error(`
          Error  blog : ${contentResponse.status} - ${errorText}`);
        throw new Error(`
          Failed to fetch blog content: ${contentResponse.status} - ${errorText}`);
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

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, user not logged in");
        setUserLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5030/api/profile/me", {
        headers: {
          Authorization: `Bearer ${ken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch current user:", response.status);
        setUserLoading(false);
        return;
      }

      const userData = await response.json();
      console.log("Current user data:", userData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      setUserLoading(false);
    }
  };
  const handleSubmitComment = async () => {
    // Validate input
    if (!commentText.trim()) {
      return;
    }

    if (!currentUser || !currentUser.id) {
      alert("You must be logged in to comment");
      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5030/api/blog/newComment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            blogId: blog.id,
            userId: currentUser.id,
            content: commentText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to submit comment");
      }

      const responseData = await response.json();
      console.log("Comment submitted successfully:", responseData);
      const newComment = responseData.comment || responseData;

      // Update the blog's comment count if returned from API
      if (responseData.blogCommentCount !== undefined) {
        // If we have blog reference, update it
        if (blog) {
          setBlog({
            ...blog,
            commentCount: responseData.blogCommentCount,
          });
        }
      }

      // Add the new comment to the comments list
      setComments((prevComments) => {
        // Ensure prevComments is always an array
        const existingComments = Array.isArray(prevComments)
          ? prevComments
          : [];

        return [
          {
            id: newComment.id,
            content: newComment.content,
            createdAt: newComment.createdAt,
            user: {
              id: currentUser.id,
              username: currentUser.username,
              profilePictureUrl: currentUser.profilePictureUrl,
            },
          },
          ...existingComments,
        ];
      });

      // Clear the comment text field
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError(error.message);
    } finally {
      setCommentSubmitting(false);
    }
  };
  //function to fetch comments for the current blog
  const fetchComments = async () => {
    if (!id) {
      console.warn("Cannot fetch comments - no blog ID available");
      return;
    }

    try {
      console.log("Fetching comments for blog ID:", id);
      const token = localStorage.getItem("token");
      console.log("Token available:", token ? "Yes" : "No");

      // Log the complete request URL
      const requestUrl = `http://localhost:5030/api/blog/${id}/comments`;
      console.log("Request URL:", requestUrl);

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Log response details
      console.log("Comment API response status:", response.status);
      console.log("Comment API response status text:", response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No comments found for this blog.");
          setComments([]);
          return;
        }

        // Try to get error details
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(
          `Error fetching comments: ${response.status} - ${
            errorText || response.statusText
          }`
        );
      }

      // Get the raw response text first
      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      let commentsData;
      try {
        // Then parse it to JSON
        commentsData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse comments JSON:", parseError);
        console.error("Invalid JSON response:", responseText);
        throw new Error("Server returned invalid JSON");
      }

      commentsData = JSON.parse(responseText);
      // Extract the array from the $values property if it exists
      if (commentsData && typeof commentsData === "object") {
        if (commentsData.$values && Array.isArray(commentsData.$values)) {
          console.log(
            "Found comments in $values property, length:",
            commentsData.$values.length
          );
          commentsData = commentsData.$values;
        }
      }
      console.log("Fetched comments (count):", commentsData?.length || 0);
      console.log(
        "First comment sample:",
        commentsData?.[0] ? { ...commentsData[0] } : "No comments"
      );

      if (!Array.isArray(commentsData)) {
        console.error("API did not return an array:", commentsData);
        setComments([]);
        return;
      }

      // Set the comments and verify the update
      setComments(commentsData);
      console.log(
        "Comments state updated with",
        commentsData.length,
        "comments"
      );

      // Check if comments have required properties for rendering
      const missingProperties = commentsData.some(
        (comment) => !comment.id || !comment.content || !comment.user?.username
      );

      if (missingProperties) {
        console.warn(
          "Some comments have missing required properties:",
          commentsData.filter((c) => !c.id || !c.content || !c.user?.username)
        );
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  // Function to fetch reaction count
  const fetchReactionCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5030/api/blog/${id}/reactions/count`
      );

      if (response.ok) {
        const count = await response.json();
        setReactionCount(count);
      }
    } catch (error) {
      console.error("Error fetching reaction count:", error);
    }
  };

  // Function to check if user has reacted
  const checkUserReaction = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5030/api/blog/${id}/reactions/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const hasReacted = await response.json();
        setHasReacted(hasReacted);
      }
    } catch (error) {
      console.error("Error checking user reaction:", error);
    }
  };

  // Function to handle reaction toggle
  const handleReaction = async () => {
    try {
      if (!currentUser) {
        alert("You must be logged in to react to this blog");
        return;
      }

      setReactionLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5030/api/blog/${id}/react`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHasReacted(data.reacted);
        setReactionCount(data.count);
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    } finally {
      setReactionLoading(false);
    }
  };

  const fetchFollowerCounts = async (userId) => {
    try {
      // Fetch follower count
      const followerResponse = await fetch(
        `http://localhost:5030/api/profile/${userId}/followers/count`
      );

      if (followerResponse.ok) {
        const count = await followerResponse.json();
        setFollowerCount(count);
      }

      // Fetch following count
      const followingResponse = await fetch(
        `http://localhost:5030/api/profile/${userId}/following/count`
      );

      if (followingResponse.ok) {
        const count = await followingResponse.json();
        setFollowingCount(count);
      }
    } catch (error) {
      console.error("Error fetching follower counts:", error);
    }
  };

  const checkFollowingStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Check if current user is viewing their own blog
      if (currentUser && currentUser.id === userId) {
        setIsSameUser(true);
        return;
      }

      const response = await fetch(
        `http://localhost:5030/api/profile/${userId}/following/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const status = await response.json();
        setIsFollowing(status);
      }
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert("You must be logged in to follow users");
      return;
    }

    try {
      setFollowLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5030/api/profile/${blog.user.id}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following);
        setFollowerCount(data.followerCount);
      }
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setFollowLoading(false);
    }
  };
  // First, add a new function to delete comments
  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5030/api/blog/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete comment");
      }

      const data = await response.json();
      console.log("Comment deleted successfully:", data);

      // Remove the comment from state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );

      // Update the blog's comment count
      if (blog) {
        setBlog({
          ...blog,
          commentCount: (blog.commentCount || comments.length) - 1,
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
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
              throw new Error(`
                HTTP error! status: ${response.status} - ${errorText}`);
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
      await Promise.all([
        fetchBlog(),
        fetchCurrentUser(),
        fetchComments(),
        fetchReactionCount(),
        checkUserReaction(),
      ]);

      // After blog is fetched, check follow status and counts
      if (blog && blog.user && blog.user.id) {
        fetchFollowerCounts(blog.user.id);
        checkFollowingStatus(blog.user.id);
      }
    };

    fetchData();
  }, [id]);

  // Add another useEffect to handle blog state changes
  useEffect(() => {
    if (blog && blog.user && blog.user.id) {
      fetchFollowerCounts(blog.user.id);
      checkFollowingStatus(blog.user.id);
    }
  }, [blog, currentUser]);

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

      <div className="writerDetails space-x-4">
        <div>
          <img
            src={blog.user.profilePictureUrl}
            alt="User Profile"
            className="profile-img"
          />
        </div>
        <div className="name-container">
          <div className="writerName">
            Written by {blog.author || "Anonymous"}
          </div>
          <div className="numOfFollowersFollowing">
            <div className="numOfFollowers">{followerCount} Followers</div>
            <div className="numOfFollowers">{followingCount} Following</div>
          </div>
        </div>
        <div className="follow-react-container">
          {!isSameUser && (
            <button
              className={`follow_button ${isFollowing ? "following" : ""}`}
              onClick={handleFollow}
              disabled={followLoading || isSameUser}>
              {followLoading
                ? "Processing..."
                : isFollowing
                ? "Following"
                : "Follow"}
            </button>
          )}
          <div className="reaction-button-container">
            {/* Your existing reaction button */}
          </div>
        </div>
        <Link>
          {/* <div className="follow_button">Follow</div> */}
          <div className="reaction-button-container">
            <button
              className={reaction - button`${hasReacted ? "reacted" : ""}`}
              onClick={handleReaction}
              disabled={reactionLoading || !currentUser}>
              <FaThumbsUp
                className={reaction - icon`${hasReacted ? "active" : ""}`}
              />
              <span className="reaction-text">
                {hasReacted ? "Liked" : "Like"}
              </span>
              <span className="reaction-count">
                {reactionCount > 0 && `${reactionCount}`}
              </span>
            </button>
          </div>
        </Link>
      </div>

      <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />

      <div>
        {/* Comment Form */}
        <div className="commentsArea">
          <div className="numberOfComments">
            Comments ({blog.commentCount || comments.length})
          </div>
          <div className="commentsAreaProfileDetails">
            {userLoading ? (
              <div className="loading-avatar">Loading...</div>
            ) : currentUser ? (
              <>
                <img
                  src={
                    currentUser.profilePictureUrl ||
                    "https://via.placeholder.com/40"
                  }
                  alt={`${currentUser.username}'s profile`}
                  className="profile-img"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/40";
                  }}
                />
                {currentUser.username}
              </>
            ) : (
              <>
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Profile"
                  className="profile-img"
                />
                <span>Guest User</span>
              </>
            )}
          </div>
          <div className="commentAreaAddComments">
            <textarea
              className="commentInput"
              placeholder={
                currentUser
                  ? "Write your comment here..."
                  : "Please log in to comment"
              }
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!currentUser}
            />
          </div>
          <div className="functionButtons">
            <button
              className="cancelButton"
              onClick={() => setCommentText("")}
              disabled={commentSubmitting || !commentText.trim()}>
              Cancel
            </button>
            <button
              className="submitButton"
              onClick={handleSubmitComment}
              disabled={
                commentSubmitting || !commentText.trim() || !currentUser
              }>
              {commentSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
          {commentError && (
            <div
              className="error-message"
              style={{ color: "red", marginTop: "5px" }}>
              Error: {commentError}
            </div>
          )}
          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>

        {/* Display Comments */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="writerDetails space-x-4">
                <div>
                  <img
                    src={
                      comment.user.profilePictureUrl ||
                      "https://via.placeholder.com/40"
                    }
                    alt={`${comment.user.username}'s profile`}
                    className="profile-img"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/40";
                    }}
                  />
                </div>
                <div className="name-container">
                  <div className="writerName">{comment.user.username}</div>
                  <div className="numOfFollowersFollowing">
                    <div className="publishDay text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {/* Add delete button (only visible for comment author) */}
                {currentUser && comment.user.id === currentUser.id && (
                  <button
                    className="delete-comment-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteComment(comment.id);
                    }}
                    title="Delete comment">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="comment-content">{comment.content}</div>
              <p className="comLikeIcons">
                <span className="flex items-center gap-1">
                  <FaComment className="text-lg" />
                  <span className="numComLikes">Reply</span>
                </span>
                <span className="flex items-center gap-1">
                  <FaThumbsUp className="text-lg" />
                  <span className="numComLikes">Like</span>
                </span>
              </p>
              <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
            </div>
          ))
        ) : (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>

      <div className="allResponses">
        <button>See all responses</button>
      </div>
    </div>
  );
};

export default PersonalBlog;