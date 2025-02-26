import React from "react";
import { FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ImageGrid = ({ images }) => {
  const navigate = useNavigate(); // Initialize navigation hook

  const handleNavigate = (index) => {
    navigate(`/blog/${index + 1}`); // Navigate to the blog page with a dynamic ID
  };

  return (
    <div className="container mx-auto px-4 py-8 border">
      

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
        {images.map((img, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg cursor-pointer flex justify-end border"
            onClick={() => handleNavigate(index)} // Navigate to the blog page when clicked
          >
            {/* Description (Left Side) */}
            <div className="text-left w-1/2">
              <p className="text-gray-600">Writer's name with profile picture.</p>
              <h3 className="text-lg font-semibold">Beaches in Sri Lanka</h3>
              <p className="text-gray-600">This is a brief of the blog.</p>
              <p className="inline-flex items-center">
                Date
                <FaComment className="text-xl" /> Comments
                <FaComment className="text-xl" /> Likes
              </p>
            </div>

            {/* Image (Right Side) */}
            <div className="w-1/2 overflow-hidden rounded-lg cursor-pointer flex justify-end">
              <img
                src={img}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-50 object-cover hover:scale-110 transition-transform duration-300 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
          
      {/* Modal for Image Enlargement */}
      {/* <Modal
        isOpen={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div className="relative">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-2 right-2 text-white text-2xl font-bold"
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-w-full max-h-screen rounded-lg"
          />
        </div>
      </Modal> */}

    </div>
  );
};

export default ImageGrid;

