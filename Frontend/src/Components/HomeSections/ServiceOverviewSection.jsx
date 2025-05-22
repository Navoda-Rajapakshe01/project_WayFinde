import React from "react";
import {
  FaMapMarkedAlt,
  FaPenNib,
  FaHotel,
  FaCarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./ServiceOverviewSection.css";
import "../../App.css";

const services = [
  {
    icon: <FaMapMarkedAlt />,
    title: "Plan Your Adventures",
    description:
      "Easily research destinations, create detailed itineraries, and discover hidden gems for your perfect trip.",
    link: "/plantrip",
  },
  {
    icon: <FaPenNib />,
    title: "Share Your Journeys",
    description:
      "Document your travels, write inspiring blog posts, and share your stunning photos with our vibrant community.",
    link: "/blog",
  },
  {
    icon: <FaHotel />,
    title: "Find Your Perfect Stay",
    description:
      "Browse a wide range of accommodations, from luxury hotels to cozy guesthouses, suited to every budget.",
    link: "/accommodation",
  },
  {
    icon: <FaCarAlt />,
    title: "Arrange Your Transport",
    description:
      "Book vehicles, compare rental options, and ensure smooth travel between your destinations.",
    link: "/vehicle",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Discover Amazing Places",
    description:
      "Explore detailed information, photos, and reviews about the top places to visit. Plan your next adventure with us.",
    link: "/thingstodo",
  },
];

const ServicesOverviewSection = () => {
  return (
    <section className="services-overview-section homesection-padding">
      <div className="container">
        <h2 className="homesection-title text-center">What WayFind Offers</h2>
        <p className="homesection-subtitle text-center">
          Everything you need for an unforgettable travel experience, all in one
          place.
        </p>
        <div className="services-grid">
          {services.map((service, index) => (
            <a href={service.link} className="service-card-link" key={index}>
              <div className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
