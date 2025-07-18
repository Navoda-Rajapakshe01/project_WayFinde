import React, { useState } from "react";
import "./CalendarView.css";

const CalendarView = ({ trip }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const tripDates = trip.places.flatMap((place) => {
    const date = place?.startDate?.split("T")[0];
    return date ? [{ ...place, date }] : [];
  });

  const uniqueDates = [...new Set(tripDates.map((p) => p.date))];

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const filteredPlaces = selectedDate
    ? tripDates.filter((p) => p.date === selectedDate)
    : [];

  return (
    <div className="calendar-view">
      <div className="calendar-dates">
        {uniqueDates.length === 0 ? (
          <p>No dates available for this trip.</p>
        ) : (
          uniqueDates.map((date, index) => (
            <div
              key={index}
              className={`calendar-date ${selectedDate === date ? "active" : ""}`}
              onClick={() => handleDateClick(date)}
            >
              {date}
            </div>
          ))
        )}
      </div>

      <div className="calendar-places">
        {selectedDate ? (
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
