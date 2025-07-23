import { Heart, X } from "lucide-react";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaComment, FaThumbsUp } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import "./PostView.css";

const PostView = () => {
  console.log("PostView component mounted");
  const { id } = useParams();
  console.log("Post ID from URL:", id);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [reactionCount, setReactionCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [reactionLoading, setReactionLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSameUser, setIsSameUser] = useState(false);

  const API_BASE_URL = "http://localhost:5030/api";

  PostView.propTypes = {
    UserId: PropTypes.string,
    PostId: PropTypes.string,
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, user not logged in");
        setUserLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const fetchPost = async () => {
    if (!id) {
      setError("No post ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching post with ID:", id);
      const response = await fetch(`${API_BASE_URL}/Posts/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Post response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found");
        } else if (response.status === 400) {
          throw new Error("Invalid post ID");
        } else {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }
      }

      const postData = await response.json();
      console.log("Fetched post data:", postData);

      // Update this part in your fetchPost function
      const formattedPost = {
        id: postData.id,
        images:
          postData.images && postData.images.$values
            ? postData.images.$values.map((img) => img.imageUrl)
            : [],
        caption: postData.content || "",
        likes: postData.likes || 0,
        comments: postData.comments || 0,
        liked: false,
        timestamp: formatDate(postData.createdAt),
        username: postData.username || "Unknown",
        user: postData.user || {
          id: postData.userId,
          username: postData.username,
        },
        title: postData.title || "",
        userId: postData.userId,
      };

      setPost(formattedPost);
      setReactionCount(formattedPost.likes);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown time";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  // Updated handleSubmitComment function with better error handling
  const handleSubmitComment = async () => {
    // Your existing validation code...

    try {
      setCommentSubmitting(true);
      setCommentError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setCommentError("Authentication required");
        return;
      }

      const commentData = { content: commentText.trim() };

      console.log("Submitting comment:", commentData);

      const response = await fetch(`${API_BASE_URL}/Posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Comment submitted successfully:", result);

      // Add the new comment to the list
      if (result.comment) {
        setComments((prev) => [result.comment, ...prev]);
      }

      // Update comment count
      if (post) {
        setPost({
          ...post,
          comments: result.postCommentCount || post.comments + 1,
        });
      }

      // Clear the comment input
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentError(error.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const fetchComments = async () => {
    if (!id) {
      console.warn("Cannot fetch comments - no post ID available");
      return;
    }

    try {
      console.log("Fetching comments for post ID:", id);
      const token = localStorage.getItem("token");

      const requestUrl = `${API_BASE_URL}/Posts/${id}/comments`;
      console.log("Request URL:", requestUrl);

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Comment API response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No comments found for this post.");
          setComments([]);
          return;
        }

        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(
          `Error fetching comments: ${response.status} - ${
            errorText || response.statusText
          }`
        );
      }

      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      let commentsData;
      try {
        commentsData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse comments JSON:", parseError);
        throw new Error("Server returned invalid JSON");
      }

      // Handle different response formats
      if (Array.isArray(commentsData)) {
        // Direct array
        setComments(commentsData);
      } else if (
        commentsData &&
        commentsData.$values &&
        Array.isArray(commentsData.$values)
      ) {
        // .NET serialized format
        setComments(commentsData.$values);
      } else if (commentsData && typeof commentsData === "object") {
        // Single object or other format
        setComments([commentsData]);
      } else {
        setComments([]);
      }

      console.log("Comments state updated");
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchReactionCount = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Posts/${id}/reactions/count`
      );
      if (response.ok) {
        const count = await response.json();
        setReactionCount(count);
      }
    } catch (error) {
      console.error("Error fetching reaction count:", error);
    }
  };

  const checkUserReaction = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/Posts/${id}/reactions/status`,
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

  const handleReaction = async () => {
    try {
      if (!currentUser) {
        alert("You must be logged in to react to this post");
        return;
      }

      setReactionLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/Posts/${id}/react`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHasReacted(data.reacted || data.liked);
        setReactionCount(data.count || data.likes);

        // Update the post state as well
        if (post) {
          setPost({
            ...post,
            likes: data.count || data.likes,
            liked: data.reacted || data.liked,
          });
        }
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    } finally {
      setReactionLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;

    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/Posts/comment/${commentId}`,
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

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );

      if (post) {
        setPost({
          ...post,
          comments: Math.max(0, (post.comments || comments.length) - 1),
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment: " + error.message);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (post && post.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === post.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (post && post.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with id:", id);

    if (!id) {
      console.error("Missing post ID parameter");
      setError("No post ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        await fetchPost();
        await fetchCurrentUser();
        await fetchComments();
        await fetchReactionCount();
        await checkUserReaction();
        console.log("All data fetching completed");
      } catch (error) {
        console.error("Error in data fetching:", error);
        setError("Failed to load post data");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (post && post.user && post.user.id && currentUser) {
      setIsSameUser(currentUser.id === post.user.id);
    }
  }, [post, currentUser]);

  if (loading) {
    return (
      <div className="loading">
        <div>Loading post...</div>
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

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  return (
    <div className="page-container-post-view">
      {/* Header with back button */}
      <div className="post-header">
        <Link to="/profile/posts" className="back-button">
          <FaArrowLeft />
          <span>Back to Posts</span>
        </Link>
        <h1>Post View</h1>
      </div>

      {/* Post Content Section */}
      <div className="post-content-section">
        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="post-images-container">
            <div className="post-image-viewer">
              <img
                src={post.images[currentImageIndex]}
                alt={`Post image ${currentImageIndex + 1}`}
                className="main-post-image"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x400?text=Image+Not+Found";
                }}
              />

              {post.images.length > 1 && (
                <>
                  <button className="nav-button prev" onClick={prevImage}>
                    ‹
                  </button>
                  <button className="nav-button next" onClick={nextImage}>
                    ›
                  </button>

                  <div className="image-indicators">
                    {post.images.map((_, index) => (
                      <div
                        key={index}
                        className={`indicator ${
                          index === currentImageIndex ? "active" : ""
                        }`}
                        onClick={() => goToImage(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Post Details */}
        <div className="post-details">
          {post.title && (
            <div className="post-title">
              <h2>{post.title}</h2>
            </div>
          )}

          {post.caption && (
            <div className="post-caption">
              <p>{post.caption}</p>
            </div>
          )}
        </div>
      </div>

      {/* Author Details */}
      <div className="author-details space-x-4">
        <div>
          <img
            src={
              post.user?.profilePictureUrl || "https://via.placeholder.com/40"
            }
            alt="User Profile"
            className="profile-img"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
        </div>
        <div className="name-container">
          <div className="author-name">
            Posted by {post.username || "Anonymous"}
          </div>
          <div className="post-meta">
            <div className="post-time">{post.timestamp}</div>
          </div>
        </div>
        <div className="action-container">
          <div className="reaction-button-container">
            <button
              className={`reaction-button ${hasReacted ? "reacted" : ""}`}
              onClick={handleReaction}
              disabled={reactionLoading || !currentUser}
            >
              <Heart
                size={18}
                fill={hasReacted ? "#e74c3c" : "none"}
                className={`reaction-icon ${hasReacted ? "active" : ""}`}
              />
              <span className="reaction-text">
                {hasReacted ? "Liked" : "Like"}
              </span>
              <span className="reaction-count">
                {reactionCount > 0 && `(${reactionCount})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />

      {/* Comments Section */}
      <div className="comments-section">
        <div className="comments-header">
          <div className="numberOfComments">
            Comments ({post.comments || comments.length})
          </div>
        </div>

        {/* Comment Form */}
        <div className="commentsArea">
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
              disabled={commentSubmitting || !commentText.trim()}
            >
              Cancel
            </button>
            <button
              className="submitButton"
              onClick={handleSubmitComment}
              disabled={
                commentSubmitting || !commentText.trim() || !currentUser
              }
            >
              {commentSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {commentError && (
            <div
              className="error-message"
              style={{ color: "red", marginTop: "5px" }}
            >
              Error: {commentError}
            </div>
          )}

          <hr style={{ border: "1px solid #ccc", margin: "10px 0" }} />
        </div>

        {/* Display Comments */}
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header space-x-4">
                  <div>
                    <img
                      src={
                        comment.user?.profilePictureUrl ||
                        "https://via.placeholder.com/40"
                      }
                      alt={`${comment.user?.username}'s profile`}
                      className="profile-img"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  </div>
                  <div className="name-container">
                    <div className="commenter-name">
                      {comment.user?.username}
                    </div>
                    <div className="comment-meta">
                      <div className="comment-time text-sm">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                  {currentUser && comment.user?.id === currentUser.id && (
                    <button
                      className="delete-comment-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteComment(comment.id);
                      }}
                      title="Delete comment"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-actions">
                  <span className="flex items-center gap-1">
                    <FaComment className="text-sm" />
                    <span className="action-text">Reply</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FaThumbsUp className="text-sm" />
                    <span className="action-text">Like</span>
                  </span>
                </div>
                <hr style={{ border: "1px solid #eee", margin: "15px 0" }} />
              </div>
            ))
          ) : (
            <div className="no-comments">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostView;
