import React, { useState, useEffect } from "react";
import "./AllTrips.css";
import TripDashboard from "../TripDashboard";
import ShareTripModal from "./Components/Modals/ShareTripModal";
import InviteCollaboratorsModal from "./Components/Modals/InviteCollaboratorsModal";
import DeleteTripModal from "./Components/Modals/DeleteTripModal";
import SetTripDatesModal from "./Components/Modals/SetTripDatesModal";
import NotificationPanel from "./Components/Notifications/NotificationPanel";

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
    if (selectedTrip && showPopup === "invite") {
      console.log("selectedTrip.userId:", selectedTrip.userId);
      existingCollaborators.forEach((u) =>
        console.log("collaborator id:", u.id)
      );
    }
  }, [selectedTrip, existingCollaborators, showPopup]);

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
            <NotificationPanel
              pendingInvites={pendingInvites}
              onClose={() => setShowNotifications(false)}
              onRespondToInvite={respondToInvite}
            />
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
                        onClick={() => {
                          setShowPopup("invite");
                          setMenuOpen(null);
                        }}
                      >
                        <Users size={16} style={{ marginRight: "8px" }} />
                        Collaborators
                      </div>
                      <div
                        className="menu-option"
                        onClick={() => {
                          setShowPopup("share");
                          setMenuOpen(null);
                        }}
                      >
                        <Share2 size={16} style={{ marginRight: "8px" }} />
                        Share Trip
                      </div>
                      <div
                        className="menu-option delete"
                        onClick={() => {
                          setConfirmDeleteTrip(trip.id);
                          setMenuOpen(null);
                        }}
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

      {showPopup === "invite" && selectedTrip && (
        <InviteCollaboratorsModal
          selectedTrip={selectedTrip}
          currentUserId={currentUserId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          existingCollaborators={existingCollaborators}
          pendingTripInvites={pendingTripInvites}
          setShowPopup={setShowPopup}
          setSuccessMessage={setSuccessMessage}
          setSearchResults={setSearchResults}
          refreshCollaborators={async () => {
            const res = await fetch(
              `http://localhost:5030/api/trips/get-collaborators?tripId=${selectedTrip.id}`
            );
            const data = await res.json();
            setExistingCollaborators(data);
          }}
        />
      )}

      {confirmDeleteTrip && (
        <DeleteTripModal
          tripId={confirmDeleteTrip}
          onClose={() => setConfirmDeleteTrip(null)}
          onDeleteConfirm={async () => {
            try {
              const res = await fetch(
                `http://localhost:5030/api/trips/${confirmDeleteTrip}`,
                { method: "DELETE" }
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
        />
      )}

      {showSetDatesPopup && (
        <SetTripDatesModal
          trip={selectedTrip}
          tripPlaceDates={tripPlaceDates}
          setTripPlaceDates={setTripPlaceDates}
          onClose={() => setShowSetDatesPopup(false)}
          onSave={async () => {
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
        />
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

      {showPopup === "share" && selectedTrip && (
        <ShareTripModal
          tripId={selectedTrip.id}
          onClose={() => setShowPopup(null)}
        />
      )}
    </div>
  );
};

export default AllTrips;
