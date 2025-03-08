import React, { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa"; // Import FA icons
import "./AddReviewPopup.css";

const AddReviewPopup = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0); // State for star rating
  const [comment, setComment] = useState(""); // State for comment

  // Handle star rating selection
  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and comment."); // Validation
      return;
    }
    onSubmit({ rating, comment }); // Pass review data to parent component
    onClose(); // Close the popup
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          <FaTimes /> {/* Close icon */}
        </button>
        {/* Popup Title */}
        <h2>Add a Review</h2>
        {/* Username */}
        <p className="username">Username: JohnDoe</p>{" "}
        {/* Replace with dynamic username */}
        {/* Star Rating */}
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={star <= rating ? "star active" : "star"}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>
        {/* Comment Input */}
        <textarea
          className="comment-input"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {/* Submit Button */}
        <button className="submit-button" onClick={handleSubmit}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default AddReviewPopup;
