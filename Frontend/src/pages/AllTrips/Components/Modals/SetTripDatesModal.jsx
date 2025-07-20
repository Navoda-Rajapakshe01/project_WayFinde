import React from "react";

const SetTripDatesModal = ({
  trip,
  tripPlaceDates,
  setTripPlaceDates,
  onClose,
  onSave,
}) => {
  const tripStartDate = trip?.startDate?.slice(0, 10);
  const tripEndDate = trip?.endDate?.slice(0, 10);

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
          const prevEndDate =
            index > 0
              ? tripPlaceDates[index - 1].endDate || tripStartDate
              : tripStartDate;

          const minStartDate = prevEndDate;
          const minEndDate = item.startDate || minStartDate;

          return (
            <div key={index} className="place-date-row">
              <strong>{item.placeName}</strong>
              <div className="date-inputs">
                <input
                  type="date"
                  value={item.startDate}
                  min={minStartDate}
                  max={tripEndDate}
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
                  value={item.endDate}
                  min={minEndDate}
                  max={tripEndDate}
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

        <button className="save-btn" onClick={onSave}>
          Save Dates
        </button>
      </div>
    </div>
  );
};

export default SetTripDatesModal;
