import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CSS/vehicledetail.css"; // Adjust path if needed

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: null,
    endDate: null,
    pickupLocation: "",
    returnLocation: "",
    additionalRequirements: "",
    tripId: "",
    customerName: "",
    totalAmount: 0,
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5030/api/vehicle/${id}`
        );
        setVehicle(response.data);
        setSelectedVehicle(response.data);
      } catch (err) {
        setError("Failed to load vehicle details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && vehicle?.pricePerDay) {
      const days = Math.ceil(
        (bookingData.endDate - bookingData.startDate) / (1000 * 60 * 60 * 24)
      );
      const total = days > 0 ? days * vehicle.pricePerDay : vehicle.pricePerDay;
      setBookingData((prev) => ({ ...prev, totalAmount: total }));
    } else {
      setBookingData((prev) => ({ ...prev, totalAmount: 0 }));
    }
  }, [bookingData.startDate, bookingData.endDate, vehicle?.pricePerDay]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!bookingData.startDate || !bookingData.endDate) {
      setBookingError("Please select pickup and return dates.");
      return;
    }
    if (!bookingData.customerName || bookingData.customerName.trim() === "") {
      setBookingError("Please enter your name.");
      return;
    }

    try {
      const data = {
        vehicleId: vehicle?.id,
        customerName: bookingData.customerName,
        startDate: bookingData.startDate?.toISOString(),
        endDate: bookingData.endDate?.toISOString(),
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
        additionalRequirements: bookingData.additionalRequirements,
        totalAmount: bookingData.totalAmount,
        tripId: bookingData.tripId || null,
      };

      await axios.post(
        "http://localhost:5030/api/VehicleReservations/reserve",
        data
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
      startDate: null,
      endDate: null,
      pickupLocation: "",
      returnLocation: "",
      additionalRequirements: "",
      customerName: "",
      totalAmount: 0,
      tripId: "",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="vehicle-detail-page">
      <h2>Vehicle Details</h2>

      <div className="vehicle-detail-card">
        <div className="vehicle-image">
          <img
            src={vehicle?.imageUrls?.[0] || "/default.jpg"}
            alt={`${vehicle?.brand} ${vehicle?.model}`}
            className="vehicle-detail-image"
          />
        </div>

        <div className="vehicle-info">
          <h3>
            {vehicle?.brand} {vehicle?.model}
          </h3>
          <p className="vehicle-type">{vehicle?.type}</p>
          <p className="vehicle-price">Rs {vehicle?.pricePerDay}/day</p>
          <p className="vehicle-location">{vehicle?.location}</p>

          <div className="vehicle-availability">
            <strong>Status:</strong>{" "}
            <span className={vehicle?.isAvailable ? "available" : "rented"}>
              {vehicle?.isAvailable ? "Available" : "Rented"}
            </span>
          </div>

          <div className="vehicle-details">
            <h4>Details:</h4>
            <ul>
              <li>
                <strong>Fuel Type:</strong> {vehicle?.fuelType}
              </li>
              <li>
                <strong>Transmission Type:</strong> {vehicle?.transmissionType}
              </li>
              <li>
                <strong>Capacity:</strong> {vehicle?.numberOfPassengers} seats
              </li>
              <li>
                <strong>Location:</strong> {vehicle?.location}
              </li>
            </ul>
          </div>

          {vehicle?.amenities?.length > 0 && (
            <div className="vehicle-amenities">
              <h4>Amenities:</h4>
              <div className="amenity-tags">
                {vehicle.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="book-now-btn"
            onClick={() => setShowBookingModal(true)}
            disabled={!vehicle?.isAvailable}
            style={{
              opacity: vehicle?.isAvailable ? 1 : 0.6,
              cursor: vehicle?.isAvailable ? "pointer" : "not-allowed",
            }}>
            {vehicle?.isAvailable ? "Book Now" : "Unavailable"}
          </button>

          {!vehicle?.isAvailable && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>
              This vehicle is currently rented.
            </p>
          )}
        </div>
      </div>

      <Modal show={showBookingModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Book {selectedVehicle?.brand} {selectedVehicle?.model}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingSuccess ? (
            <Alert variant="success">Booking Successful!</Alert>
          ) : (
            (selectedVehicle || vehicle) && (
              <Form onSubmit={handleBookingSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <img
                      src={selectedVehicle?.imageUrls?.[0] || "/default.jpg"}
                      className="img-fluid rounded"
                      style={{
                        maxHeight: 220,
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <h5>
                      {selectedVehicle?.brand || vehicle?.brand}{" "}
                      {selectedVehicle?.model || vehicle?.model}
                    </h5>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedVehicle?.location || vehicle?.location}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {selectedVehicle?.type || vehicle?.type}
                    </p>
                    <p>
                      <strong>Price:</strong> Rs.{" "}
                      {selectedVehicle?.pricePerDay || vehicle?.pricePerDay}{" "}
                      /day
                    </p>
                    <p>
                      <strong>Transmission:</strong>{" "}
                      {selectedVehicle?.transmissionType ||
                        vehicle?.transmissionType}
                    </p>
                    <p>
                      <strong>Fuel:</strong>{" "}
                      {selectedVehicle?.fuelType || vehicle?.fuelType}
                    </p>
                    <p>
                      <strong>Capacity:</strong>{" "}
                      {selectedVehicle?.numberOfPassengers ||
                        vehicle?.numberOfPassengers}{" "}
                      seats
                    </p>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
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

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Pickup Date</Form.Label>
                      <DatePicker
                        selected={bookingData.startDate}
                        onChange={(date) =>
                          setBookingData({ ...bookingData, startDate: date })
                        }
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Return Date</Form.Label>
                      <DatePicker
                        selected={bookingData.endDate}
                        onChange={(date) =>
                          setBookingData({ ...bookingData, endDate: date })
                        }
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        minDate={bookingData.startDate || new Date()}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Pickup Location</Form.Label>
                      <Form.Control
                        type="text"
                        value={bookingData.pickupLocation}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            pickupLocation: e.target.value,
                          })
                        }
                        placeholder="Enter pickup location"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Return Location</Form.Label>
                      <Form.Control
                        type="text"
                        value={bookingData.returnLocation}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            returnLocation: e.target.value,
                          })
                        }
                        placeholder="Enter return location"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Additional Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bookingData.additionalRequirements}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        additionalRequirements: e.target.value,
                      })
                    }
                    placeholder="Any special requests?"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Trip ID (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    value={bookingData.tripId}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, tripId: e.target.value })
                    }
                    placeholder="Enter Trip ID (Leave blank if booking separately)"
                  />
                </Form.Group>

                {bookingData.totalAmount > 0 && (
                  <p className="mt-3">
                    <strong>Total Cost:</strong> Rs.{" "}
                    {bookingData.totalAmount.toFixed(2)}
                  </p>
                )}

                {bookingError && <Alert variant="danger">{bookingError}</Alert>}

                <Button variant="primary" type="submit">
                  Confirm Booking
                </Button>
              </Form>
            )
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VehicleDetailPage;
