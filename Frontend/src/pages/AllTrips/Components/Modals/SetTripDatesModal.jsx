import React, { useEffect } from "react";

const SetTripDatesModal = ({
  trip,
  tripPlaceDates,
  setTripPlaceDates,
  onClose,
  onSave,
}) => {
  const tripStartDate = trip?.startDate?.slice(0, 10);
  const tripEndDate = trip?.endDate?.slice(0, 10);

  const handleSave = async () => {
    try {
      const payload = tripPlaceDates.map((item) => ({
        tripId: trip.id,
        placeId: item.placeId,
        startDate: item.startDate,
        endDate: item.endDate,
      }));

      const res = await fetch(
        "http://localhost:5030/api/trips/save-trip-dates",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        if (onSave) onSave(); // Show toast in parent
        onClose(); // Close modal
      } else {
        console.error("Failed to save dates");
      }
    } catch (err) {
      console.error("Error saving dates", err);
    }
  };

  useEffect(() => {
    const fetchUpdatedTrip = async () => {
      try {
        const res = await fetch(`http://localhost:5030/api/trips/${trip.id}`);
        const data = await res.json();

        const places = data.places?.$values || [];

        const updated = places.map((p, idx, arr) => ({
          placeId: p.id,
          placeName: p.name,
          startDate:
            idx === 0
              ? data.startDate?.slice(0, 10)
              : p.startDate?.slice(0, 10) || "",
          endDate:
            idx === arr.length - 1
              ? data.endDate?.slice(0, 10)
              : p.endDate?.slice(0, 10) || "",
        }));

        setTripPlaceDates(updated);
      } catch (err) {
        console.error("Failed to fetch trip data", err);
      }
    };

    if (trip?.id) fetchUpdatedTrip();
  }, [trip]);

  return (
    <div className="popup-overlay-dates" onClick={onClose}>
      <div
        className="popup-container-dates"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="popup-close-3">
          &times;
        </button>
        <h2 className="popup-title">Set Dates for Each Place</h2>
        <p>
          Trip duration: {tripStartDate} to {tripEndDate}
        </p>

        {tripPlaceDates.length === 0 && <p>No places found for this trip.</p>}

        {tripPlaceDates.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === tripPlaceDates.length - 1;
          const startDateValue = isFirst ? tripStartDate : item.startDate || "";
          const endDateValue = isLast ? tripEndDate : item.endDate || "";

          const prevEndDate =
            index > 0
              ? tripPlaceDates[index - 1].endDate || tripStartDate
              : tripStartDate;

          // Limit start date to previous end date or next day only
          const allowedStartDateObj = new Date(prevEndDate);
          const allowedMaxStartDateObj = new Date(prevEndDate);
          allowedMaxStartDateObj.setDate(allowedMaxStartDateObj.getDate() + 1);

          const minStartDate = allowedStartDateObj.toISOString().slice(0, 10);
          const maxStartDate = allowedMaxStartDateObj
            .toISOString()
            .slice(0, 10);

          const minEndDate = startDateValue || minStartDate;
          const maxEndDate = tripEndDate;

          return (
            <div key={index} className="place-date-row">
              <strong>{item.placeName}</strong>
              <div className="date-inputs">
                <input
                  type="date"
                  value={startDateValue}
                  min={minStartDate}
                  max={maxStartDate}
                  disabled={isFirst}
                  onChange={(e) => {
                    const updated = [...tripPlaceDates];
                    updated[index].startDate = e.target.value;
                    if (
                      updated[index].endDate &&
                      updated[index].endDate < e.target.value
                    ) {
                      updated[index].endDate = "";
                    }
                    setTripPlaceDates(updated);
                  }}
                />
                <input
                  type="date"
                  value={endDateValue}
                  min={minEndDate}
                  max={maxEndDate}
                  disabled={isLast}
                  onChange={(e) => {
                    const updated = [...tripPlaceDates];
                    updated[index].endDate = e.target.value;
                    setTripPlaceDates(updated);
                  }}
                />
              </div>
            </div>
          );
        })}

        <button className="save-btn" onClick={handleSave}>
          Save Dates
        </button>
      </div>
    </div>
  );
};

export default SetTripDatesModal;
