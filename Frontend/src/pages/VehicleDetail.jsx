// src/pages/VehicleDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AboutSection from "../Components/AboutSection/AboutSection";
import NameTag from "../Components/NameTag/NameTag";
import PhotoGallery from "../Components/PhotoGallery/PhotoGallery";
import ReserveNow from "../Components/ReserveNow/ReserveNow";
import ReviewSection from "../Components/ReviewSection/ReviewSection";
import { getVehicle } from "../api";
import "../pages/CSS/VehicleDetail.css";

const VehicleDetail = () => {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await getVehicle(id);
        // Map backend response to frontend format
        const mappedVehicle = {
          ...data,
          name: `${data.brand} ${data.model}`,
          price: `$${data.pricePerDay.toFixed(2)}`,
          images: data.images.map((img) => ({ url: img.imageUrl })),
          reviews: data.reviews.map((rev) => ({
            id: rev.id,
            user: rev.reviewerName,
            rating: rev.rating,
            comment: rev.comment,
            date: rev.datePosted,
          })),
          type: data.type,
          passengers: data.numberOfPassengers,
          fuelType: data.fuelType,
          transmission: data.transmissionType,
          location: data.location,
          isAvailable: data.isAvailable,
        };
        setVehicle(mappedVehicle);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Vehicle not found"
            : "Failed to load vehicle"
        );
        setLoading(false);
      }
    };
    fetchVehicle();

    // Scroll to top
    window.scrollTo(0, 0);
  }, [id]);

  // Handle "Contact Now" button click
  const handleContactNow = () => {
    alert("Contact Now button clicked!"); // Replace with actual logic
  };

  if (loading) return <div>Loading vehicle details...</div>;
  if (error) return <div>{error}</div>;
  if (!vehicle) return <div>Vehicle not found</div>;

  // Calculate average rating
  const averageRating = vehicle.reviews.length
    ? (
        vehicle.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
        vehicle.reviews.length
      ).toFixed(1)
    : 4.5;

  // Owner details from backend
  const ownerDetails = {
    name: vehicle.ownerName,
    city: vehicle.ownerCity,
  };

  return (
    <div className="vehicle-detail">
      <NameTag
        name={vehicle.name}
        rating={averageRating}
        price={vehicle.price}
        onContactNow={handleContactNow}
      />
      <PhotoGallery images={vehicle.images} />
      <AboutSection vehicleDetails={vehicle} ownerDetails={ownerDetails} />
      <ReviewSection reviews={vehicle.reviews} vehicleId={vehicle.id} />
      <ReserveNow vehicleId={vehicle.id} isAvailable={vehicle.isAvailable} />
    </div>
  );
};

export default VehicleDetail;
