import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./AllTrips.css";
import TripDashboard from "../TripDashboard";

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

  const addCollaborator = (userId) => {
    fetch(
      `http://localhost:5030/api/trips/add-collaborator?tripId=${tripId}&userId=${userId}`,
      {
        method: "POST",
      }
    ).then((res) => {
      if (res.ok) {
        alert("Collaborator added!");
        setShowPopup(null);
      } else {
        res.text().then((msg) => alert(msg));
      }
    });
  };

  useEffect(() => {
    if (showPopup === "invite" && selectedTrip) {
      fetch(
        `http://localhost:5030/api/trips/get-collaborators?tripId=${selectedTrip.id}`
      )
        .then((res) => res.json())
        .then((data) => setExistingCollaborators(data))
        .catch((err) => console.error("Failed to load collaborators", err));
    }
  }, [showPopup, selectedTrip]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("http://localhost:5030/api/trips");
        const trips = await res.json();

        const today = new Date();
        const upcoming = trips.filter((t) => new Date(t.startDate) >= today);
        const completed = trips.filter((t) => new Date(t.startDate) < today);

        const totalPlaces = trips.reduce(
          (acc, trip) => acc + (trip.tripPlaces?.length || 0),
          0
        );
        const totalDistance = trips.reduce(
          (acc, trip) => acc + (trip.tripDistance || 0),
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
          travelDistance: `${totalDistance} km`,
          nextTripDate,
        });

        const mappedUpcoming = upcoming.map((trip) => ({
          ...trip,
          name: trip.tripName,
          avgSpent: `LKR ${Number(trip.totalSpend || 0).toLocaleString()}`,
          startLocation: trip.places?.[0]?.name || "N/A",
          totalDistance: `${trip.tripDistance || 0} km`,
          destinations:
            trip.places?.map((place, i) => ({
              name: place.name || "N/A",
              stay: place.avgTime || "24 hrs",
              date: new Date(trip.startDate).toLocaleDateString(),
            })) || [],
        }));

        setUpcomingTrips(mappedUpcoming);
        setCompletedTrips(completed);
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

  const toggleMenu = (tripId) => {
    setMenuOpen(menuOpen === tripId ? null : tripId);
  };

  const deleteTrip = (tripId) => {
    setUpcomingTrips(upcomingTrips.filter((trip) => trip.id !== tripId));
  };

  const markAsCompleted = (tripId) => {
    const tripToMove = upcomingTrips.find((trip) => trip.id === tripId);
    if (tripToMove) {
      setCompletedTrips([...completedTrips, tripToMove]);
      setUpcomingTrips(upcomingTrips.filter((trip) => trip.id !== tripId));
    }
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
        <div className="stat-box">
          Travel Distance: {tripStats.travelDistance}
        </div>
        <div className="stat-box">Next Trip Date: {tripStats.nextTripDate}</div>
      </div>

      <div className="trips-content">
        <div className="trip-list-container">
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
          </div>
          <div className="trip-list">
            {(activeTab === "upcoming" ? upcomingTrips : completedTrips).map(
              (trip) => (
                <div
                  key={trip.id}
                  className={`trip-card ${
                    selectedTrip?.id === trip.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTrip(trip)}
                >
                  <h3>{trip.name}</h3>
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
                      {activeTab === "upcoming" && (
                        <div
                          className="menu-option"
                          onClick={() => markAsCompleted(trip.id)}
                        >
                          Mark as Completed
                        </div>
                      )}
                      <div
                        className="menu-option delete"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Viewing trip: ${trip.name}`);
                      navigate("/trip-dashboard"); // navigate to TripDashboard page
                    }}
                  >
                    View
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="trip-details">
          {selectedTrip ? (
            <>
              <h2>{selectedTrip.name}</h2>
              <ul>
                {selectedTrip.destinations?.map((dest, index) => (
                  <li key={index}>
                    {dest.name} - {dest.stay} | {dest.date}
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
              {searchResults.map((user) => (
                <li key={user.id} className="search-item">
                  <span>{user.username}</span>
                  <button
                    className="add-btn"
                    onClick={() => {
                      if (!selectedUsers.some((u) => u.id === user.id)) {
                        setSelectedUsers([...selectedUsers, user]);
                      }
                    }}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
            {existingCollaborators.length > 0 && (
              <div className="existing-collaborators">
                <h3>Collaborators</h3>
                <ul>
                  {existingCollaborators.map((user) => (
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
                            `http://localhost:5030/api/trips/add-collaborator?tripId=${selectedTrip.id}&userId=${user.id}`,
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
    </div>
  );
};

export default AllTrips;
