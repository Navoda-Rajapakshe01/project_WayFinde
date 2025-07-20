import React from "react";

const InviteCollaboratorsModal = ({
  selectedTrip,
  currentUserId,
  searchQuery,
  setSearchQuery,
  searchResults,
  selectedUsers,
  setSelectedUsers,
  existingCollaborators,
  pendingTripInvites,
  setShowPopup,
  setSuccessMessage,
  setSearchResults,
  refreshCollaborators,
}) => {
  const addCollaborators = async () => {
    try {
      await Promise.all(
        selectedUsers.map((user) =>
          fetch(
            `http://localhost:5030/api/trips/add-collaborator?tripId=${selectedTrip?.id}&userId=${user.id}`,
            { method: "POST" }
          )
        )
      );

      setSuccessMessage("Collaborators saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      setSelectedUsers([]);
      setSearchQuery("");
      setSearchResults([]);

      await refreshCollaborators();
    } catch (error) {
      console.error("Failed to save collaborators", error);
      alert("Error saving collaborators.");
    }
  };

  return (
    <div className="popup-overlay-3" onClick={() => setShowPopup(null)}>
      <div className="popup-container-3" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowPopup(null)} className="popup-close-3">
          &times;
        </button>
        <h2 className="popup-title">Add Collaborator</h2>

        <input
          type="text"
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ul className="search-results">
          {searchResults
            .filter(
              (user) =>
                user.id !== currentUserId &&
                !existingCollaborators.some((c) => c.id === user.id)
            )
            .map((user) => {
              const alreadySelected = selectedUsers.some(
                (u) => u.id === user.id
              );
              const initial = user.username?.[0]?.toUpperCase() || "?";

              return (
                <li key={user.id} className="search-item-row">
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt="profile"
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar initials-avatar">
                      {initial}
                    </div>
                  )}
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  {alreadySelected ? (
                    <span className="status-tag">Selected</span>
                  ) : (
                    <button
                      className="add-btn"
                      onClick={() => setSelectedUsers([...selectedUsers, user])}
                    >
                      Add
                    </button>
                  )}
                </li>
              );
            })}
        </ul>

        {searchQuery.trim() === "" && existingCollaborators.length > 0 && (
          <div className="existing-collaborators">
            <h3>Collaborators</h3>
            <ul className="collaborator-list">
              {existingCollaborators
                .sort((a, b) =>
                  String(a.id) === String(currentUserId)
                    ? -1
                    : String(b.id) === String(currentUserId)
                    ? 1
                    : 0
                )
                .map((user) => (
                  <li key={user.id} className="collaborator-item">
                    {user.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt="profile"
                        className="profile-avatar"
                      />
                    ) : (
                      <div className="profile-avatar initials-avatar">
                        {user.username?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="collaborator-details">
                      <span className="collaborator-name">
                        {user.username}
                        {String(user.id).toLowerCase() ===
                          String(selectedTrip?.userId).toLowerCase() && (
                          <em className="owner-label"> (Owner)</em>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {pendingTripInvites.length > 0 && (
          <div className="pending-invites-list">
            <h3>Pending Invites</h3>
            <ul>
              {pendingTripInvites.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedUsers.length > 0 && (
          <>
            <div className="selected-collaborators">
              {selectedUsers.map((user) => (
                <div className="selected-collaborator1" key={user.id}>
                  {user.username}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      setSelectedUsers(
                        selectedUsers.filter((u) => u.id !== user.id)
                      )
                    }
                    aria-label={`Remove ${user.username}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <button className="save-btn" onClick={addCollaborators}>
              Save Collaborators
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InviteCollaboratorsModal;
