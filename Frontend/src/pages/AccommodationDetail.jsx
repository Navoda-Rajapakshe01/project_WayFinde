import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAccommodation } from "../api";

const AccommodationDetail = () => {
  const { id } = useParams();

  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        setLoading(true);
        const data = await getAccommodation(id);
        const mappedAccommodation = {
          ...data,
          name: `${data.name}`,
          price: `$${data.pricePerDay.toFixed(2)}`,
          images: data.images?.map((img) => ({ url: img.imageUrl })) || [],
          reviews:
            data.reviews?.map((rev) => ({
              id: rev.id,
              user: rev.reviewerName,
              rating: rev.rating,
              comment: rev.comment,
              date: rev.datePosted,
            })) || [],
          type: data.type,
          guests: data.numberOfGuests,
          rooms: data.numberOfBedRooms,
          beds: data.numberOfBeds,
          bathRooms: data.numberOfBathRooms,
          location: data.location,
          isAvailable: data.isAvailable,
        };
        setAccommodation(mappedAccommodation);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Accommodation not found"
            : "Failed to load Accommodation"
        );
        setLoading(false);
      }
    };
    fetchAccommodation();
    window.scrollTo(0, 0);
  }, [id]);

  const handleContactNow = () => {
    alert("Contact Now button clicked!"); // Replace with actual logic
  };

  if (loading) return <div>Loading Accommodation details...</div>;
  if (error) return <div>{error}</div>;
  if (!accommodation) return <div>Accommodation not found</div>;

  const averageRating = accommodation.reviews.length
    ? (
        accommodation.reviews.reduce((sum, rev) => sum + rev.rating, 0) /
        accommodation.reviews.length
      ).toFixed(1)
    : 4.5;

  const ownerDetails = {
    name: accommodation.ownerName,
    city: accommodation.ownerCity,
  };

  return {};
};

export default AccommodationDetail;
