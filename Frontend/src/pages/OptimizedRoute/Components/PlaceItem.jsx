import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FiTrash2 } from "react-icons/fi";
import "./PlaceItem.css";

const PlaceItem = ({ place, index, order, movePlace, removePlace }) => {
  const ref = useRef(null);

  /* ---------- unwrap data ---------- */
  const {
    id,
    placeName,
    name,
    avgTime,
    avgSpend,
    rating,
    howManyRated,
    imageUrl,
  } = place;
  const displayName = placeName || name || "Unnamed Place";

  /* ---------- drag-and-drop ---------- */
  const [{ isDragging }, drag] = useDrag({
    type: "PLACE_ITEM",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "PLACE_ITEM",
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const bounds = ref.current.getBoundingClientRect();
      const middleY = (bounds.bottom - bounds.top) / 2;
      const hoverY = (monitor.getClientOffset()?.y ?? 0) - bounds.top;

      if (dragIndex < hoverIndex && hoverY < middleY) return;
      if (dragIndex > hoverIndex && hoverY > middleY) return;

      movePlace(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const defaultImage = `/placeholder.svg?height=200&width=300&query=${displayName} Sri Lanka`;

  return (
    <div
      ref={ref}
      className={`place-item ${isDragging ? "dragging" : ""}`}
      data-handler-id={handlerId}
    >
      <div className="place-order">
        <span>{order}</span>
      </div>

      <div className="place-image-container-app">
        <img
          src={imageUrl || defaultImage}
          alt={displayName}
          className="place-image"
        />
      </div>

      <div className="place-details">
        <h3 className="place-name">{displayName}</h3>

        <div className="place-info-grid">
          <div className="place-info-item">
            <span className="info-label">Date</span>
            <span className="info-value">
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </span>
          </div>

          <div className="place-info-item">
            <span className="info-label">Staying Time</span>
            <span className="info-value">{avgTime || "24 hours"}</span>
          </div>

          <div className="place-info-item">
            <span className="info-label">Avg. Spent</span>
            <span className="info-value">
              {avgSpend ? `LKR ${avgSpend.toLocaleString()}` : "LKR 50,000"}
            </span>
          </div>
        </div>

        <div className="place-rating-address">
          <div className="place-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= Math.round(rating || 4) ? "filled" : ""
                }`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{rating || 4.5}</span>
            <span className="rating-count">({howManyRated || 2456})</span>
          </div>
        </div>
      </div>

      {/* --- Tailwind-styled remove button --- */}
      <button
        onClick={() => removePlace(id)}
        aria-label="Remove place"
        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default PlaceItem;
