import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CSS/vehicledetail.css"; // Adjust path if needed

const VehicleDetailPage = () => {
  const { id } = useParams(); // Get the vehicle ID from the URL
  const [vehicle, setVehicle] = useState(null); // Use state to store vehicle data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const [showBookingModal, setShowBookingModal] = useState(false); // Control modal visibility
  const [bookingData, setBookingData] = useState({
    startDate: null,
    endDate: null,
    pickupLocation: "",
    returnLocation: "",
    additionalRequirements: "",
    tripId: "", // Add TripId to the booking data state
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null); // Add selectedVehicle state

  // Fetch vehicle details based on the vehicle ID from the URL
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5030/api/vehicle/${id}`
        );
        setVehicle(response.data); // Set the vehicle data in the state
        setSelectedVehicle(response.data); // Set selected vehicle to the fetched vehicle
      } catch (err) {
        setError("Failed to load vehicle details"); // Set error if fetching fails
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchVehicleDetails(); // Call the function to fetch vehicle details
  }, [id]); // Re-run when the vehicle ID changes

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");

    // Validation
    if (!bookingData.startDate || !bookingData.endDate) {
      setBookingError("Please select pickup and return dates.");
      return;
    }

    try {
      const data = {
        vehicleId: vehicle?.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupLocation: bookingData.pickupLocation,
        returnLocation: bookingData.returnLocation,
        additionalRequirements: bookingData.additionalRequirements,
        tripId: bookingData.tripId || null, // Pass TripId if available, else null
      };

      // Simulate API call to book the vehicle
      // Replace with your backend API request
      await axios.post(
        "http://localhost:5030/api/VehicleReservations/reserve",
        data
      );

      setBookingSuccess(true); // Set booking success to true
      setTimeout(() => {
        handleCloseModal(); // Close the modal after a successful booking
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      setBookingError("Booking failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false); // Close modal
    setBookingSuccess(false);
    setBookingError("");
    setBookingData({
      startDate: null,
      endDate: null,
      pickupLocation: "",
      returnLocation: "",
      additionalRequirements: "",
      tripId: "", // Reset TripId
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="vehicle-detail-page">
      <h2>Vehicle Details</h2>

      <div className="vehicle-detail-card">
        {/* Vehicle Image */}
        <div className="vehicle-image">
          <img
            src={vehicle?.imageUrls?.[0] || "/default.jpg"} // Safe check
            alt={`${vehicle?.brand} ${vehicle?.model}`}
            className="vehicle-detail-image"
          />
        </div>

        {/* Vehicle Info */}
        <div className="vehicle-info">
          <h3>
            {vehicle?.brand} {vehicle?.model}
          </h3>
          <p className="vehicle-type">{vehicle?.type}</p>
          <p className="vehicle-price">Rs {vehicle?.pricePerDay}/day</p>
          <p className="vehicle-location">{vehicle?.location}</p>

          <div className="vehicle-availability">
            <strong>Status:</strong>
            <span className={vehicle?.isAvailable ? "available" : "rented"}>
              {vehicle?.isAvailable ? "Available" : "Rented"}
            </span>
          </div>

          {/* Vehicle Details */}
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
            </ul>
          </div>

          {/* Amenities */}
          {vehicle?.amenities?.length > 0 && (
            <div className="vehicle-amenities">
              <h4>Amenities:</h4>
              <div className="amenity-tags">
                {vehicle?.amenities?.map((amenity, index) => (
                  <span key={index} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Booking Button */}
          <button
            className="book-now-btn"
            onClick={() => setShowBookingModal(true)} // Open modal when clicked
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
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
            (selectedVehicle || vehicle) && ( // Check either selectedVehicle or vehicle
              <Form onSubmit={handleBookingSubmit}>
                {/* Form Content */}
                <Row className="mb-3">
                  <Col md={6}>
                    <img
                      src={selectedVehicle?.imagePaths?.[0] || "/default.jpg"}
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
                    {/* Other Vehicle Details */}
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

                {/* Pickup and Return Dates */}
                <Row className="mb-3">
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

                {/* Pickup and Return Locations */}
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

                {/* Additional Requirements */}
                <Form.Group>
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

                {/* Trip ID */}
                <Form.Group>
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

                {/* Total Price */}
                {bookingData.startDate && bookingData.endDate && (
                  <p className="mt-3">
                    <strong>Total Cost:</strong> Rs.
                    {(
                      (vehicle.pricePerDay *
                        (new Date(bookingData.endDate) -
                          new Date(bookingData.startDate))) /
                      (1000 * 60 * 60 * 24)
                    ).toFixed(2)}
                  </p>
                )}

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
