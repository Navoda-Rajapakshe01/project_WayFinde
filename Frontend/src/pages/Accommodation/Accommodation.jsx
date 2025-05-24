import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  Modal,
  Badge,
  Alert,
} from "react-bootstrap";
import HeroSection from "../../Components/HeroSection/HeroSection";
import AccommodationCard from "./AccommodationCardTraveller";
import AccommodationFilter from "./AccommodationFilter";
import PopularLocations from "./PopularLocations";
//import "../CSS/Accommodation.css";

const Accommodation = ({ isSignedIn = true }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
    specialRequests: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    accommodationType: "",
    location: "",
    guests: "",
    bedrooms: "",
    bathrooms: "",
  });

  // Popular locations
  const popularLocations = [
    "Colombo",
    "Kandy",
    "Galle",
    "Nuwara Eliya",
    "Ella",
    "Bentota",
  ];

  // Fetch accommodations from API
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get(
          "http://localhost:5030/api/Accommodation"
        );
        setAccommodations(response.data);
        setFilteredAccommodations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accommodations:", error);
        // Fallback to sample data if API fails
        const sampleData = getSampleAccommodations();
        setAccommodations(sampleData);
        setFilteredAccommodations(sampleData);
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Apply filters to accommodations
  useEffect(() => {
    if (accommodations.length > 0) {
      let results = [...accommodations];

      // Filter by price range
      results = results.filter(
        (acc) =>
          acc.pricePerNight >= filters.priceRange[0] &&
          acc.pricePerNight <= filters.priceRange[1]
      );

      // Filter by accommodation type
      if (filters.accommodationType) {
        results = results.filter(
          (acc) => acc.type === filters.accommodationType
        );
      }

      // Filter by location
      if (filters.location) {
        results = results.filter((acc) =>
          acc.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Filter by guests
      if (filters.guests) {
        results = results.filter(
          (acc) => acc.maxGuests >= parseInt(filters.guests)
        );
      }

      // Filter by bedrooms
      if (filters.bedrooms) {
        results = results.filter(
          (acc) => acc.bedrooms >= parseInt(filters.bedrooms)
        );
      }

      // Filter by bathrooms
      if (filters.bathrooms) {
        results = results.filter(
          (acc) => acc.bathrooms >= parseInt(filters.bathrooms)
        );
      }

      setFilteredAccommodations(results);
    }
  }, [filters, accommodations]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Load more accommodations
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Handle booking
  const handleBookNow = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setShowBookingModal(true);

    // Add to recently viewed in localStorage
    const recentlyViewed =
      JSON.parse(localStorage.getItem("recentlyViewedAccommodations")) || [];
    if (!recentlyViewed.includes(accommodation.id)) {
      const updatedRecent = [accommodation.id, ...recentlyViewed].slice(0, 5);
      localStorage.setItem(
        "recentlyViewedAccommodations",
        JSON.stringify(updatedRecent)
      );
    }
  };

  // Handle input changes in booking form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");

    try {
      // Validate booking data
      if (!bookingData.checkInDate || !bookingData.checkOutDate) {
        setBookingError("Please select check-in and check-out dates");
        return;
      }

      // Check if user is signed in
      if (!isSignedIn) {
        setBookingError("Please sign in to complete your booking");
        return;
      }

      // In a real app, you'd call your API here
      const bookingSubmitData = {
        accommodationId: selectedAccommodation.id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guests: parseInt(bookingData.guests),
        specialRequests: bookingData.specialRequests,
      };

      // Make the API call
      await axios.post(
        "http://localhost:5030/api/bookings/accommodation",
        bookingSubmitData
      );

      setBookingSuccess(true);

      // Reset form after a delay
      setTimeout(() => {
        setShowBookingModal(false);
        setSelectedAccommodation(null);
        setBookingData({
          checkInDate: "",
          checkOutDate: "",
          guests: 1,
          specialRequests: "",
        });
        setBookingSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error making booking:", error);
      setBookingError("Failed to complete booking. Please try again.");
    }
  };

  // Close booking modal
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedAccommodation(null);
    setBookingData({
      checkInDate: "",
      checkOutDate: "",
      guests: 1,
      specialRequests: "",
    });
    setBookingError("");
    setBookingSuccess(false);
  };

  // Helper function to calculate nights between dates
  const calculateNights = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to calculate total price
  const calculateTotal = (rate, checkInDate, checkOutDate) => {
    const nights = calculateNights(checkInDate, checkOutDate);
    return (rate * nights).toFixed(2);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading accommodations...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection
        title="Find Your Perfect Stay"
        subtitle="Discover and book accommodations for your journey"
        backgroundImage="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
        color="white"
        placeHolder="Search for accommodations..."
      />

      <div className="accommodation-page-container">
        <AccommodationFilter onFilterChange={handleFilterChange} />

        {/* Accommodation Listings */}
        <section className="accommodation-listings-section">
          <h2 className="accommodation-section-title">
            Available Accommodations
          </h2>

          {filteredAccommodations.length === 0 ? (
            <div className="no-results">
              <p>
                No accommodations found matching your criteria. Try adjusting
                your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="accommodation-card-grid">
                {filteredAccommodations
                  .slice(0, visibleCount)
                  .map((accommodation, index) => (
                    <AccommodationCard
                      key={index}
                      accommodation={accommodation}
                      onBookNow={() => handleBookNow(accommodation)}
                    />
                  ))}
              </div>

              {visibleCount < filteredAccommodations.length && (
                <button className="load-more-btn" onClick={handleLoadMore}>
                  Load More
                </button>
              )}
            </>
          )}
        </section>

        {/* Popular Locations */}
        <PopularLocations locations={popularLocations} />
      </div>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={handleCloseModal}
        size="lg"
        className="booking-modal">
        <Modal.Header closeButton>
          <Modal.Title>Book {selectedAccommodation?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingSuccess ? (
            <Alert variant="success">
              <Alert.Heading>Booking Successful!</Alert.Heading>
              <p>
                Your accommodation has been booked successfully. Check your
                email for confirmation details.
              </p>
            </Alert>
          ) : (
            selectedAccommodation && (
              <Form onSubmit={handleBookingSubmit}>
                <Row className="mb-4">
                  <Col md={6}>
                    <img
                      src={
                        selectedAccommodation.imagePaths?.[0] ||
                        "/default-accommodation.jpg"
                      }
                      alt={selectedAccommodation.name}
                      className="img-fluid rounded"
                      style={{
                        maxHeight: "220px",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col md={6}>
                    <h5>{selectedAccommodation.name}</h5>
                    <p>
                      <strong>Type:</strong> {selectedAccommodation.type}
                    </p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedAccommodation.location}
                    </p>
                    <p>
                      <strong>Price:</strong> $
                      {selectedAccommodation.pricePerNight}/night
                    </p>
                    <p>
                      <strong>Details:</strong> {selectedAccommodation.bedrooms}{" "}
                      bedrooms •{selectedAccommodation.bathrooms} bathrooms •
                      Max {selectedAccommodation.maxGuests} guests
                    </p>
                    {selectedAccommodation.amenities &&
                      selectedAccommodation.amenities.length > 0 && (
                        <p>
                          <strong>Amenities:</strong>{" "}
                          {selectedAccommodation.amenities.join(", ")}
                        </p>
                      )}
                  </Col>
                </Row>

                {bookingError && <Alert variant="danger">{bookingError}</Alert>}

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-in Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkInDate"
                        value={bookingData.checkInDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Check-out Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="checkOutDate"
                        value={bookingData.checkOutDate}
                        onChange={handleInputChange}
                        required
                        min={
                          bookingData.checkInDate ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Number of Guests</Form.Label>
                  <Form.Control
                    type="number"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    min="1"
                    max={selectedAccommodation.maxGuests}
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum allowed: {selectedAccommodation.maxGuests} guests
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Special Requests</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any special requests or requirements?"
                  />
                </Form.Group>

                {bookingData.checkInDate && bookingData.checkOutDate && (
                  <div className="booking-summary mb-3 p-3 bg-light rounded">
                    <h5>Booking Summary</h5>
                    <p>
                      <strong>Accommodation:</strong>{" "}
                      {selectedAccommodation.name}
                      <br />
                      <strong>Dates:</strong> {bookingData.checkInDate} to{" "}
                      {bookingData.checkOutDate}
                      <br />
                      <strong>Duration:</strong>{" "}
                      {calculateNights(
                        bookingData.checkInDate,
                        bookingData.checkOutDate
                      )}{" "}
                      nights
                      <br />
                      <strong>Guests:</strong> {bookingData.guests}
                      <br />
                      <strong>Price Per Night:</strong> $
                      {selectedAccommodation.pricePerNight}
                      <br />
                      <strong>Estimated Total:</strong> $
                      {calculateTotal(
                        selectedAccommodation.pricePerNight,
                        bookingData.checkInDate,
                        bookingData.checkOutDate
                      )}
                    </p>
                  </div>
                )}

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Confirm Booking
                  </Button>
                </div>
              </Form>
            )
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

// Sample data function (fallback if API isn't ready)
const getSampleAccommodations = () => {
  return [
    {
      id: 1,
      name: "Luxury Beachfront Villa",
      type: "Villa",
      location: "Bentota",
      pricePerNight: 250,
      imagePaths: ["https://via.placeholder.com/400x250?text=Luxury+Villa"],
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      amenities: [
        "Wi-Fi",
        "Pool",
        "Air Conditioning",
        "Kitchen",
        "Beach Access",
      ],
      description:
        "Beautiful beachfront villa with private pool and direct beach access.",
    },
    {
      id: 2,
      name: "Modern City Apartment",
      type: "Apartment",
      location: "Colombo",
      pricePerNight: 120,
      imagePaths: ["https://via.placeholder.com/400x250?text=Modern+Apartment"],
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ["Wi-Fi", "Air Conditioning", "Kitchen", "Gym Access"],
      description: "Stylish apartment in the heart of Colombo with city views.",
    },
    {
      id: 3,
      name: "Tea Plantation Cottage",
      type: "Cottage",
      location: "Nuwara Eliya",
      pricePerNight: 150,
      imagePaths: ["https://via.placeholder.com/400x250?text=Tea+Cottage"],
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 5,
      amenities: ["Wi-Fi", "Fireplace", "Garden", "Mountain View"],
      description:
        "Charming cottage surrounded by tea plantations with mountain views.",
    },
    {
      id: 4,
      name: "Ocean View Resort Room",
      type: "Hotel",
      location: "Galle",
      pricePerNight: 180,
      imagePaths: ["https://via.placeholder.com/400x250?text=Resort+Room"],
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant", "Ocean View"],
      description:
        "Luxurious resort room with stunning ocean views and access to amenities.",
    },
    {
      id: 5,
      name: "Hill Country Homestay",
      type: "Homestay",
      location: "Ella",
      pricePerNight: 85,
      imagePaths: ["https://via.placeholder.com/400x250?text=Homestay"],
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 3,
      amenities: ["Wi-Fi", "Breakfast", "Mountain View", "Garden"],
      description:
        "Authentic homestay experience with local hosts and homemade meals.",
    },
    {
      id: 6,
      name: "Riverside Cabin",
      type: "Cabin",
      location: "Kitulgala",
      pricePerNight: 110,
      imagePaths: ["https://via.placeholder.com/400x250?text=Riverside+Cabin"],
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 6,
      amenities: ["Wi-Fi", "River Access", "BBQ", "Terrace"],
      description:
        "Rustic cabin by the river, perfect for adventure enthusiasts.",
    },
    {
      id: 7,
      name: "Colonial Heritage Home",
      type: "Villa",
      location: "Kandy",
      pricePerNight: 200,
      imagePaths: ["https://via.placeholder.com/400x250?text=Heritage+Home"],
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      amenities: ["Wi-Fi", "Garden", "Antique Furniture", "Mountain View"],
      description:
        "Historic colonial home with original features and beautiful gardens.",
    },
    {
      id: 8,
      name: "Beach Bungalow",
      type: "Bungalow",
      location: "Mirissa",
      pricePerNight: 130,
      imagePaths: ["https://via.placeholder.com/400x250?text=Beach+Bungalow"],
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 3,
      amenities: ["Wi-Fi", "Air Conditioning", "Beach Access", "Terrace"],
      description:
        "Cozy bungalow just steps away from the beautiful Mirissa beach.",
    },
  ];
};

export default Accommodation;
