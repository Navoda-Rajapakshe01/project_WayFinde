import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FiTrash2 } from "react-icons/fi";
import "./PlaceItem.css";

const PlaceItem = ({ place, index, order, movePlace, removePlace }) => {
  console.log("Received place:", place);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "PLACE_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "PLACE_ITEM",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
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

  const {
    id,
    name,
    avgTime,
    avgSpend,
    rating,
    howManyRated,
    mainImageUrl,
    district,
  } = place;

  const displayName = name || "Unnamed Place";
  const defaultImage = `/placeholder.svg?query=${displayName}`;

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
          src={mainImageUrl || defaultImage}
          alt={displayName}
          className="place-image"
        />
      </div>

      <div className="place-details">
        <h3 className="place-name">{displayName}</h3>

        <div className="place-info-grid">
          <div className="place-info-item">
            <span className="info-label">Staying Time</span>
            <span className="info-value">{avgTime}</span>
          </div>

          <div className="place-info-item">
            <span className="info-label">Avg. Spent</span>
            <span className="info-value">
              {typeof avgSpend === "number"
                ? `LKR ${avgSpend.toLocaleString()}`
                : "N/A"}
            </span>
          </div>

          {district?.name && (
            <div className="place-info-item">
              <span className="info-label">District</span>
              <span className="info-value">{district.name}</span>
            </div>
          )}
        </div>

        <div className="place-rating-address">
          <div className="place-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  rating && star <= Math.round(rating) ? "filled" : ""
                }`}
              >
                ★
              </span>
            ))}
            <span className="rating-value">{rating}</span>
            <span className="rating-count">({howManyRated})</span>
          </div>
        </div>
      </div>

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
