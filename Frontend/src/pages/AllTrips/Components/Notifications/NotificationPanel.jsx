import React from "react";

const NotificationPanel = ({ pendingInvites, onClose, onRespondToInvite }) => {
  return (
    <>
      <div className="overlay-backdrop" onClick={onClose}></div>

      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
            Pending Invitations
          </h4>
          <button className="notification1-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {pendingInvites.length === 0 ? (
          <p>No new invitations</p>
        ) : (
          pendingInvites.map((invite) => (
            <div key={invite.tripId} className="invitation-card">
              <div className="invitation-text-flex">
                <img
                  src={invite.ownerProfileImageUrl}
                  alt="Owner"
                  className="owner-profile-img"
                />
                <div className="invitation-message">
                  <strong>{invite.ownerName}</strong> invited you to join{" "}
                  <span className="trip-name">“{invite.tripName}”</span>.
                </div>
              </div>

              <div className="invitation-actions">
                <button
                  className="btn-invite accept"
                  onClick={() => onRespondToInvite(invite.tripId, true)}
                >
                  Accept
                </button>
                <button
                  className="btn-invite reject"
                  onClick={() => onRespondToInvite(invite.tripId, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default NotificationPanel;
