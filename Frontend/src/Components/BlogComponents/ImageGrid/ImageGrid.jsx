import React from "react";
import { FaComment } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ImageGrid = ({ images, writerName, topic, briefDescription }) => {
  const navigate = useNavigate(); // Initialize navigation hook

  const handleNavigate = (index) => {
    navigate(`/blog/blog${index + 1}`); // Navigate to the blog page with a dynamic ID
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
        {images.map((img, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg cursor-pointer flex justify-end"
            onClick={() => handleNavigate(index)} // Navigate to the blog page when clicked
          >
            {/* Description (Left Side) */}
            <div className="text-left w-1/2">
              <p className="text-gray-600">
                <Link
                  to={`/profile/${img.writerName}`} // Navigate to the specific user's profile
                  className="text-blue-500 hover:underline"
                  onClick={(e) => e.stopPropagation()} // Prevent triggering blog navigation
                >
                  {img.writerName}
                </Link>
              </p>
              <h3 className="text-lg font-semibold">{img.topic}</h3>
              <p className="text-gray-600">{img.briefDescription}</p>
              <p className="inline-flex items-center">
                Date
                <FaComment className="text-xl" /> Comments
                <FaComment className="text-xl" /> Likes
              </p>
            </div>

            {/* Image (Right Side) */}
            <div className="w-1/2 overflow-hidden rounded-lg cursor-pointer flex justify-end">
              <img
                src={img.img}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-50 object-cover hover:scale-110 transition-transform duration-300 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
