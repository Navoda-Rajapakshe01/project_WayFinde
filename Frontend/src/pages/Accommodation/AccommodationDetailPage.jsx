import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CSS/accommodation.css"; // adjust your CSS path accordingly

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [bookingData, setBookingData] = useState({
    checkInDate: null,
    checkOutDate: null,
    guests: 1,
    customerName: "",
    specialRequests: "",
    tripId: "",
    totalAmount: 0,
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Fetch accommodation details by ID
  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5030/api/accommodation/${id}`
        );
        setAccommodation(response.data);
      } catch (err) {
        setError("Failed to load accommodation details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodation();
  }, [id]);

  // Calculate total price whenever dates or price change
  useEffect(() => {
    if (
      bookingData.checkInDate &&
      bookingData.checkOutDate &&
      accommodation?.pricePerNight
    ) {
      const days = Math.ceil(
        (bookingData.checkOutDate - bookingData.checkInDate) /
          (1000 * 60 * 60 * 24)
      );
      const total =
        days > 0
          ? days * accommodation.pricePerNight
          : accommodation.pricePerNight;
      setBookingData((prev) => ({ ...prev, totalAmount: total }));
    } else {
      setBookingData((prev) => ({ ...prev, totalAmount: 0 }));
    }
  }, [
    bookingData.checkInDate,
    bookingData.checkOutDate,
    accommodation?.pricePerNight,
  ]);

  // Booking form submission handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }

    if (!bookingData.customerName.trim()) {
      setBookingError("Please enter your name.");
      return;
    }

    if (
      bookingData.guests < 1 ||
      bookingData.guests > accommodation.maxGuests
    ) {
      setBookingError(
        `Number of guests must be between 1 and ${accommodation.maxGuests}.`
      );
      return;
    }

    try {
      const bookingPayload = {
        accommodationId: accommodation.id,
        checkInDate: bookingData.checkInDate.toISOString(),
        checkOutDate: bookingData.checkOutDate.toISOString(),
        guests: bookingData.guests,
        customerName: bookingData.customerName,
        specialRequests: bookingData.specialRequests,
        tripId: bookingData.tripId || null,
      };

      await axios.post(
        "http://localhost:5030/api/AccommodationReservation/accommodation",
        bookingPayload
      );

      setBookingSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingError("Booking failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setBookingSuccess(false);
    setBookingError("");
    setBookingData({
      checkInDate: null,
      checkOutDate: null,
      guests: 1,
      customerName: "",
      specialRequests: "",
      tripId: "",
      totalAmount: 0,
    });
  };

  if (loading) return <div>Loading accommodation details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="accommodation-detail-page">
      <h2>Accommodation Details</h2>

      <div className="accommodation-detail-card">
        <div className="accommodation-images">
          <img
            src={accommodation.imageUrls?.[0] || "/default-accommodation.jpg"}
            alt={accommodation.name}
            className="accommodation-main-image"
          />
          {/* Optionally show thumbnails or carousel */}
        </div>

        <div className="accommodation-info">
          <h3>{accommodation.name}</h3>
          <p>
            <strong>Type:</strong> {accommodation.type}
          </p>
          <p>
            <strong>Location:</strong> {accommodation.location}
          </p>
          <p>
            <strong>Price per Night:</strong> Rs {accommodation.pricePerNight}
          </p>
          <p>
            <strong>Details:</strong> {accommodation.bedrooms} bedrooms •{" "}
            {accommodation.bathrooms} bathrooms • Max {accommodation.maxGuests}{" "}
            guests
          </p>

          {accommodation.amenities?.length > 0 && (
            <div className="accommodation-amenities">
              <h4>Amenities:</h4>
              <div className="amenity-tags">
                {accommodation.amenities.map((amenity, i) => (
                  <span key={i} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="accommodation-description">
            {accommodation.description}
          </p>

          <Button variant="primary" onClick={() => setShowBookingModal(true)}>
            Book Now
          </Button>
        </div>
      </div>

      <Modal
        show={showBookingModal}
        onHide={handleCloseModal}
        size="lg"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Book {accommodation.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingSuccess ? (
            <Alert variant="success">
              Booking Successful! Check your email for confirmation details.
            </Alert>
          ) : (
            <Form onSubmit={handleBookingSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <img
                    src={
                      accommodation.imageUrls?.[0] ||
                      "/default-accommodation.jpg"
                    }
                    alt={accommodation.name}
                    className="img-fluid rounded"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      maxHeight: "220px",
                    }}
                  />
                </Col>
                <Col md={6}>
                  <h5>{accommodation.name}</h5>
                  <p>
                    <strong>Type:</strong> {accommodation.type}
                  </p>
                  <p>
                    <strong>Location:</strong> {accommodation.location}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs {accommodation.pricePerNight} /
                    night
                  </p>
                  <p>
                    <strong>Details:</strong> {accommodation.bedrooms} bedrooms
                    • {accommodation.bathrooms} bathrooms • Max{" "}
                    {accommodation.maxGuests} guests
                  </p>
                  {accommodation.amenities?.length > 0 && (
                    <p>
                      <strong>Amenities:</strong>{" "}
                      {accommodation.amenities.join(", ")}
                    </p>
                  )}
                </Col>
              </Row>

              <Row>
                <Form.Group className="mb-3" controlId="customerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={bookingData.customerName}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </Form.Group>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="checkInDate">
                    <Form.Label>Check-in Date</Form.Label>
                    <DatePicker
                      selected={bookingData.checkInDate}
                      onChange={(date) =>
                        setBookingData({ ...bookingData, checkInDate: date })
                      }
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="checkOutDate">
                    <Form.Label>Check-out Date</Form.Label>
                    <DatePicker
                      selected={bookingData.checkOutDate}
                      onChange={(date) =>
                        setBookingData({ ...bookingData, checkOutDate: date })
                      }
                      className="form-control"
                      dateFormat="yyyy-MM-dd"
                      minDate={bookingData.checkInDate || new Date()}
                      placeholderText="Select check-out date"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Form.Group className="mb-3" controlId="guests">
                  <Form.Label>Number of Guests</Form.Label>
                  <Form.Control
                    type="number"
                    name="guests"
                    value={bookingData.guests}
                    min={1}
                    max={accommodation.maxGuests}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, guests: e.target.value })
                    }
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum allowed: {accommodation.maxGuests} guests
                  </Form.Text>
                </Form.Group>
              </Row>

              <Row>
                <Form.Group className="mb-3" controlId="specialRequests">
                  <Form.Label>Special Requests</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder="Any special requests or requirements?"
                  />
                </Form.Group>
              </Row>

              <Row>
                <Form.Group className="mb-3" controlId="tripId">
                  <Form.Label>Trip ID (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="tripId"
                    value={bookingData.tripId}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, tripId: e.target.value })
                    }
                    placeholder="Enter Trip ID (Leave blank if booking separately)"
                  />
                </Form.Group>
              </Row>

              {/* Booking Summary */}
              {bookingData.checkInDate && bookingData.checkOutDate && (
                <div className="booking-summary bg-light p-3 rounded mb-3">
                  <h5>Booking Summary</h5>
                  <p>
                    <strong>Accommodation:</strong> {accommodation.name}
                    <br />
                    <strong>Dates:</strong>{" "}
                    {bookingData.checkInDate.toLocaleDateString()} to{" "}
                    {bookingData.checkOutDate.toLocaleDateString()}
                    <br />
                    <strong>Duration:</strong>{" "}
                    {Math.ceil(
                      (bookingData.checkOutDate - bookingData.checkInDate) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    nights
                    <br />
                    <strong>Guests:</strong> {bookingData.guests}
                    <br />
                    <strong>Price Per Night:</strong> Rs{" "}
                    {accommodation.pricePerNight}
                    <br />
                    <strong>Estimated Total:</strong> Rs{" "}
                    {bookingData.totalAmount.toFixed(2)}
                  </p>
                </div>
              )}

              {bookingError && <Alert variant="danger">{bookingError}</Alert>}

              <div className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Confirm Booking
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AccommodationDetailPage;
