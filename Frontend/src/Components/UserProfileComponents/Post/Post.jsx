import { Heart, MessageCircle, Plus, Upload, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import ProfileHeadSection from "../ProfileHeadsection/ProfileHeadsection";
import "./Post.css";
import axios from "axios";
import { useAuth } from "../../Authentication/AuthProvider/AuthProvider";
import Swal from "sweetalert2"; // Optional, for nice alerts

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { user } = useAuth(); // Get the authenticated user

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get("http://localhost:5030/api/Posts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPosts(response.data.map(post => ({
        ...post,
        images: post.images.map(img => img.imageUrl)
      })));
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication required");
      }

      // Find the current post to get its liked status
      const post = posts.find(p => p.id === postId);
      const newLikedStatus = !post.liked;

      // Update the UI optimistically
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: newLikedStatus,
                likes: newLikedStatus ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );

      // Send the update to the server
      await axios.post(`http://localhost:5030/api/Posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

    } catch (err) {
      console.error("Error updating like:", err);
      // Revert the optimistic update
      fetchPosts();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not update the like. Please try again.',
      });
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Authentication required");
        }

        // Create a FormData object to send files
        const formData = new FormData();
        formData.append("caption", caption);
        
        // Append all selected files
        selectedFiles.forEach(file => {
          formData.append("images", file);
        });

        // Show loading indicator
        Swal.fire({
          title: 'Uploading...',
          text: 'Please wait while we upload your post',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Send the post to the server
        const response = await axios.post("http://localhost:5030/api/Posts", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });

        // Close loading indicator
        Swal.close();

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Your post has been uploaded successfully.',
          timer: 2000,
          showConfirmButton: false
        });

        // Refresh posts to include the new one
        fetchPosts();
        
        // Reset form
        setSelectedFiles([]);
        setCaption("");
        setShowUploadModal(false);
      } catch (err) {
        console.error("Error uploading post:", err);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Could not upload your post. Please try again.',
        });
      }
    }
  };

  const nextImage = (postId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]:
        ((prev[postId] || 0) + 1) %
        posts.find((p) => p.id === postId).images.length,
    }));
  };

  const prevImage = (postId) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]:
        ((prev[postId] || 0) -
          1 +
          posts.find((p) => p.id === postId).images.length) %
        posts.find((p) => p.id === postId).images.length,
    }));
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="posts-container">
      {/* Header */}
      <ProfileHeadSection />

      {/* Upload Button */}
      <div className="upload-section">
        <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
          <Upload size={20} />
          Upload Photos
        </button>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts yet. Share your first photo!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-images">
                {post.images.length > 1 && (
                  <>
                    <button
                      className="nav-arrow nav-arrow-left"
                      onClick={() => prevImage(post.id)}
                    >
                      ‹
                    </button>
                    <button
                      className="nav-arrow nav-arrow-right"
                      onClick={() => nextImage(post.id)}
                    >
                      ›
                    </button>
                    <div className="image-indicators">
                      {post.images.map((_, index) => (
                        <div
                          key={index}
                          className={`indicator ${
                            index === (currentImageIndex[post.id] || 0)
                              ? "active"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <img
                  src={post.images[currentImageIndex[post.id] || 0]}
                  alt="Post"
                  className="post-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/images/post-placeholder.jpg";
                  }}
                />
              </div>

              <div className="post-content">
                <p className="post-caption">{post.caption}</p>
                <div className="post-meta">
                  <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="post-actions">
                  <button
                    className={`action-btn ${post.liked ? "liked" : ""}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart size={18} fill={post.liked ? "#e74c3c" : "none"} />
                    <span>Likes ({post.likes})</span>
                  </button>
                  <button className="action-btn">
                    <MessageCircle size={18} />
                    <span>Comments ({post.comments?.length || 0})</span>
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
                />
                <label htmlFor="file-input" className="file-upload-label">
                  <Plus size={40} />
                  <span>Choose Photos</span>
                  <small>Select one or multiple images</small>
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
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
              <button
                className="upload-submit-btn"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
              >
                Upload Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;