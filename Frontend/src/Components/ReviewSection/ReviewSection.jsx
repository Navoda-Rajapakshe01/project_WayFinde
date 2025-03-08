import React, { useState } from "react";
import AddReviewPopup from "../AddReviewPopup/AddReviewPopup"; // Import the popup component
import "./ReviewSection.css";

const ReviewSection = ({ reviews }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Handle "Add a Review" button click
  const handleAddReview = () => {
    setIsPopupOpen(true); // Open the popup
  };

  // Handle popup close
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  // Handle review submission
  const handleSubmitReview = (review) => {
    console.log("New Review:", review); // Replace with your logic to save the review
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="review-section">
      <h2>Reviews & Ratings</h2>
      <div className="reviews">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <p>
              <strong>{review.user}</strong> ⭐ {review.rating}
            </p>
            <p>{review.comment}</p>
            <p>
              <em>{review.date}</em>
            </p>
          </div>
        ))}
      </div>
      <button className="add-review-button" onClick={handleAddReview}>
        Add a Review
      </button>

      {/* Render the popup if isPopupOpen is true */}
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
