"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    // Simulate API call to fetch reviews
    const fetchReviews = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockReviews = [
          {
            id: 1,
            placeName: "Sigiriya",
            userName: "John Doe",
            rating: 5,
            comment: "Amazing place! The views are breathtaking.",
            date: "2023-06-15",
            status: "approved",
          },
          {
            id: 2,
            placeName: "Ella Rock",
            userName: "Jane Smith",
            rating: 4,
            comment: "Beautiful hike, but quite challenging.",
            date: "2023-06-14",
            status: "approved",
          },
          {
            id: 3,
            placeName: "Galle Fort",
            userName: "Robert Johnson",
            rating: 5,
            comment: "Loved the colonial architecture and ocean views.",
            date: "2023-06-10",
            status: "approved",
          },
          {
            id: 4,
            placeName: "Nine Arch Bridge",
            userName: "Emily Davis",
            rating: 3,
            comment: "Nice spot but very crowded when we visited.",
            date: "2023-06-12",
            status: "pending",
          },
          {
            id: 5,
            placeName: "Yala National Park",
            userName: "Michael Wilson",
            rating: 2,
            comment: "Disappointing safari, didn't see many animals.",
            date: "2023-05-30",
            status: "approved",
          },
          {
            id: 6,
            placeName: "Kandy Temple",
            userName: "Sarah Brown",
            rating: 4,
            comment: "Beautiful temple with rich history.",
            date: "2023-06-13",
            status: "pending",
          },
          {
            id: 7,
            placeName: "Mirissa Beach",
            userName: "David Miller",
            rating: 5,
            comment: "Perfect beach day! Crystal clear water.",
            date: "2023-06-11",
            status: "rejected",
          },
          {
            id: 8,
            placeName: "Horton Plains",
            userName: "Lisa Taylor",
            rating: 4,
            comment: "World's End view was amazing despite the fog.",
            date: "2023-05-25",
            status: "approved",
          },
        ];

        setReviews(mockReviews);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleApproveReview = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, status: "approved" } : review
      )
    );
  };

  const handleRejectReview = (reviewId) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, status: "rejected" } : review
      )
    );
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter((review) => review.id !== reviewId));
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.placeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      selectedRating === "all" ||
      review.rating === Number.parseInt(selectedRating);
    const matchesStatus =
      selectedStatus === "all" || review.status === selectedStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="section-loading">
        <div className="loading-spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="reviews-management">
      <div className="section-header">
        <h1 className="page-title">Reviews Management</h1>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Place</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.placeName}</td>
                <td>{review.userName}</td>
                <td>
                  <div className="rating">
                    <span className="rating-stars">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="rating-value">{review.rating}</span>
                  </div>
                </td>
                <td>
                  <div className="comment-text">{review.comment}</div>
                </td>
                <td>{review.date}</td>
                <td>
                  <span className={`status-badge ${review.status}`}>
                    {review.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {review.status === "pending" && (
                      <>
                        <button
                          className="approve-button"
                          onClick={() => handleApproveReview(review.id)}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => handleRejectReview(review.id)}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteReview(review.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsManagement;
