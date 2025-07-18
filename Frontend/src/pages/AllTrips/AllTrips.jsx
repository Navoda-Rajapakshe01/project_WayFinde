import React, { useState, useEffect } from "react";
import "./AllTrips.css";
import TripDashboard from "../TripDashboard";
import { calculateTripStats } from "./utils/tripStats"; // adjust path if needed

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

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

  const refreshCollaborativeTrips = () => {
    fetch(
      `http://localhost:5030/api/trips/collaborative?userId=${currentUserId}`
    )
      .then((res) => res.json())
      .then(setCollaborativeTrips);
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

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(
          `http://localhost:5030/api/trips/user/${currentUserId}`
        );

        const trips = await res.json();

        const today = new Date();

        // Filter upcoming and completed trips
        const upcoming = trips.filter((t) => new Date(t.startDate) >= today);
        const completed = trips.filter((t) => new Date(t.startDate) < today);

        // Calculate total places visited from completed trips
        const totalPlaces = completed.reduce(
          (acc, trip) => acc + (trip.places?.length || 0),
          0
        );

        const nextTripDate =
          upcoming.length > 0
            ? new Date(
                Math.min(...upcoming.map((t) => new Date(t.startDate)))
              ).toLocaleDateString()
            : "N/A";

        setTripStats({
          completedTrips: completed.length,
          upcomingTrips: upcoming.length,
          placesVisited: totalPlaces,

          nextTripDate,
        });

        // Map upcoming trips to include extra fields for display
        const mappedUpcoming = upcoming.map((trip) => {
          const { totalSpent, totalDistance } = calculateTripStats(
            trip.places || []
          );
          return {
            ...trip,
            name: trip.tripName,
            avgSpent: `LKR ${totalSpent.toLocaleString()}`,
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
          };
        });

        // Map completed trips the same way
        const mappedCompleted = completed.map((trip) => {
          const { totalSpent, totalDistance } = calculateTripStats(
            trip.places || []
          );
          return {
            ...trip,
            name: trip.tripName,
            avgSpent: `LKR ${totalSpent.toLocaleString()}`,
            startLocation: trip.places?.[0]?.name || "N/A",
            totalDistance: `${totalDistance} km`,
            destinations:
              trip.places?.map((place) => ({
                name: place.name || "N/A",
                stay: place.avgTime || "24 hrs",
                date: new Date(trip.startDate).toLocaleDateString(),
              })) || [],
          };
        });

        setUpcomingTrips(mappedUpcoming);
        setCompletedTrips(mappedCompleted); // <-- use mappedCompleted here

        // Default select first upcoming trip if exists
        setSelectedTrip(mappedUpcoming[0] || null);
      } catch (err) {
        console.error("Failed to fetch trip data:", err);
      }
    };

    fetchTrips();

    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".menu-dropdown") &&
        !event.target.closest(".menu-icon")
      ) {
        setMenuOpen(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
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
            avgSpent: `LKR ${totalSpent.toLocaleString()}`,
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
            <span className="bell-icon">🔔</span>
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
                  <h4 style={{ fontWeight: "bold" }}>Pending Invitations</h4>
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
                    <div key={invite.tripId} className="notification-item">
                      <strong>{invite.tripName}</strong>
                      <div className="notification-buttons">
                        <button
                          onClick={() => respondToInvite(invite.tripId, true)}
                        >
                          Accept
                        </button>
                        <button
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
                  <h3 style={{ fontWeight: "bold" }}>{trip.name}</h3>
                  <p>Start Date: {trip.startDate?.slice(0, 10)}</p>
                  <p>Avg. Spent: {trip.avgSpent}</p>
                  <p>Start Location: {trip.startLocation}</p>
                  <p>Total Distance: {trip.totalDistance}</p>
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
                        Collaborators
                      </div>
                      <div
                        className="menu-option"
                        onClick={() => setShowPopup("share")}
                      >
                        Share Trip
                      </div>

                      <div
                        className="menu-option delete"
                        onClick={() => setConfirmDeleteTrip(trip.id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                  <div className="trip-card-actions">
                    <button
                      className="set-dates-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Trip Data:", trip);
                        console.log("TripPlaces:", trip.TripPlaces);
                        // Pre-fill dates with null values
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
                      Set Dates
                    </button>

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
                    {index + 1}.&nbsp;{dest.name} - {dest.stay}
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
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ul className="search-results">
              {searchResults
                .filter(
                  (user) =>
                    user.id !== currentUserId && // ✅ Exclude self
                    !existingCollaborators.some((c) => c.id === user.id) // ✅ Exclude already added
                )
                .map((user) => {
                  const alreadySelected = selectedUsers.some(
                    (u) => u.id === user.id
                  );

                  return (
                    <li key={user.id} className="search-item">
                      <span>{user.username}</span>
                      {alreadySelected ? (
                        <span style={{ marginLeft: "10px", color: "gray" }}>
                          Selected
                        </span>
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

            {existingCollaborators.length > 0 && (
              <div className="existing-collaborators">
                <h3>Collaborators</h3>
                <ul>
                  {existingCollaborators
                    .sort((a, b) =>
                      String(a.id) === String(currentUserId)
                        ? -1
                        : String(b.id) === String(currentUserId)
                        ? 1
                        : 0
                    )
                    .map((user) => (
                      <li key={user.id}>
                        {user.username}{" "}
                        {String(user.id) === String(currentUserId) && (
                          <em style={{ color: "gray" }}>(Owner)</em>
                        )}
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
                <div className="selected-users">
                  {selectedUsers.map((user) => (
                    <div className="selected-user" key={user.id}>
                      {user.username}
                      <button
                        className="remove-btn"
                        onClick={() =>
                          setSelectedUsers(
                            selectedUsers.filter((u) => u.id !== user.id)
                          )
                        }
                      >
                        ❌
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

                      alert("Collaborators saved!");

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
                      setUpcomingTrips((prev) =>
                        prev.filter((trip) => trip.id !== confirmDeleteTrip)
                      );
                      setCompletedTrips((prev) =>
                        prev.filter((trip) => trip.id !== confirmDeleteTrip)
                      );
                      setConfirmDeleteTrip(null);
                      alert("Trip deleted successfully.");
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
                    alert("Trip dates saved successfully!");
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
    </div>
  );
};

export default AllTrips;
