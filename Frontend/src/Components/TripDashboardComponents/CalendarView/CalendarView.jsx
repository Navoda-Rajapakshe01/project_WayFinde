import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CalendarView.css";

const CalendarView = ({ tripId, setSelectedDate, sharedMode = false }) => {
  const [tripPlaces, setTripPlaces] = useState([]);
  const [activeDate, setActiveDate] = useState(null);

  // ✅ Always normalize .NET backend result
  const places = tripPlaces?.$values || [];

  useEffect(() => {
    const fetchTripPlaces = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5030/api/trips/lightweight-map/${tripId}`
        );
        setTripPlaces(response.data);
      } catch (err) {
        console.error("Error fetching trip map data:", err);
      }
    };

    if (tripId) fetchTripPlaces();
  }, [tripId]);

  const uniqueDates = [...new Set(places.map((p) => p.startDate))];

  const filteredPlaces = activeDate
    ? places.filter((p) => p.startDate === activeDate)
    : [];

  return (
    <div className="calendar-view">
      <div className="calendar-dates">
        {uniqueDates.map((date, idx) => {
          const formatted = sharedMode
            ? `${new Date(date).getFullYear()}-XX-XX`
            : new Date(date).toLocaleDateString();

          return (
            <div
              key={idx}
              className={`calendar-date ${activeDate === date ? "active" : ""}`}
              onClick={() => {
                setSelectedDate(date);
                setActiveDate(date);
              }}
            >
              {formatted}
            </div>
          );
        })}
      </div>

      <div className="calendar-places">
        {activeDate ? (
          filteredPlaces.length ? (
            filteredPlaces.map((place, index) => (
              <div key={index} className="calendar-place">
                <h4>{place.name}</h4>
                <p>{place.district?.name}</p>
              </div>
            ))
          ) : (
            <p>No places for this date.</p>
          )
        ) : (
          <p>Click a date to view places.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
