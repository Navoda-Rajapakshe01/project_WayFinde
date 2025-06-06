"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5030/api/reviews");
        const data = await res.json();
        setReviews(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No, cancel!",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:5030/api/reviews/${reviewId}`,
          {
            method: "DELETE",
          }
        );
        if (res.ok) {
          setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete review. Please try again.",
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete review. Please try again.",
        });
      }
    }
  };

  const now = new Date();
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      (review.placeName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (review.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      selectedRating === "all" ||
      review.rating === Number.parseInt(selectedRating);

    const reviewDate = new Date(review.createdAt || review.date);
    let matchesPeriod = true;
    if (selectedPeriod !== "all") {
      const days = Number.parseInt(selectedPeriod);
      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - days);
      matchesPeriod = reviewDate >= pastDate;
    }

    return matchesSearch && matchesRating && matchesPeriod;
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
      <div className="adminsection-header">
        <h1 className="page-title">Reviews Management</h1>
      </div>

      <div className="adminfilter-bar">
        <div className="adminsearch-box">
          <FaSearch className="adminsearch-icon" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="adminfilters">
          <div className="adminfilter-dropdown">
            <FaFilter className="adminfilter-icon" />
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

          <div className="adminfilter-dropdown">
            <FaFilter className="adminfilter-icon" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Place</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td>{review.placeName}</td>
                <td>{review.name}</td>
                <td>
                  <div className="adminrating">
                    <span className="adminrating-stars">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="adminrating-value">{review.rating}</span>
                  </div>
                </td>
                <td>
                  <div className="comment-text">{review.comment}</div>
                </td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="adminaction-buttons">
                    <button
                      className="admindelete-button"
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
