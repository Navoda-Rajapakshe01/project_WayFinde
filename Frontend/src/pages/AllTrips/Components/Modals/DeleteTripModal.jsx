import React from "react";

const DeleteTripModal = ({
  tripId,
  onClose,
  onDeleteConfirm,
  loading = false,
}) => {
  return (
    <div className="popup-overlay-3" onClick={onClose}>
      <div className="popup-container-3" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="popup-close-3">
          &times;
        </button>
        <h2 className="popup-title">Confirm Deletion</h2>
        <p>Are you sure you want to permanently delete this trip?</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            className="delete-btn-trip"
            onClick={onDeleteConfirm}
            disabled={loading}
          >
            Yes
          </button>
          <button className="cancel-btn-trip" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTripModal;
