import React, { useState, useEffect } from "react";
import "./AllTrips.css";
import TripDashboard from "../TripDashboard";
import { calculateTripStats } from "./utils/tripStats"; // adjust path if needed
import { Bell, Users, Share2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllTrips = () => {
  const [tripStats, setTripStats] = useState({});
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showPopup, setShowPopup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [existingCollaborators, setExistingCollaborators] = useState([]);
  const navigate = useNavigate();
  const [confirmDeleteTrip, setConfirmDeleteTrip] = useState(null);

  const currentUserId = localStorage.getItem("userId");

  const [collaborativeTrips, setCollaborativeTrips] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [pendingTripInvites, setPendingTripInvites] = useState([]);
  const [showSetDatesPopup, setShowSetDatesPopup] = useState(false);
  const [tripPlaceDates, setTripPlaceDates] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const refreshCollaborativeTrips = async () => {
    try {
      const res = await fetch(
        `http://localhost:5030/api/trips/collaborative?userId=${currentUserId}`
      );
      const data = await res.json();

      const mappedCollaborative = data.map((trip) => {
        const { totalSpent, totalDistance } = calculateTripStats(
          trip.places || []
        );
        return {
          ...trip,
          name: trip.tripName,
          avgSpent: `LKR ${trip.avgSpend?.toLocaleString() ?? "0"}`,
          startLocation: trip.places?.[0]?.name || "N/A",
          totalDistance: `${totalDistance} km`,
          destinations:
            trip.places?.map((place) => ({
              name: place.name || "N/A",
              stay: place.avgTime || "24 hrs",
              date: place.startDate
                ? new Date(place.startDate).toLocaleDateString()
                : new Date(trip.startDate).toLocaleDateString(),
            })) || [],
          thumbnail: trip.thumbnail || "https://via.placeholder.com/120",
        };
      });

      setCollaborativeTrips(mappedCollaborative);
    } catch (err) {
      console.error("Error fetching collaborative trips:", err);
    }
  };

  const refreshPendingInvites = () => {
    fetch(`http://localhost:5030/api/trips/invitations?userId=${currentUserId}`)
      .then((res) => res.json())
      .then(setPendingInvites);
  };

  useEffect(() => {
    if (showPopup === "invite" && selectedTrip) {
      fetch(
        `http://localhost:5030/api/trips/get-collaborators?tripId=${selectedTrip.id}`
      )
        .then((res) => res.json())
        .then(setExistingCollaborators)
        .catch(console.error);

      fetch(
        `http://localhost:5030/api/trips/get-pending-invites?tripId=${selectedTrip.id}`
      )
        .then((res) => res.json())
        .then(setPendingTripInvites)
        .catch(console.error);
    }
  }, [showPopup, selectedTrip]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch(`http://localhost:5030/api/trips/search-users?query=${searchQuery}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const fetchTripPreviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5030/api/trips/user-preview/${currentUserId}`
      );
      const data = await res.json();

      // Use only date part (YYYY-MM-DD) for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to midnight

      const upcoming = data.filter((trip) => {
        const tripStart = new Date(trip.startDate);
        tripStart.setHours(0, 0, 0, 0); // normalize
        return tripStart >= today;
      });

      const completed = data.filter((trip) => {
        const tripEnd = new Date(trip.endDate);
        tripEnd.setHours(0, 0, 0, 0);
        return tripEnd < today;
      });

      setUpcomingTrips(upcoming);
      setCompletedTrips(completed);

      // Summary stats
      const totalTrips = data.length;
      const placesVisited = data
        .filter((trip) => new Date(trip.endDate) < new Date()) // ✅ Only completed trips
        .reduce((sum, trip) => sum + (trip.places?.length || 0), 0);

      const nextTrip = upcoming.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      )[0];

      setTripStats({
        completedTrips: completed.length,
        upcomingTrips: upcoming.length,
        placesVisited,
        nextTripDate: nextTrip?.startDate?.slice(0, 10) || "N/A",
      });

      // 🧠 Map destinations to show in right-side preview
      const allTripsWithPreview = data.map((trip) => {
        const { totalSpent, totalDistance } = calculateTripStats(
          trip.places || []
        );

        return {
          ...trip,
          name: trip.tripName,
          avgSpent: `LKR ${trip.avgSpend?.toLocaleString() ?? "0"}`,
          startLocation: trip.places?.[0]?.name || "N/A",
          userId: trip.userId,
          totalDistance: `${totalDistance} km`,
          destinations:
            trip.places?.map((place) => ({
              name: place.name || "N/A",
              stay: place.avgTime || "24 hrs",
              date: place.startDate
                ? new Date(place.startDate).toLocaleDateString()
                : new Date(trip.startDate).toLocaleDateString(),
            })) || [],
          thumbnail: trip.thumbnail || "https://via.placeholder.com/120",
        };
      });

      // 🪄 Update preview trips with this mapped data
      setUpcomingTrips(
        allTripsWithPreview.filter((trip) => {
          const tripStart = new Date(trip.startDate);
          const today = new Date();
          tripStart.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return tripStart >= today;
        })
      );

      setCompletedTrips(
        allTripsWithPreview.filter((trip) => {
          const tripEnd = new Date(trip.endDate);
          const today = new Date();
          tripEnd.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          return tripEnd < today;
        })
      );

      // Set right side preview default selection
      setSelectedTrip(allTripsWithPreview[0] || null);
    } catch (err) {
      console.error("Error fetching trip previews:", err);
    }
  };

  useEffect(() => {
    fetchTripPreviews();
  }, []);

  // ──────────────────────────────────────────
  // LOAD COLLABORATIVE TRIPS WHEN TAB IS OPEN
  // ──────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "collaborative") return; // only run on that tab

    fetch(
      `http://localhost:5030/api/trips/collaborative?userId=${currentUserId}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Map the API response exactly the same way you do for upcoming trips
        const mappedCollaborative = data.map((trip) => {
          const { totalSpent, totalDistance } = calculateTripStats(
            trip.places || []
          );
          return {
            ...trip,
            name: trip.tripName,
            avgSpent: `LKR ${trip.avgSpend?.toLocaleString() ?? "0"}`,
            startLocation: trip.places?.[0]?.name || "N/A",
            userId: trip.userId,
            totalDistance: `${totalDistance} km`,
            destinations:
              trip.places?.map((place) => ({
                name: place.name || "N/A",
                stay: place.avgTime || "24 hrs",
                date: place.startDate
                  ? new Date(place.startDate).toLocaleDateString()
                  : new Date(trip.startDate).toLocaleDateString(),
              })) || [],
            thumbnail: trip.thumbnail || "https://via.placeholder.com/120",
          };
        });

        setCollaborativeTrips(mappedCollaborative);

        // Automatically select the first collaborative trip so its
        // destinations appear on the right‑hand panel
        setSelectedTrip(mappedCollaborative[0] || null);
      })
      .catch((error) => {
        console.error("Failed to fetch collaborative trips:", error);
      });
  }, [activeTab, currentUserId]);

  useEffect(() => {
    fetch(`http://localhost:5030/api/trips/invitations?userId=${currentUserId}`)
      .then((res) => res.json())
      .then(setPendingInvites);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const panel = document.querySelector(".notification-panel");
      const bell = document.querySelector(".notification-bell");

      if (
        panel &&
        !panel.contains(event.target) &&
        bell &&
        !bell.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const respondToInvite = async (tripId, accept) => {
    await fetch(
      `http://localhost:5030/api/trips/respond-invitation?tripId=${tripId}&userId=${currentUserId}&accept=${accept}`,
      { method: "POST" }
    );

    refreshCollaborativeTrips(); // you can reload trips
    refreshPendingInvites(); // reload invites
  };

  const toggleMenu = (tripId) => {
    setMenuOpen(menuOpen === tripId ? null : tripId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".menu-dropdown.show");
      const icons = document.querySelectorAll(".menu-icon");

      const clickedInsideMenu = Array.from(dropdowns).some((menu) =>
        menu.contains(event.target)
      );
      const clickedMenuIcon = Array.from(icons).some((icon) =>
        icon.contains(event.target)
      );

      if (!clickedInsideMenu && !clickedMenuIcon) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const deleteTrip = (tripId) => {
    setUpcomingTrips(upcomingTrips.filter((trip) => trip.id !== tripId));
  };

  return (
    <div className="upcoming-trips-container">
      <div className="trip-stats">
        <div className="stat-box">
          Completed Trips: {tripStats.completedTrips}
        </div>
        <div className="stat-box">
          Upcoming Trips: {tripStats.upcomingTrips}
        </div>
        <div className="stat-box">
          Places Visited: {tripStats.placesVisited}
        </div>
        <div className="stat-box">Next Trip Date: {tripStats.nextTripDate}</div>
      </div>

      <div className="trip-controls-row">
        <div className="trip-tabs">
          <button
            className={activeTab === "upcoming" ? "active" : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Trips
          </button>
          <button
            className={activeTab === "completed" ? "active" : ""}
            onClick={() => setActiveTab("completed")}
          >
            Completed Trips
          </button>
          <button
            className={activeTab === "collaborative" ? "active" : ""}
            onClick={() => setActiveTab("collaborative")}
          >
            Collaborative Trips
          </button>
        </div>

        {/* 🔔 Bell + Popup Wrapper */}
        <div className="notification-wrapper" style={{ position: "relative" }}>
          <div
            className="notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="bell-icon">
              <Bell size={20} className="notification-bell-icon" />
            </span>
            {pendingInvites.length > 0 && (
              <span className="notification-count">
                {pendingInvites.length}
              </span>
            )}
          </div>

          {showNotifications && (
            <>
              <div
                className="overlay-backdrop"
                onClick={() => setShowNotifications(false)}
              ></div>

              <div
                className="notification-panel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="notification-header">
                  <h4 style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Pending Invitations
                  </h4>
                  <button
                    className="notification1-close"
                    onClick={() => setShowNotifications(false)}
                  >
                    &times;
                  </button>
                </div>

                {/* Notifications List */}
                {pendingInvites.length === 0 ? (
                  <p>No new invitations</p>
                ) : (
                  pendingInvites.map((invite) => (
                    <div key={invite.tripId} className="invitation-card">
                      <div className="invitation-text">
                        <span className="inviter-name">{invite.ownerName}</span>{" "}
                        invited you to join
                        <span className="trip-name"> “{invite.tripName}”</span>.
                      </div>

                      <div className="invitation-actions">
                        <button
                          className="btn-invite accept"
                          onClick={() => respondToInvite(invite.tripId, true)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-invite reject"
                          onClick={() => respondToInvite(invite.tripId, false)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="trips-content">
        <div className="trip-list-container">
          <div className="trip-list">
            {(activeTab === "upcoming"
              ? upcomingTrips
              : activeTab === "completed"
              ? completedTrips
              : collaborativeTrips
            ) // collaborativeTrips placeholder
              .map((trip) => (
                <div
                  key={trip.id}
                  className={`trip-card ${
                    selectedTrip?.id === trip.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="trip-card-header">
                    <img
                      src={trip.thumbnail}
                      alt="Trip"
                      className="trip-thumbnail"
                    />
                    <div className="trip-card-info">
                      <h3 className="trip-name1">{trip.name}</h3>
                      <p>Start Date: {trip.startDate?.slice(0, 10)}</p>
                      <p>Avg. Spent: {trip.avgSpent}</p>
                      <p>Start Location: {trip.startLocation}</p>
                    </div>
                  </div>

                  <div
                    className="menu-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(trip.id);
                    }}
                  >
                    ...
                  </div>
                  {menuOpen === trip.id && (
                    <div className="menu-dropdown show">
                      <div
                        className="menu-option"
                        onClick={() => setShowPopup("invite")}
                      >
                        <Users size={16} style={{ marginRight: "8px" }} />
                        Collaborators
                      </div>
                      <div
                        className="menu-option"
                        onClick={() => setShowPopup("share")}
                      >
                        <Share2 size={16} style={{ marginRight: "8px" }} />
                        Share Trip
                      </div>
                      <div
                        className="menu-option delete"
                        onClick={() => setConfirmDeleteTrip(trip.id)}
                      >
                        <Trash2 size={16} style={{ marginRight: "8px" }} />
                        Delete
                      </div>
                    </div>
                  )}
                  <div className="trip-card-actions">
                    {activeTab !== "completed" && (
                      <button
                        className="set-dates-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const placesWithDates =
                            trip.places?.map((place) => ({
                              placeId: place.id,
                              placeName: place.name,
                              startDate: place.startDate || "",
                              endDate: place.endDate || "",
                            })) || [];

                          setTripPlaceDates(placesWithDates);
                          setSelectedTrip(trip);
                          setShowSetDatesPopup(true);
                        }}
                      >
                        {trip.places?.every((p) => p.startDate && p.endDate)
                          ? "Update Dates"
                          : "Set Dates"}
                      </button>
                    )}

                    <button
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tripdashboard/${trip.id}`);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="trip-details">
          {selectedTrip ? (
            <>
              <h2 style={{ fontWeight: "bold" }}>{selectedTrip.name}</h2>
              <ul>
                {selectedTrip.destinations?.map((dest, index) => (
                  <li key={index}>
                    {index + 1}.&nbsp;{dest.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No trip selected</p>
          )}
        </div>
      </div>

      {showPopup === "invite" && (
        <div className="popup-overlay-3" onClick={() => setShowPopup(null)}>
          <div
            className="popup-container-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(null)}
              className="popup-close-3"
            >
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
                          onClick={() =>
                            setSelectedUsers([...selectedUsers, user])
                          }
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
                  {
                    // 🧪 Debug Logs (inserted here)
                    (console.log("selectedTrip.userId:", selectedTrip?.userId),
                    existingCollaborators.forEach((u) =>
                      console.log("collaborator id:", u.id)
                    ))
                  }

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

                <button
                  className="save-btn"
                  onClick={async () => {
                    try {
                      // Send all collaborator POST requests and wait for all to finish
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

                      // Clear selected users and inputs
                      setSelectedUsers([]);
                      setSearchQuery("");
                      setSearchResults([]);

                      // Refresh existing collaborators list from backend
                      const res = await fetch(
                        `http://localhost:5030/api/trips/get-collaborators?tripId=${selectedTrip.id}`
                      );
                      const data = await res.json();
                      setExistingCollaborators(data);

                      // Keep popup open or close it if you want
                      // setShowPopup(null);
                    } catch (error) {
                      console.error("Failed to save collaborators", error);
                      alert("Error saving collaborators.");
                    }
                  }}
                >
                  Save Collaborators
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showPopup === "share" && (
        <div className="popup-overlay-3" onClick={() => setShowPopup(null)}>
          <div
            className="popup-container-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(null)}
              className="popup-close-3"
            >
              &times;
            </button>
            <h2 className="popup-title">Share Your Trip</h2>
            <p>Copy and send the link below to share your trip.</p>
            <div className="copy-container">
              <input
                type="text"
                value="Generated_Link"
                readOnly
                className="copy-input"
              />
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText("Generated_Link")}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteTrip && (
        <div
          className="popup-overlay-3"
          onClick={() => setConfirmDeleteTrip(null)}
        >
          <div
            className="popup-container-3"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setConfirmDeleteTrip(null)}
              className="popup-close-3"
            >
              &times;
            </button>
            <h2 className="popup-title">Confirm Deletion</h2>
            <p>Are you sure you want to permanently delete this trip?</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                className="delete-btn-trip"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://localhost:5030/api/trips/${confirmDeleteTrip}`,
                      {
                        method: "DELETE",
                      }
                    );

                    if (res.ok) {
                      await fetchTripPreviews();
                      await refreshCollaborativeTrips();

                      setConfirmDeleteTrip(null);
                      setSuccessMessage("Trip deleted successfully.");
                      setTimeout(() => setSuccessMessage(""), 3000);
                    } else {
                      alert("Failed to delete trip.");
                    }
                  } catch (err) {
                    console.error("Error deleting trip:", err);
                    alert("An error occurred.");
                  }
                }}
              >
                Yes
              </button>
              <button
                className="cancel-btn-trip"
                onClick={() => setConfirmDeleteTrip(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showSetDatesPopup && (
        <div
          className="popup-overlay-dates"
          onClick={() => setShowSetDatesPopup(false)}
        >
          <div
            className="popup-container-dates"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSetDatesPopup(false)}
              className="popup-close-3"
            >
              &times;
            </button>
            <h2 className="popup-title">Set Dates for Each Place</h2>
            <p>
              Trip duration: {selectedTrip?.startDate?.slice(0, 10)} to{" "}
              {selectedTrip?.endDate?.slice(0, 10)}
            </p>

            {tripPlaceDates.length === 0 && (
              <p>No places found for this trip.</p>
            )}

            {tripPlaceDates.map((item, index) => {
              // Calculate min start date:
              // For the first place, min start is trip start date
              // For others, min start is previous place's endDate (or trip start if undefined)
              const prevEndDate =
                index > 0
                  ? tripPlaceDates[index - 1].endDate ||
                    selectedTrip?.startDate?.slice(0, 10)
                  : selectedTrip?.startDate?.slice(0, 10);

              // The min start date for this place cannot be earlier than prevEndDate
              const minStartDate = prevEndDate;

              // The min end date for this place cannot be earlier than its own startDate or minStartDate
              const minEndDate = item.startDate || minStartDate;

              const tripEndDate = selectedTrip?.endDate?.slice(0, 10);

              return (
                <div key={index} className="place-date-row">
                  <strong>{item.placeName}</strong>
                  <div className="date-inputs">
                    <input
                      type="date"
                      value={item.startDate}
                      min={minStartDate}
                      max={tripEndDate}
                      onChange={(e) => {
                        const updated = [...tripPlaceDates];
                        updated[index].startDate = e.target.value;

                        // If endDate is before new startDate, clear it
                        if (
                          updated[index].endDate &&
                          updated[index].endDate < e.target.value
                        ) {
                          updated[index].endDate = "";
                        }

                        setTripPlaceDates(updated);
                      }}
                    />
                    <input
                      type="date"
                      value={item.endDate}
                      min={minEndDate}
                      max={tripEndDate}
                      onChange={(e) => {
                        const updated = [...tripPlaceDates];
                        updated[index].endDate = e.target.value;
                        setTripPlaceDates(updated);
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <button
              className="save-btn"
              onClick={async () => {
                console.log("Saving trip place dates:", tripPlaceDates);

                const payload = tripPlaceDates.map((item) => ({
                  tripId: selectedTrip.id,
                  placeId: item.placeId,
                  startDate: item.startDate,
                  endDate: item.endDate,
                }));

                try {
                  const res = await fetch(
                    "http://localhost:5030/api/trips/save-trip-dates",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }
                  );

                  if (res.ok) {
                    await fetchTripPreviews();
                    await refreshCollaborativeTrips();

                    // ✅ Update selectedTrip manually with new place dates
                    const updatedTrip = {
                      ...selectedTrip,
                      places: tripPlaceDates.map((item) => ({
                        id: item.placeId,
                        name: item.placeName,
                        startDate: item.startDate,
                        endDate: item.endDate,
                      })),
                    };
                    setSelectedTrip(updatedTrip);

                    setSuccessMessage("Trip dates saved successfully!");
                    setTimeout(() => setSuccessMessage(""), 3000);

                    setShowSetDatesPopup(false);
                  } else {
                    alert("Failed to save trip dates.");
                  }
                } catch (error) {
                  console.error("Error saving trip dates:", error);
                  alert("An error occurred while saving trip dates.");
                }
              }}
            >
              Save Dates
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          className="alltrip-success-message"
          onClick={() => setSuccessMessage("")}
        >
          <div className="alltrip-success-content">
            <span className="alltrip-success-icon">✓</span>
            <h3>{successMessage}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTrips;
