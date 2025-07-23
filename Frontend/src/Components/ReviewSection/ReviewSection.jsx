import React, { useState } from "react";
import AddReviewPopup from "../AddReviewPopup/AddReviewPopup"; // Import the popup component
import "./ReviewSection.css";

const ReviewSection = ({ reviews }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddReview = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmitReview = (review) => {
    console.log("New Review:", review);
    setIsPopupOpen(false);
  };

  // Safely handle malformed or missing review data
  const validReviews = Array.isArray(reviews) ? reviews : [];

  return (
    <div className="review-section">
      <h2>Reviews & Ratings</h2>

      <div className="reviews">
        {validReviews.length === 0 ? (
          <p>No reviews yet. Be the first to leave one!</p>
        ) : (
          validReviews.map((review) => (
            <div key={review.id} className="review">
              <p>
                <strong>{review.name || "Anonymous"}</strong> ⭐ {review.rating}
              </p>
              <p>{review.comment}</p>
              <p>
                <em>{new Date(review.createdAt).toLocaleDateString()}</em>
              </p>
            </div>
          ))
        )}
      </div>

      <button className="add-review-button" onClick={handleAddReview}>
        Add a Review
      </button>

      {isPopupOpen && (
        <AddReviewPopup
          onClose={handleClosePopup}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default ReviewSection;
