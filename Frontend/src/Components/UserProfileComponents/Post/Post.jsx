import axios from "axios";
import { Heart, MessageCircle, Plus, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../Authentication/AuthProvider/AuthProvider";
import ProfileHeadSection from "../ProfileHeadsection/ProfileHeadsection";
import "./Post.css";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // API Base URL - adjust this to match your backend
  const API_BASE_URL = "http://localhost:5030/api";

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/Posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Posts API response:", response.data);

      // Check if data exists and has the $values property
      if (response.data && response.data.$values) {
        // Map from $values array instead of directly from response.data
        const formattedPosts = response.data.$values.map((post) => ({
          id: post.id,
          // Handle nested $values for images as well
          images:
            post.images && post.images.$values
              ? post.images.$values.map((img) => img.imageUrl)
              : [],
          caption: post.content || "",
          likes: post.likes || 0,
          comments: post.comments || 0,
          liked: false,
          timestamp: formatDate(post.createdAt),
          username: post.username || "Unknown",
          title: post.title || "",
          userId: post.userId,
        }));

        setPosts(formattedPosts);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load posts. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
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

  // Handle like/unlike post
  const handleLike = async (postId, event) => {
    // Prevent navigation when clicking like button
    event.stopPropagation();

    // Optimistic UI update
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Call API to update like status
      const response = await axios.post(
        `${API_BASE_URL}/Posts/${postId}/react`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update with actual server response
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: response.data.likes,
                liked: response.data.liked,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error updating like:", err);
      // If API call fails, revert the optimistic update
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update like. Please try again.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Handle post click navigation
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Handle comment button click
  const handleCommentClick = (postId, event) => {
    // Prevent navigation when clicking comment button
    event.stopPropagation();
    // Navigate to post view page
    navigate(`/post/${postId}`);
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 10) {
      Swal.fire({
        icon: "warning",
        title: "Too many files",
        text: "Please select maximum 10 images.",
      });
      return;
    }
    setSelectedFiles(files);
  };

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle post upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No files selected",
        text: "Please select at least one image to upload.",
      });
      return;
    }

    try {
      setUploading(true);

      // Show loading indicator
      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we upload your post",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      // Create form data to send files
      const formData = new FormData();
      formData.append("Title", "Post from mobile app"); // Add a default title
      formData.append("Content", caption.trim()); // Use Content instead of Caption
      formData.append("Tags", ""); // Empty tags

      // Append files
      selectedFiles.forEach((file) => {
        formData.append("Files", file);
      });

      // Log what you're sending (for debugging)
      console.log("Uploading post with files:", selectedFiles.length);

      // Send post data to server
      const response = await axios.post(`${API_BASE_URL}/Posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);

      // Close loading indicator
      Swal.close();

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your post has been uploaded successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form and close modal
      setSelectedFiles([]);
      setCaption("");
      setShowUploadModal(false);

      // Refresh posts to show the new post
      await fetchPosts();
    } catch (err) {
      console.error("Error uploading post:", err);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          err.response?.data?.message ||
          err.response?.data ||
          "Could not upload your post. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  // Add this function to handle dot navigation
  const goToImage = (postId, index, event) => {
    // Prevent navigation when clicking dots
    event.stopPropagation();
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: index,
    }));
  };

  // Add this function in the PostsPage component
  const handleDeletePost = async (postId, event) => {
    // Prevent event propagation if called from a click event
    if (event) {
      event.stopPropagation();
    }

    if (!postId) return;

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const response = await axios.delete(`${API_BASE_URL}/Posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        // Remove the deleted post from state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

        // Show success message
        Swal.fire({
          title: "Deleted!",
          text: "Your post has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        console.log("Post deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "Unable to delete this post. Please try again.",
        footer: '<a href="#">Contact support if the problem persists</a>',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="posts-container">
      {/* Header */}
      <ProfileHeadSection />

      {/* Upload Button */}
      <div className="upload-section">
        <button
          className="upload-btn"
          onClick={() => setShowUploadModal(true)}
          disabled={uploading}
        >
          <Upload size={20} />
          {uploading ? "Uploading..." : "Upload Photos"}
        </button>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Share your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-card clickable-post"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="post-images">
                {/* Show indicators for all posts with multiple images */}
                {post.images.length > 1 && (
                  <div className="image-indicators">
                    {post.images.map((_, index) => (
                      <div
                        key={index}
                        className={`indicator ${
                          index === (currentImageIndex[post.id] || 0)
                            ? "active"
                            : ""
                        }`}
                        onClick={(e) => goToImage(post.id, index, e)}
                      />
                    ))}
                  </div>
                )}

                {post.images.length > 0 && (
                  <img
                    src={post.images[currentImageIndex[post.id] || 0]}
                    alt="Post"
                    className="post-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x400?text=Image+Not+Found";
                    }}
                  />
                )}
              </div>

              <div className="post-content">
                <div className="post-header">
                  {post.profilePicture && (
                    <img
                      src={post.profilePicture}
                      alt={post.username}
                      className="post-profile-pic"
                    />
                  )}
                  <span className="post-username">{post.username}</span>

                  {post.username === user?.username && (
                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeletePost(post.id, e)}
                      aria-label="Delete post"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {post.title && <h3 className="post-title">{post.title}</h3>}

                <p className="post-caption">{post.caption}</p>

                <div className="post-meta">
                  <span className="post-time">{post.timestamp}</span>
                </div>

                <div className="post-actions">
                  <button
                    className={`action-btn ${post.liked ? "liked" : ""}`}
                    onClick={(e) => handleLike(post.id, e)}
                  >
                    <Heart size={18} fill={post.liked ? "#e74c3c" : "none"} />
                    <span>Likes ({post.likes})</span>
                  </button>
                  <button
                    className="action-btn"
                    onClick={(e) => handleCommentClick(post.id, e)}
                  >
                    <MessageCircle size={18} />
                    <span>Comments ({post.comments})</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Upload New Post</h3>
              <button
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="file-upload-area">
                <input
                  type="file"
                  id="file-input"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="file-input"
                  disabled={uploading}
                />
                <label htmlFor="file-input" className="file-upload-label">
                  <Plus size={40} />
                  <span>Choose Photos</span>
                  <small>Select one or multiple images (max 10)</small>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files ({selectedFiles.length})</h4>
                  <div className="file-preview">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="file-thumbnail"
                        />
                        <span className="file-name">{file.name}</span>
                        <button
                          className="remove-file-btn"
                          onClick={() => removeSelectedFile(index)}
                          disabled={uploading}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="caption-section">
                <label htmlFor="caption">Caption</label>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption for your post..."
                  rows="3"
                  disabled={uploading}
                  maxLength={500}
                />
                <small className="char-count">{caption.length}/500</small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className="upload-submit-btn"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploading}
              >
                {uploading ? "Uploading..." : "Upload Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
