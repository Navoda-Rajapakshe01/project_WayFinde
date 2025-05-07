import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhone, FaEnvelope, FaCommentDots, FaTimes } from "react-icons/fa"; // Import FA icons
import "./ContactPopup.css";

const ContactPopup = ({ onClose }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLiveChat = () => {
    navigate("/chat"); // Redirect to the chat page
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-button" onClick={onClose}>
          <FaTimes /> {/* Close icon */}
        </button>

        {/* Contact Information */}
        <div className="contact-info">
          <h3>Contact Service Provider</h3>
          <p>
            <FaPhone className="icon" /> <strong>Telephone:</strong> +94 123 456
            789
          </p>
          <p>
            <FaEnvelope className="icon" /> <strong>Email:</strong>{" "}
            service@wayfinde.com
          </p>
        </div>

        {/* Live Chat Button */}
        <button className="live-chat-button" onClick={handleLiveChat}>
          <FaCommentDots className="icon" /> Live Chat
        </button>
      </div>
    </div>
  );
};

export default ContactPopup;
