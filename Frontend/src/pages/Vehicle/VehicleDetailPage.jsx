import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert2";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "../CSS/vehicledetail.css";

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: "",
    startDate: "",
    endDate: "",
    pickupLocation: "",
    returnLocation: "",
    additionalRequirements: "",
    email: "",
    phone: "",
    tripId: null,
  });
  const [userTrips, setUserTrips] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5030/api/vehicle/${id}`)
      .then((res) => setVehicle(res.data))
      .catch(() => setError("Failed to load vehicle details"))
      .finally(() => setLoading(false));

    axios
      .get(`http://localhost:5030/api/vehicles/${id}/reviews`)
      .then((res) => {
        const reviewsArray = Array.isArray(res.data?.$values)
          ? res.data.$values
          : [];
        setReviews(reviewsArray);
      })
      .catch(() => console.error("Failed to fetch reviews"));

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

  const calculateTotalAmount = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    if (timeDiff < 0) return 0;

    const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return vehicle?.pricePerDay * numberOfDays;
  };

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && vehicle?.pricePerDay) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const cleanedPrice = parseFloat(
        vehicle.pricePerDay.toString().replace(/[^\d.]/g, "")
      );
      setCalculatedAmount(days * cleanedPrice);
    }
  }, [bookingData.startDate, bookingData.endDate, vehicle]);

  const handleBookNow = async () => {
    if (
      !bookingData.customerName ||
      !bookingData.startDate ||
      !bookingData.endDate ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.pickupLocation ||
      !bookingData.returnLocation
    ) {
      swal.fire(
        "Missing Fields",
        "Please fill in all required fields",
        "warning"
      );
      return;
    }

    // Recalculate here instead of relying on state
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = days * parseFloat(vehicle?.pricePerDay || 0);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      swal.fire("Error", "Invalid amount or date range", "error");
      return;
    }

    const [firstName, ...rest] = bookingData.customerName.trim().split(" ");
    const lastName = rest.join(" ") || " ";

    const payload = {
      VehicleId: vehicle.id,
      StartDate: bookingData.startDate,
      EndDate: bookingData.endDate,
      PickupLocation: bookingData.pickupLocation,
      ReturnLocation: bookingData.returnLocation,
      AdditionalRequirements: bookingData.additionalRequirements || "None",
      TotalAmount: totalAmount,
      TripId: bookingData.tripId || null,
      FirstName: firstName,
      LastName: lastName,
      Email: bookingData.email,
      Phone: bookingData.phone,
      ItemName: `${vehicle.brand} ${vehicle.model}`,
      OrderId: `ORDER_${Date.now()}`,
      Description: `Booking for ${vehicle?.brand} ${vehicle?.model}`,
      ReservationType: "vehicle",
    };

    try {
      const res = await axios.post(
        "http://localhost:5030/api/payments/create-checkout-session",
        payload
      );

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        swal.fire("Error", "Stripe session creation failed", "error");
      }
    } catch (err) {
      console.error(err);
      swal.fire("Error", "Payment initiation failed", "error");
    }
  };

  // (Your existing review handling and rendering code goes here...)
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
      .post(`http://localhost:5030/api/vehicles/${id}/reviews`, reviewData)
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
    return <div className="loading-container">Loading vehicle details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!vehicle) return null;

  return (
    <div className="vehicle-detail-container">
      {/* Your existing JSX here */}
      <div className="vehicle-hero">
        <div className="vehicle-lottie-wrapper">
          <DotLottieReact src="/Animations/Vehicle.lottie" loop autoplay />
        </div>

        <div className="vehicle-hero-content">
          <h1>
            {vehicle.brand} {vehicle.model}
          </h1>
          <p>{vehicle.location}</p>
          <p>
            <strong>Supplier:</strong> {vehicle.supplierUsername}
          </p>
        </div>
      </div>

      <div className="vehicle-main-content">
        <div className="vehicle-left">
          <img
            src={vehicle.imageUrls?.$values?.[0] || "/default.jpg"}
            alt="Vehicle"
            className="vehicle-image"
            onClick={() => setShowGallery(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default.jpg"; // fallback image
            }}
          />

          <div className="vehicle-description">
            <h3>About this Vehicle</h3>
            <p>
              {vehicle.description ||
                "Comfortable and reliable vehicle for your journey."}
            </p>
            <ul className="vehicle-specs">
              <li>
                <strong>Fuel:</strong> {vehicle.fuelType}
              </li>
              <li>
                <strong>Transmission:</strong> {vehicle.transmissionType}
              </li>
              <li>
                <strong>Seats:</strong> {vehicle.numberOfPassengers}
              </li>
              <li>
                <strong>Type:</strong> {vehicle.type}
              </li>
            </ul>
            {vehicle.amenities?.$values?.length > 0 && (
              <div className="vehicle-amenities">
                <h4>Amenities</h4>
                <div className="amenities-tags">
                  {vehicle.amenities.$values.map((a, i) => (
                    <span key={i} className="tag">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p>
              <strong>Status:</strong>{" "}
              {vehicle.isAvailable ? (
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
        {/* Booking form right side */}
        <div className="vehicle-right">
          {vehicle.isAvailable ? (
            <div className="booking-card">
              <h3>Book This Vehicle</h3>
              <p>
                <strong>Price:</strong> Rs. {vehicle.pricePerDay} / day
              </p>

              <input
                type="text"
                placeholder="Full Name"
                value={bookingData.customerName}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    customerName: e.target.value,
                  })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={bookingData.email}
                onChange={(e) =>
                  setBookingData({ ...bookingData, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                value={bookingData.phone}
                onChange={(e) =>
                  setBookingData({ ...bookingData, phone: e.target.value })
                }
              />
              <label htmlFor="">Start Date</label>
              <input
                type="date"
                value={bookingData.startDate}
                onChange={(e) =>
                  setBookingData({ ...bookingData, startDate: e.target.value })
                }
              />
              <label htmlFor="">End Date</label>
              <input
                type="date"
                value={bookingData.endDate}
                onChange={(e) =>
                  setBookingData({ ...bookingData, endDate: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Pickup Location"
                value={bookingData.pickupLocation}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    pickupLocation: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Return Location"
                value={bookingData.returnLocation}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    returnLocation: e.target.value,
                  })
                }
              />

              {/* Total Amount Display */}
              <p className="font-semibold mt-2">
                Total: Rs. {calculatedAmount.toFixed(2)}
              </p>

              <textarea
                placeholder="Additional Requirements (If not, type 'NO')"
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
              <h3>This vehicle is currently not available for booking</h3>
            </div>
          )}
        </div>
      </div>

      {/* Rest of your component JSX including gallery, reviews, etc. */}
      {showGallery && (
        <div className="gallery-modal">
          <div className="gallery-content">
            <button className="close-btn" onClick={() => setShowGallery(false)}>
              &times;
            </button>
            <div className="image-grid">
              {vehicle.imageUrls?.$values?.map((img, i) => (
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
export default VehicleDetailPage;