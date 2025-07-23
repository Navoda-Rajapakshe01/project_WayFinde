import React, { useState } from "react";
import "./ShareTripModal.css";

const ShareTripModal = ({ tripId, onClose }) => {
  const baseUrl = window.location.origin;
  const shareLink = `${baseUrl}/shared-trip/${tripId}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  };

  return (
    <div className="sharepop-overlay" onClick={onClose}>
      <div className="sharepop-container" onClick={(e) => e.stopPropagation()}>
        <button className="sharepop-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="sharepop-title">Share Your Trip</h2>
        <p>Copy and send the link below to share your trip.</p>
        <div className="sharepop-copy-row">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="sharepop-input"
          />
          <button className="sharepop-copy-btn" onClick={handleCopy}>
            Copy
          </button>
        </div>

        {copied && <div className="sharepop-toast">✅ Link copied!</div>}
      </div>
    </div>
  );
};

export default ShareTripModal;
