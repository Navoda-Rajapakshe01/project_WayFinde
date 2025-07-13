import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PlaceCard from "./PlaceCard";
import "./PlacesList.css";

const PlacesList = ({ places, onAddPlace, selectedPlaces }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 300; // Adjust as needed
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  const isPlaceSelected = (placeId) => {
    return selectedPlaces.some((place) => place.id === placeId);
  };

  return (
    <div className="places-list-container">
      <button
        className={`scroll-button left ${scrollPosition <= 0 ? "hidden" : ""}`}
        onClick={() => handleScroll("left")}
      >
        ←
      </button>

      <div className="places-list" ref={containerRef}>
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onAddPlace={onAddPlace}
            isSelected={isPlaceSelected(place.id)}
          />
        ))}
      </div>

      <button
        className="scroll-button right"
        onClick={() => handleScroll("right")}
      >
        →
      </button>
    </div>
  );
};

export default PlacesList;
