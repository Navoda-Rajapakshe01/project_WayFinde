import React from "react";
import "./PhotoGallery.css";

const PhotoGallery = ({ images }) => {
  return (
    <div className="photo-gallery">
      {images.map((image, index) => (
        <img key={index} src={image} alt={`Vehicle ${index + 1}`} />
      ))}
    </div>
  );
};

export default PhotoGallery;
