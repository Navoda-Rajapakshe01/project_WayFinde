import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../CSS/accommodationdetail.css";

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: "",
    startDate: "",
    endDate: "",
    guests: "",
    additionalRequirements: "",
    tripId: null, // optional
  });
  const [userTrips, setUserTrips] = useState([]);

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

  // New state for total amount calculation
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    if (!id) return;

    // Fetch accommodation
    axios
      .get(`http://localhost:5030/api/Accommodation/${id}`)
      .then((res) => setAccommodation(res.data))
      .catch(() => setError("Failed to load accommodation details"))
      .finally(() => setLoading(false));

    // Fetch reviews
    axios
      .get(`http://localhost:5030/api/accommodations/${id}/reviews`)
      .then((res) => {
        const reviewsArray = Array.isArray(res.data?.$values)
          ? res.data.$values
          : [];
        setReviews(reviewsArray);
      })
      .catch(() => console.error("Failed to fetch reviews"));

    // Fetch user's trips
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (userProfile?.userId) {
      axios
        .get(`http://localhost:5030/api/trips/user/${userProfile.userId}`)
        .then((res) => {
          const trips = res.data?.$values || res.data || [];
          setUserTrips(trips);
        })
        .catch(() => console.error("Failed to fetch user trips"));
    }
  }, [id]);

  // Calculate total amount based on startDate and endDate
  const calculateTotalAmount = (startDate, endDate, guests) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const timeDiff = end - start;

    if (timeDiff < 0) return 0;

    const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

    return accommodation?.pricePerNight * numberOfDays * guests;
  };

  // Update total amount when booking dates or accommodation change
  useEffect(() => {
    if (accommodation) {
      const amount = calculateTotalAmount(
        bookingData.startDate,
        bookingData.endDate,
        bookingData.guests
      );
      setCalculatedAmount(amount);
    }
  }, [
    bookingData.startDate,
    bookingData.endDate,
    bookingData.guests,
    accommodation,
  ]);

  const handleBookNow = () => {
    // basic front‑end validation
    if (
      !bookingData.customerName.trim() ||
      !bookingData.startDate ||
      !bookingData.endDate ||
      !bookingData.guests
    ) {
      swal.fire(
        "Missing fields",
        "Please fill out all booking details.",
        "warning"
      );
      return;
    }

    // build Date objects in local time (+05:30) then convert to ISO
    const startDateTime = new Date(`${bookingData.startDate}T14:00:00+05:30`);
    const endDateTime = new Date(`${bookingData.endDate}T10:00:00+05:30`);

    if (startDateTime >= endDateTime) {
      swal.fire("Invalid dates", "Check‑out must be after check‑in.", "error");
      return;
    }

    /* ----------  PAYLOAD  ---------- */
    const payload = {
      accommodationId: accommodation.id,
      customerName: bookingData.customerName.trim(),
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      guests: Number(bookingData.guests), // <‑‑ numeric!
      additionalRequirements: bookingData.additionalRequirements.trim() || null,
      tripId: bookingData.tripId || null,
      totalAmount: calculatedAmount,
    };

    console.log("Payload:", payload);

    axios
      .post(
        "http://localhost:5030/api/AccommodationReservation/accommodation",
        payload
      )
      .then(() => {
        setBookingSuccess(true);
        swal.fire("Success", "Booking request sent!", "success");
        setBookingData({
          customerName: "",
          startDate: "",
          endDate: "",
          guests: "",
          additionalRequirements: "",
          tripId: null,
        });
        setCalculatedAmount(0);
      })
      .catch((err) => {
        console.error("Booking error:", err);
        swal.fire(
          "Booking failed",
          err.response?.data || "Please try again later.",
          "error"
        );
      });
  };

  const submitReview = (name, email) => {
    setSubmitting(true);
    const reviewData = {
      comment: newReview,
      rating,
      name,
      email,
    };

    if (!rating || rating < 1 || rating > 5) {
      swal.fire({
        title: "Please provide a rating",
        icon: "warning",
        confirmButtonText: "OK",
      });
      setSubmitting(false);
      return;
    }

    axios
      .post(
        `http://localhost:5030/api/accommodations/${id}/reviews`,
        reviewData
      )
      .then((res) => {
        setReviews((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return [...safePrev, res.data];
        });
        setNewReview("");
        setRating(0);
        setReviewName("");
        setReviewEmail("");
        setSubmitting(false);
      })
      .catch(() => {
        swal.fire({
          title: "Error submitting review",
          text: "Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setSubmitting(false);
      });
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

    const latestUser = JSON.parse(localStorage.getItem("userProfile"));
    setCurrentUser(latestUser);

    if (!latestUser) {
      setShowGuestModal(true);
      return;
    }

    submitReview(
      latestUser.username || latestUser.name || "Anonymous",
      latestUser.email || latestUser.contactEmail || ""
    );
  };

  // Static star renderer
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

  // Interactive star renderer
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

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  if (loading)
    return (
      <div className="loading-container">Loading Accommodation details...</div>
    );
  if (error) return <div className="error-message">{error}</div>;
  if (!accommodation) return null;

  return (
    <div className="accommodation-detail-container">
      <div className="accommodation-hero">
        <div className="accommodation-lottie-wrapper">
          <DotLottieReact
            src="../Animations/Beach Vacation.lottie"
            loop
            autoplay
          />
        </div>

        <div className="accommodation-hero-content">
          <h1>{accommodation.name}</h1>
          <p>{accommodation.location}</p>
          <p>{accommodation.type}</p>
          <p>
            <strong>Supplier:</strong> {accommodation.supplierUsername}
          </p>
        </div>
      </div>

      <div className="accommodation-main-content">
        <div className="accommodation-left">
          <img
            src={accommodation.imageUrls?.$values?.[0] || "/default.jpg"}
            alt="accommodation"
            className="accommodation-image"
            onClick={() => setShowGallery(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default.jpg"; // fallback image
            }}
          />

          <div className="accommodation-description">
            <h3>About this Place</h3>
            <p>
              {accommodation.description ||
                "Comfortable and reliable places for your journey."}
            </p>
            <ul className="accommodation-specs">
              <li>
                <strong>Bed Rooms:</strong> {accommodation.bedrooms}
              </li>
              <li>
                <strong>Bath Rooms:</strong> {accommodation.bathrooms}
              </li>
              <li>
                <strong>Max Guests:</strong> {accommodation.maxGuests}
              </li>
              <li>
                <strong>Type:</strong> {accommodation.type}
              </li>
            </ul>
            {accommodation.amenities?.$values?.length > 0 && (
              <div className="accommodation-amenities">
                <h4>Amenities</h4>
                <div className="amenities-tags">
                  {accommodation.amenities.$values.map((a, i) => (
                    <span key={i} className="tag">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p>
              <strong>Status:</strong>{" "}
              {accommodation.isAvailable ? (
                <span className="status available">Available</span>
              ) : (
                <span className="status unavailable">Not Available</span>
              )}
            </p>
          </div>

          {/* Include review section here */}
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
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
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

        <div className="accommodation-right">
          {accommodation.isAvailable ? (
            <div className="booking-card">
              <h3>Book This Place</h3>
              <p>
                <strong>Price:</strong> Rs. {accommodation.pricePerNight} /
                Night
              </p>

              {/* Display calculated total amount */}
              <p>
                <strong>Total Amount:</strong> Rs. {calculatedAmount}
              </p>

              <input
                type="text"
                placeholder="Your Name"
                value={bookingData.customerName}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    customerName: e.target.value,
                  })
                }
              />
              <input
                type="date"
                value={bookingData.startDate}
                onChange={(e) =>
                  setBookingData({ ...bookingData, startDate: e.target.value })
                }
              />
              <input
                type="date"
                value={bookingData.endDate}
                onChange={(e) =>
                  setBookingData({ ...bookingData, endDate: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Number of Guests"
                value={bookingData.guests}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    guests: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Additional Requirements (optional)"
                value={bookingData.additionalRequirements}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    additionalRequirements: e.target.value,
                  })
                }
              />
              <select
                value={bookingData.tripId || ""}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    tripId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }>
                <option value="">Select a Trip (optional)</option>
                {userTrips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.tripName}
                  </option>
                ))}
              </select>

              <button className="book-button" onClick={handleBookNow}>
                Confirm Booking
              </button>
            </div>
          ) : (
            <div className="booking-card unavailable-message">
              <h3>This Place is currently not available for booking</h3>
            </div>
          )}
        </div>
      </div>

      {showGallery && (
        <div className="gallery-modal">
          <div className="gallery-content">
            <button className="close-btn" onClick={() => setShowGallery(false)}>
              &times;
            </button>
            <div className="image-grid">
              {accommodation.imageUrls?.$values?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Gallery ${i}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default.jpg";
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationDetailPage;
