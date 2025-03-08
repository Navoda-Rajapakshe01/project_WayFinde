import React from "react";
import { useLocation } from "react-router-dom";
import NameTag from "../Components/NameTag/NameTag"; // Name Tag Component
import PhotoGallery from "../Components/PhotoGallery/PhotoGallery"; // Photo Gallery Component
import AboutSection from "../Components/AboutSection/AboutSection"; // About Section Component
import ReviewSection from "../Components/ReviewSection/ReviewSection"; // Review Section Component
import ReserveNow from "../Components/ReserveNow/ReserveNow";
import "../pages/CSS/VehicleDetail.css";

const VehicleDetail = () => {
  const location = useLocation();
  const vehicle = location.state?.vehicle; // Access the vehicle data passed via state

  // Handle "Contact Now" button click
  const handleContactNow = () => {
    alert("Contact Now button clicked!"); // Replace with your logic

    useEffect(() => {
      window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);
  };

  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      user: "John Doe",
      rating: 4.5,
      comment: "Great vehicle! Very comfortable and reliable.",
      date: "2023-10-01",
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 5,
      comment: "Amazing experience. Highly recommended!",
      date: "2023-10-05",
    },
    // Add more reviews...
  ];

  return (
    <div className="vehicle-detail">
      {/* Name Tag Component */}
      <NameTag
        name={vehicle?.name}
        rating={4.5} // Replace with actual rating from data
        price={vehicle?.price}
        onContactNow={handleContactNow}
      />
      {/* Photo Gallery */}
      <PhotoGallery images={[vehicle?.image]} /> {/* Pass vehicle images */}
      {/* About Section */}
      <AboutSection
        vehicleDetails={{
          type: vehicle?.type,
          passengers: vehicle?.passengers,
          fuelType: vehicle?.fuelType,
          transmission: vehicle?.transmission,
          location: vehicle?.location,
        }}
        ownerDetails={{
          name: "Owner Name", // Replace with actual owner name
          city: "Owner City", // Replace with actual owner city
        }}
      />
      {/* Review and Rating Section */}
      <ReviewSection reviews={reviews} />
      {/* Reserve Now Section */}
      <ReserveNow />
    </div>
  );
};

export default VehicleDetail;
