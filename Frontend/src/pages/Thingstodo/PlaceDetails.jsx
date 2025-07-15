"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";
import "../CSS/PlaceDetails.css";
import "../../App.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PlaceDetails = () => {
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const isLoggedIn = document.cookie.includes("authToken=");
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);

    axios
      .get(`http://localhost:5030/api/places/${placeId}`)
      .then((res) => {
        setPlace(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch place details:", err);
        setError("Failed to load place details. Please try again later.");
        setLoading(false);
      });

    axios
      .get(`http://localhost:5030/api/places/${placeId}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews:", err));

    window.scrollTo(0, 0);
  }, [placeId]);

  const handleWishlistClick = () => {
    setWishlistAdded(!wishlistAdded);
  };

  const fetchGalleryImages = async (placeId) => {
    try {
      const response = await axios.get(`http://localhost:5030/api/places/${placeId}/images`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch images", error);
      return [];
    }
  };

  const openGalleryPopup = async () => {
    const images = await fetchGalleryImages(placeId);
    if (images.length > 0) {
      setGalleryImages(images);
      setShowGallery(true);
    } else {
      swal.fire({
        title: "No images available",
        text: "This place has no additional images.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmitReview = () => {
    if (!newReview.trim() && rating === 0) {
      swal.fire({
        title: "Please provide a review or rating",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!currentUser) {
      setShowGuestModal(true);
      return;
    }

    submitReview(currentUser.name || "Anonymous", currentUser.email || "");
  };

  const submitReview = (name, email) => {
    setSubmitting(true);
    const reviewData = {
      comment: newReview,
      rating,
      name,
      email,
    };

    axios
      .post(`http://localhost:5030/api/places/${placeId}/reviews`, reviewData)
      .then((res) => {
        setReviews([...reviews, res.data]);
        setNewReview("");
        setRating(0);
        setReviewName("");
        setReviewEmail("");
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Failed to submit review:", err);
        swal.fire({
          title: "Error submitting review",
          text: "Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSubmitting(false);
      });
  };

  // Function to render static stars
  const renderStaticStars = (value) => {
    return [1, 2, 3, 4, 5].map((star) => {
      if (value >= star) {
        return (
          <span key={star} className="star active">
            ★
          </span>
        );
      } else if (value >= star - 0.5) {
        return (
          <span key={star} className="star half">
            ★
          </span>
        );
      } else {
        return (
          <span key={star} className="star inactive">
            ★
          </span>
        );
      }
    });
  };

  // Function to render interactive stars
  const renderInteractiveStars = (
    value,
    hoverValue,
    onClickFn,
    onHoverFn,
    onLeaveFn
  ) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${
          star <= (hoverValue || value) ? "active" : "inactive"
        }`}
        onClick={() => onClickFn && onClickFn(star)}
        onMouseEnter={() => onHoverFn && onHoverFn(star)}
        onMouseLeave={() => onLeaveFn && onLeaveFn()}>
        ★
      </span>
    ));
  };

  // Calculate average rating
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="ttd-loading-container">
        <div className="ttd-loading-spinner"></div>
        <p>Loading place details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ttd-error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="ttd-retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!place) return null;

  return (
    <>
      <div className="place-details-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-overlay">
            <div className="hero-lottie">
              <DotLottieReact
                src="https://lottie.host/adaf9694-f292-4ed0-8108-61064b3d164b/t3082gROJl.lottie"
                loop
                autoplay
              />
            </div>
            <div className="hero-content">
              <h1 className="hero-title">{place.name}</h1>
              <p className="hero-subtitle">{place.address}</p>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="main-content-grid">
            <div className="left-column">
              <div className="section description-section">
                <h2 className="section-title">About this place</h2>
                <p>{place.description}</p>
              </div>
            </div>

            <div className="right-column">
              <div className="wishlist-container">
                <button
                  className={`wishlist-button ${wishlistAdded ? "added" : ""}`}
                  onClick={handleWishlistClick}
                  style={{ visibility: isLoggedIn ? "visible" : "hidden" }}>
                  {wishlistAdded ? "✓ Added to Wishlist" : "+ Add to Wishlist"}
                </button>
              </div>

              <div
                className="featured-image-wrapper"
                onClick={openGalleryPopup}>
                <img
                  src={place.galleryImages?.[activeImage] || place.mainImageUrl}
                  alt={`Featured view of ${place.name}`}
                  className="featured-image"
                />
                <div className="overlay">See more images...</div>
              </div>

              {showGallery && (
                <div className="popup-gallery">
                  <div className="popup-content">
                    <FontAwesomeIcon
                      className="popup-close"
                      onClick={() => setShowGallery(false)}
                      icon={faTimes}
                    />
                    <div className="image-grid">
                      {galleryImages.map((img, i) => (
                        <img key={i} src={img} alt={`Gallery ${i + 1}`} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="info-cards">
                <div className="info-card">
                  <h3>🕒 Opening Hours</h3>
                  <p>{place.openingHours}</p>
                </div>
                <div className="info-card">
                  <h3>📍 Address</h3>
                  <p>{place.address}</p>
                </div>
                <div className="info-card">
                  <h3>🔗 Directions</h3>
                  <a
                    href={place.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link">
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>

          {place.history && (
            <div className="section history-section">
              <h2 className="section-title">History</h2>
              <p>{place.history}</p>
            </div>
          )}

          <div className="reviews-ratings-section">
            <div className="reviews-header">
              <h2 className="reviews-title">Reviews & Ratings</h2>
              <div className="reviews-summary">
                <div className="average-rating">
                  <span className="rating-number">{averageRating}</span>
                  <div className="rating-stars">
                    {renderStaticStars(averageRating)}
                  </div>
                  <span className="rating-count">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="reviews-list">
              <h3>What People Say</h3>
              {reviews.length > 0 ? (
                <>
                  {reviews
                    .filter((r) => r.comment?.trim())
                    .slice(0, 2)
                    .map((review, index) => (
                      <div key={index} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="reviewer-avatar">
                              {review.name
                                ? review.name.charAt(0).toUpperCase()
                                : "A"}
                            </div>
                            <h4 className="reviewer-name">
                              {review.name || "Anonymous"}
                            </h4>
                          </div>
                          <div className="review-date">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : "Recently"}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}

                  {reviews.filter((r) => r.comment?.trim()).length > 2 && (
                    <div className="show-more">
                      <span
                        className="show-more-link"
                        onClick={() => setShowAllReviewsModal(true)}>
                        Show More
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            <div className="review-form-container">
              <h3>Share Your Experience</h3>
              <div className="review-form">
                <div className="form-group">
                  <label>Your Rating</label>
                  <div className="rating-selector">
                    {renderInteractiveStars(
                      rating,
                      hoverRating,
                      (val) => setRating(val),
                      (val) => setHoverRating(val),
                      () => setHoverRating(0)
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    placeholder="Share your experience with this place..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}></textarea>
                </div>
                <button
                  className="submit-review-btn"
                  onClick={handleSubmitReview}
                  disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Modal */}
      {showGuestModal && (
        <div className="guest-modal-backdrop">
          <div className="guest-modal">
            <h3>Enter your details to submit a review</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={reviewEmail}
              onChange={(e) => setReviewEmail(e.target.value)}
            />
            <div className="guest-modal-actions">
              <button
                className="cancel-guest-btn"
                onClick={() => setShowGuestModal(false)}>
                Cancel
              </button>
              <button
                className="submit-guest-btn"
                onClick={() => {
                  if (!reviewName.trim()) {
                    swal.fire({
                      title: "Name is required",
                      icon: "warning",
                      confirmButtonText: "OK",
                    });
                    return;
                  }
                  if (!reviewEmail.trim()) {
                    swal.fire({
                      title: "Email is required",
                      icon: "warning",
                      confirmButtonText: "OK",
                    });
                    return;
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(reviewEmail.trim())) {
                    swal.fire({
                      title: "Invalid email format",
                      icon: "warning",
                      confirmButtonText: "OK",
                    });
                    return;
                  }
                  setShowGuestModal(false);
                  submitReview(reviewName.trim(), reviewEmail.trim());
                }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Reviews Modal */}
      {showAllReviewsModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3>All Reviews</h3>
              <div className="custom-modal-close">
                <span onClick={() => setShowAllReviewsModal(false)}>
                  &times;
                </span>
              </div>
            </div>
            <div className="custom-modal-body">
              {reviews
                .filter((r) => r.comment?.trim())
                .map((r, idx) => (
                  <div key={idx} className="review-card">
                    <strong>{r.name}</strong>
                    <span
                      style={{
                        float: "right",
                        fontSize: "12px",
                        color: "gray",
                      }}>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                    <p style={{ margin: "5px 0" }}>{r.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceDetails;
