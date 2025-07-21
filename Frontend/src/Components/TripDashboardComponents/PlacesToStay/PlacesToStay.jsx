import React from "react";
import "./PlacesToStay.css";

function PlaceToStay() {
  const hotels = [
    {
      id: 1,
      name: "Galle Fort Hotel",
      rating: 4.5,
      reviews: 136,
      imageSrc: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      label: "Hotel",
    },
    {
      id: 2,
      name: "The Heritage Galle Fort",
      rating: 4.3,
      reviews: 98,
      imageSrc: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      label: "Hotel",
    },
    {
      id: 3,
      name: "Blue Beach Suite",
      rating: 4.7,
      reviews: 56,
      imageSrc: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
      label: "Hotel",
    },
    {
      id: 4,
      name: "The Bartizan Galle Fort",
      rating: 4.4,
      reviews: 84,
      imageSrc: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
      label: "Hotel",
    },
    {
      id: 5,
      name: "Mango House",
      rating: 4.6,
      reviews: 74,
      imageSrc: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      label: "Hotel",
    },
    {
      id: 6,
      name: "Radisson Blu Resort",
      rating: 4.8,
      reviews: 219,
      imageSrc: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      label: "Hotel",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fas fa-star"></i>);
    }

    return stars;
  };

  return (
    <div className="placess-to-stay-container">
      
      {/* Render each travel place item */}
      <div className="placess-cards-container">
        {places.map((item, index) => (
          <div key={index} className="places-card">
            {/* Main Image */}
            <div
              className="places-image"
              style={{ backgroundImage: `url(${item.mainImageUrl})` }}
            >
              {/* Save Button */}
              <button
                className={`save-button ${savedPlaces.includes(item.id) ? 'save-button-active' : ''}`}
                onClick={(e) => toggleSave(item.id, e)}
                aria-label="Save this place"
              >
                <span>+</span> Add
              </button>
            </div>

            {/* Place Information */}
            <div className="places-info">
              <h3 className="place-name">{item.name}</h3>
              <p className="place-reviews">{item.reviews} reviews</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaceToStay;
