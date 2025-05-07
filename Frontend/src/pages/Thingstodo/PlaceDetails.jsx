"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/PlaceDetails.css";
import "../../App.css";

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

  useEffect(() => {
    setLoading(true);
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
      }),
      axios
        .get(`http://localhost:5030/api/places/${placeId}/reviews`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Failed to fetch reviews:", err));

      window.scrollTo(0, 0);
  }, [placeId]);

  const handleWishlistClick = () => {
    setWishlistAdded(!wishlistAdded);
    // Here you would typically make an API call to update the wishlist status
  };

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const handleSubmitReview = () => {
    if (!newReview && rating === 0) {
      return alert("Please write a review and select a rating");
    }

    setSubmitting(true);

    const reviewData = {
      comment: newReview,
      rating,
      name: reviewName || "Anonymous",
      email: reviewEmail || undefined,
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
        alert("Error submitting review. Try again later.");
        setSubmitting(false);
      });
  };

  const renderStars = (value, onClickFn, onHoverFn, onLeaveFn) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${
          star <= (hoverRating || value) ? "active" : "inactive"
        }`}
        onClick={() => onClickFn && onClickFn(star)}
        onMouseEnter={() => onHoverFn && onHoverFn(star)}
        onMouseLeave={() => onLeaveFn && onLeaveFn()}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading place details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!place) return null;

  // Calculate average rating
  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

  return (
    <div className="place-details-container">
      {/* Hero Image with Overlay Title */}
      <div className="hero-section">
        <img
          src={place.mainImageUrl || "/placeholder.svg"}
          alt={place.name}
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1 className="hero-title">{place.name}</h1>
          <p className="hero-subtitle">{place.address}</p>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Wishlist Button */}
        <div className="wishlist-container">
          <button
            className={`wishlist-button ${wishlistAdded ? "added" : ""}`}
            onClick={handleWishlistClick}
          >
            {wishlistAdded ? "✓ Added to Wishlist" : "+ Add to Wishlist"}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          {/* Left Column - Description */}
          <div className="left-column">
            <div className="section description-section">
              <h2 className="section-title">About this place</h2>
              <p>{place.description}</p>
            </div>
          </div>

          {/* Right Column - Gallery and Info Cards */}
          <div className="right-column">
            <div className="featured-image-container">
              <img
                src={place.galleryImages?.[activeImage] || place.mainImageUrl}
                alt={`Featured view of ${place.name}`}
                className="featured-image"
              />
            </div>

            {/* Gallery of Small Images */}
            {place.galleryImages?.length > 0 && (
              <div className="gallery-section">
                {place.galleryImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    className={`gallery-image ${
                      activeImage === index ? "active" : ""
                    }`}
                    onClick={() => handleImageClick(index)}
                  />
                ))}
              </div>
            )}

            {/* Info Cards */}
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
                  className="map-link"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

         {/* History Section */}
        {place.history && (
              <div className="section history-section">
                <h2 className="section-title">History</h2>
                <p>{place.history}</p>
              </div>
            )}

        {/* Reviews and Ratings Section */}
        <div className="reviews-ratings-section">
          <div className="reviews-header">
            <h2 className="reviews-title">Reviews & Ratings</h2>
            <div className="reviews-summary">
              <div className="average-rating">
                <span className="rating-number">{averageRating}</span>
                <div className="rating-stars">{renderStars(averageRating)}</div>
                <span className="rating-count">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="review-form-container">
            <h3>Share Your Experience</h3>
            <div className="review-form">
              <div className="form-row">
              </div>
              <div className="form-group">
                <label htmlFor="reviewRating">Your Rating</label>
                <div className="rating-selector">
                  {renderStars(
                    rating,
                    (value) => setRating(value),
                    (value) => setHoverRating(value),
                    () => setHoverRating(0)
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="reviewText">Your Review</label>
                <textarea
                  id="reviewText"
                  placeholder="Share your experience with this place..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                ></textarea>
              </div>
              <button
                className="submit-review-btn"
                onClick={handleSubmitReview}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="reviews-list">
            <h3>What People Say</h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name
                          ? review.name.charAt(0).toUpperCase()
                          : "A"}
                      </div>
                      <div>
                        <h4 className="reviewer-name">
                          {review.name || "Anonymous"}
                        </h4>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`star ${
                                star <= review.rating ? "active" : "inactive"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="review-date">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recently"}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;
